import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle, Info } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const API = "http://localhost:8000/api/v1"

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step,     setStep]     = useState(1) // 1=email 2=otp 3=newpw 4=done
  const [role,     setRole]     = useState("user")
  const [email,    setEmail]    = useState("")
  const [otp,      setOtp]      = useState(["","","","","",""])
  const [devOtp,   setDevOtp]   = useState("")
  const [pw,       setPw]       = useState("")
  const [cpw,      setCpw]      = useState("")
  const [showPw,   setShowPw]   = useState(false)
  const [showCPw,  setShowCPw]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [timer,    setTimer]    = useState(0)
  const [errs,     setErrs]     = useState({})
  const refs = useRef([])

  useEffect(() => {
    if (timer <= 0) return
    const t = setInterval(() => setTimer(n => n - 1), 1000)
    return () => clearInterval(t)
  }, [timer])

  const ep = () => ({ user:`${API}/users`, adoptionCenter:`${API}/adoption-centers`, petShop:`${API}/pet-shops` }[role])

  const STEPS = [
    { n:1, label:"Email" }, { n:2, label:"OTP" },
    { n:3, label:"New Password" }, { n:4, label:"Done" }
  ]
  const ROLES = [
    { id:"user", label:"Pet Owner", emoji:"🐾" },
    { id:"adoptionCenter", label:"Adoption Center", emoji:"❤️" },
    { id:"petShop", label:"Pet Shop", emoji:"🏪" },
  ]

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setErrs({ email:"Email is required" }); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setErrs({ email:"Invalid email format" }); return }
    setLoading(true)
    try {
      const res = await axios.post(`${ep()}/forgot-password`, { email })
      if (res.data?.data?.otp) setDevOtp(res.data.data.otp)
      toast.success("OTP sent! 📧"); setStep(2); setTimer(60)
    } catch (err) { toast.error(err.response?.data?.message || "Email not found") }
    finally { setLoading(false) }
  }

  const handleOtpChange = (i, val) => {
    if (val.length > 1) val = val.slice(-1)
    const n = [...otp]; n[i] = val; setOtp(n)
    if (val && i < 5) refs.current[i+1]?.focus()
  }
  const handleOtpKey = (i, e) => {
    if (e.key==="Backspace" && !otp[i] && i > 0) {
      const n=[...otp]; n[i-1]=""; setOtp(n); refs.current[i-1]?.focus()
    }
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    if (otp.join("").length !== 6) { setErrs({ otp:"Enter all 6 digits" }); return }
    setStep(3)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    const e2 = {}
    if (!pw) e2.pw = "Required"
    else if (pw.length < 8) e2.pw = "Minimum 8 characters"
    if (!cpw) e2.cpw = "Required"
    else if (pw !== cpw) e2.cpw = "Passwords don't match"
    if (Object.keys(e2).length) { setErrs(e2); return }
    setLoading(true)
    try {
      await axios.post(`${ep()}/verify-reset-password-otp`, { email, otp: otp.join(""), newPassword: pw })
      toast.success("Password reset! 🎉"); setStep(4)
    } catch (err) { toast.error(err.response?.data?.message || "Reset failed") }
    finally { setLoading(false) }
  }

  const handleResend = async () => {
    try {
      const res = await axios.post(`${ep()}/forgot-password`, { email })
      if (res.data?.data?.otp) setDevOtp(res.data.data.otp)
      toast.success("New OTP sent!"); setTimer(60)
    } catch { toast.error("Failed to resend") }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *{box-sizing:border-box}
        .fp-page{min-height:100vh;background:#FFF8F3;display:flex;align-items:center;justify-content:center;padding:2rem;font-family:'Nunito',sans-serif}
        .fp-box{background:white;border-radius:28px;width:100%;max-width:460px;padding:2.5rem;box-shadow:0 8px 40px rgba(255,107,53,.1);border:1px solid rgba(255,107,53,.1)}
        .fp-back{display:inline-flex;align-items:center;gap:6px;color:#7A7A8C;font-size:.85rem;font-weight:700;text-decoration:none;margin-bottom:1.5rem;transition:color .2s}
        .fp-back:hover{color:#FF6B35}
        /* steps */
        .fp-steps{display:flex;align-items:center;margin-bottom:2rem}
        .fp-step{display:flex;flex-direction:column;align-items:center;flex:1}
        .fp-step-c{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:800;transition:all .3s}
        .fp-step-c.done{background:linear-gradient(135deg,#4ECDC4,#35B5AC);color:white}
        .fp-step-c.active{background:linear-gradient(135deg,#FF6B35,#FF8C5A);color:white;box-shadow:0 4px 12px rgba(255,107,53,.3)}
        .fp-step-c.pending{background:#F0E6DC;color:#BDBDBD}
        .fp-step-l{font-size:.65rem;font-weight:700;color:#BDBDBD;margin-top:3px}
        .fp-step-l.active{color:#FF6B35}
        .fp-line{flex:1;height:2px;background:#F0E6DC;margin:0 3px 14px;transition:background .3s}
        .fp-line.done{background:#4ECDC4}
        /* content */
        .fp-emoji{font-size:3.2rem;display:block;text-align:center;margin-bottom:.8rem;animation:float 2.5s ease-in-out infinite}
        .fp-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:800;color:#1A1A2E;text-align:center;margin-bottom:.4rem}
        .fp-sub{color:#7A7A8C;font-size:.88rem;text-align:center;margin-bottom:1.5rem;line-height:1.6}
        .fp-sub strong{color:#FF6B35}
        /* role tabs */
        .fp-rtabs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:1.4rem;background:#FFF0E6;border-radius:13px;padding:4px}
        .fp-rtab{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 4px;border-radius:9px;border:none;background:transparent;cursor:pointer;font-family:'Nunito',sans-serif;transition:all .2s}
        .fp-rtab.active{background:white;box-shadow:0 2px 8px rgba(255,107,53,.15)}
        .fp-rtab-e{font-size:1.1rem}
        .fp-rtab-l{font-size:.67rem;font-weight:800;color:#BDBDBD}
        .fp-rtab.active .fp-rtab-l{color:#FF6B35}
        /* field */
        .fp-field{margin-bottom:1.1rem}
        .fp-label{font-size:.8rem;font-weight:800;color:#4A4A5A;margin-bottom:4px;display:block}
        .fp-wrap{position:relative}
        .fp-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#C8C0B8;display:flex}
        .fp-icon svg{width:16px;height:16px}
        .fp-input{width:100%;padding:12px 13px 12px 41px;border:2px solid #F0E6DC;border-radius:13px;font-size:.92rem;font-family:'Nunito',sans-serif;background:white;color:#2D2D2D;outline:none;transition:all .22s}
        .fp-input:focus{border-color:#FF6B35;box-shadow:0 0 0 3px rgba(255,107,53,.1)}
        .fp-input.e{border-color:#FF4444}
        .fp-fe{font-size:.74rem;color:#FF4444;margin-top:3px;font-weight:700}
        .fp-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#C0B8B0;cursor:pointer;display:flex}
        .fp-eye:hover{color:#FF6B35}
        /* dev OTP banner */
        .fp-dev{background:linear-gradient(135deg,#FFF3CD,#FFE69C);border:2px solid #FFB830;border-radius:13px;padding:.9rem 1.1rem;margin-bottom:1.3rem;display:flex;align-items:center;gap:10px}
        .fp-dev svg{color:#CC8800;flex-shrink:0}
        .fp-dev-code{font-size:2rem;font-weight:900;color:#FF6B35;letter-spacing:8px;font-family:monospace;display:block;margin-top:3px}
        /* OTP grid */
        .fp-otp-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:.4rem}
        .fp-otp-box{aspect-ratio:1;text-align:center;font-size:1.4rem;font-weight:900;border:2px solid #F0E6DC;border-radius:11px;outline:none;font-family:'Nunito',sans-serif;color:#1A1A2E;transition:border-color .2s;background:white;width:100%}
        .fp-otp-box:focus{border-color:#FF6B35;box-shadow:0 0 0 3px rgba(255,107,53,.1)}
        .fp-otp-box.filled{border-color:rgba(255,107,53,.5);background:rgba(255,107,53,.04)}
        .fp-resend{text-align:center;margin:1rem 0 1.3rem;font-size:.83rem;color:#7A7A8C}
        .fp-resend-btn{color:#FF6B35;font-weight:800;background:none;border:none;cursor:pointer;font-family:'Nunito',sans-serif}
        .fp-resend-btn:disabled{color:#BDBDBD;cursor:default}
        /* buttons */
        .fp-btn{width:100%;padding:13px;border:none;border-radius:13px;background:linear-gradient(135deg,#FF6B35,#FF8C5A);color:white;font-size:.97rem;font-weight:800;cursor:pointer;transition:all .3s;box-shadow:0 5px 18px rgba(255,107,53,.3);display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Nunito',sans-serif}
        .fp-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 9px 24px rgba(255,107,53,.4)}
        .fp-btn:disabled{opacity:.65;cursor:not-allowed;transform:none}
        /* success */
        .fp-success{text-align:center}
        .fp-success-icon{width:76px;height:76px;border-radius:50%;background:linear-gradient(135deg,#4ECDC4,#35B5AC);display:flex;align-items:center;justify-content:center;margin:0 auto 1.3rem}
        .fp-success-icon svg{color:white;width:38px;height:38px}
        .spinner{width:16px;height:16px;border:3px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;flex-shrink:0}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
      <ToastContainer position="top-right" theme="colored"/>
      <div className="fp-page">
        <div className="fp-box">
          <Link to="/signin" className="fp-back"><ArrowLeft size={15}/> Back to Sign In</Link>

          {/* PROGRESS STEPS */}
          <div className="fp-steps">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.n}>
                <div className="fp-step">
                  <div className={`fp-step-c ${step>s.n?"done":step===s.n?"active":"pending"}`}>
                    {step>s.n ? <CheckCircle size={14}/> : s.n}
                  </div>
                  <span className={`fp-step-l${step===s.n?" active":""}`}>{s.label}</span>
                </div>
                {i < STEPS.length-1 && <div className={`fp-line${step>s.n?" done":""}`}/>}
              </React.Fragment>
            ))}
          </div>

          {/* STEP 1 — EMAIL */}
          {step===1 && (
            <>
              <span className="fp-emoji">🔐</span>
              <h2 className="fp-title">Forgot Password?</h2>
              <p className="fp-sub">Enter your email and we'll send you a reset OTP.</p>
              <div className="fp-rtabs">
                {ROLES.map(r=>(
                  <button key={r.id} className={`fp-rtab${role===r.id?" active":""}`} onClick={()=>setRole(r.id)}>
                    <span className="fp-rtab-e">{r.emoji}</span>
                    <span className="fp-rtab-l">{r.label}</span>
                  </button>
                ))}
              </div>
              <form onSubmit={handleRequestOtp}>
                <div className="fp-field">
                  <label className="fp-label">Email Address</label>
                  <div className="fp-wrap">
                    <span className="fp-icon"><Mail size={16}/></span>
                    <input className={`fp-input${errs.email?" e":""}`} type="email" placeholder="your@email.com"
                      value={email} onChange={e=>{setEmail(e.target.value);setErrs({})}}/>
                  </div>
                  {errs.email && <div className="fp-fe">⚠ {errs.email}</div>}
                </div>
                <button type="submit" className="fp-btn" disabled={loading}>
                  {loading?<span className="spinner"/>:<Mail size={16}/>} Send OTP
                </button>
              </form>
            </>
          )}

          {/* STEP 2 — OTP */}
          {step===2 && (
            <>
              <span className="fp-emoji">📧</span>
              <h2 className="fp-title">Check Your Email</h2>
              <p className="fp-sub">We sent a 6-digit code to <strong>{email}</strong></p>
              {devOtp && (
                <div className="fp-dev">
                  <Info size={18}/>
                  <div>
                    <strong style={{fontSize:".8rem",color:"#8A5A00",display:"block"}}>🛠 Dev Mode — Your OTP:</strong>
                    <span className="fp-dev-code">{devOtp}</span>
                  </div>
                </div>
              )}
              <form onSubmit={handleVerifyOtp}>
                <div className="fp-otp-grid">
                  {otp.map((d,i)=>(
                    <input key={i} ref={el=>refs.current[i]=el}
                      className={`fp-otp-box${d?" filled":""}`}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={e=>handleOtpChange(i,e.target.value)}
                      onKeyDown={e=>handleOtpKey(i,e)}/>
                  ))}
                </div>
                {errs.otp && <div className="fp-fe" style={{marginBottom:"1rem"}}>⚠ {errs.otp}</div>}
                <div className="fp-resend">
                  {timer>0
                    ? <span>Resend in <strong style={{color:"#FF6B35"}}>{timer}s</strong></span>
                    : <><span>Didn't get it? </span><button type="button" className="fp-resend-btn" onClick={handleResend}>Resend OTP</button></>
                  }
                </div>
                <button type="submit" className="fp-btn">
                  Verify OTP <ArrowRight size={16}/>
                </button>
              </form>
            </>
          )}

          {/* STEP 3 — NEW PASSWORD */}
          {step===3 && (
            <>
              <span className="fp-emoji">🔑</span>
              <h2 className="fp-title">New Password</h2>
              <p className="fp-sub">Choose a strong password for your account.</p>
              <form onSubmit={handleReset}>
                <div className="fp-field">
                  <label className="fp-label">New Password</label>
                  <div className="fp-wrap">
                    <span className="fp-icon"><Lock size={16}/></span>
                    <input className={`fp-input${errs.pw?" e":""}`} type={showPw?"text":"password"} placeholder="Minimum 8 characters"
                      value={pw} onChange={e=>{setPw(e.target.value);setErrs(p=>({...p,pw:""}))}}/>
                    <button type="button" className="fp-eye" onClick={()=>setShowPw(s=>!s)}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
                  </div>
                  {errs.pw && <div className="fp-fe">⚠ {errs.pw}</div>}
                </div>
                <div className="fp-field">
                  <label className="fp-label">Confirm Password</label>
                  <div className="fp-wrap">
                    <span className="fp-icon"><Lock size={16}/></span>
                    <input className={`fp-input${errs.cpw?" e":""}`} type={showCPw?"text":"password"} placeholder="Repeat your password"
                      value={cpw} onChange={e=>{setCpw(e.target.value);setErrs(p=>({...p,cpw:""}))}}/>
                    <button type="button" className="fp-eye" onClick={()=>setShowCPw(s=>!s)}>{showCPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
                  </div>
                  {errs.cpw && <div className="fp-fe">⚠ {errs.cpw}</div>}
                </div>
                <button type="submit" className="fp-btn" disabled={loading}>
                  {loading?<span className="spinner"/>:<CheckCircle size={16}/>} Reset Password
                </button>
              </form>
            </>
          )}

          {/* STEP 4 — SUCCESS */}
          {step===4 && (
            <div className="fp-success">
              <div className="fp-success-icon"><CheckCircle/></div>
              <h2 className="fp-title">Password Reset! 🎉</h2>
              <p className="fp-sub" style={{marginBottom:"2rem"}}>Your password has been updated. You can now sign in with your new password.</p>
              <button className="fp-btn" onClick={()=>navigate("/signin")}>
                Go to Sign In <ArrowRight size={16}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
