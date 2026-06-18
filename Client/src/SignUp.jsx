import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { User, Mail, Lock, Phone, MapPin, PawPrint, Eye, EyeOff, ArrowRight, CheckCircle, Info } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const API = "http://localhost:8000/api/v1"

export default function SignUp() {
  const navigate = useNavigate()
  const [role, setRole] = useState("user")
  const [step, setStep] = useState("form") // form | otp
  const [devOtp, setDevOtp] = useState("")
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [otpInput, setOtpInput] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errs, setErrs] = useState({})
  const [accepted, setAccepted] = useState(false)
  const [form, setForm] = useState({
    username:"", email:"", password:"", contact:"", address:"",
    adoptionCenterName:"", adoptionCenterDescription:"",
    shopName:"", shopDescription:""
  })

  const ep = (t) => `${API}/${role==="user"?"users":role==="petShop"?"pet-shops":"adoption-centers"}/${t}`

  const change = (e) => {
    setForm(p => ({...p, [e.target.name]: e.target.value}))
    setErrs(p => ({...p, [e.target.name]: ""}))
  }

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = "Required"
    if (!form.email.trim()) e.email = "Required"
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email"
    if (!form.password) e.password = "Required"
    else if (form.password.length < 8) e.password = "Min 8 characters"
    if (!form.contact.trim()) e.contact = "Required"
    else if (!/^\d{10}$/.test(form.contact.replace(/\D/g,""))) e.contact = "Enter 10-digit number"
    if (!form.address.trim()) e.address = "Required"
    if (role==="adoptionCenter") {
      if (!form.adoptionCenterName.trim()) e.adoptionCenterName = "Required"
      if (!form.adoptionCenterDescription.trim()) e.adoptionCenterDescription = "Required"
    }
    if (role==="petShop") {
      if (!form.shopName.trim()) e.shopName = "Required"
    }
    if (!accepted) e.terms = "Please accept terms"
    setErrs(e)
    return !Object.keys(e).length
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const body = {
        email: form.email.trim().toLowerCase(),
        username: form.username.trim(),
        password: form.password,
        contact: form.contact.trim(),
        address: form.address.trim(),
        role,
      }
      if (role==="adoptionCenter") {
        body.adoptionCenterName = form.adoptionCenterName.trim()
        body.adoptionCenterDescription = form.adoptionCenterDescription.trim()
      }
      if (role==="petShop") {
        body.shopName = form.shopName.trim().toLowerCase()
        body.shopDescription = form.shopDescription.trim()
      }
      const res = await axios.post(ep("register"), body)
      setRegisteredEmail(form.email)
      if (res.data?.data?.otp) {
        setDevOtp(res.data.data.otp)
        toast.info(`🛠 Dev mode — OTP: ${res.data.data.otp}`, { autoClose: false })
      } else {
        toast.success("OTP sent to your email! 📧")
      }
      setStep("otp")
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed"
      toast.error(msg)
      if (/email|username|already/i.test(msg)) setErrs({ email: msg })
    } finally { setLoading(false) }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!otpInput.trim()) { toast.error("Enter the OTP"); return }
    setLoading(true)
    try {
      await axios.post(ep("verify-otp"), { email: registeredEmail, otp: otpInput.trim() }, { withCredentials: true })
      toast.success("Account created! Redirecting to sign in… 🎉")
      setTimeout(() => navigate("/signin"), 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP")
      setOtpInput("")
    } finally { setLoading(false) }
  }

  const roles = [
    {id:"user", label:"Pet Owner", emoji:"🐾"},
    {id:"adoptionCenter", label:"Adoption Center", emoji:"❤️"},
    {id:"petShop", label:"Pet Shop", emoji:"🏪"},
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *{box-sizing:border-box}
        .su-page{min-height:100vh;background:#FFF8F3;display:flex;align-items:flex-start;justify-content:center;padding:2rem;font-family:'Nunito',sans-serif}
        .su-box{background:white;border-radius:28px;width:100%;max-width:560px;padding:2.5rem;box-shadow:0 8px 40px rgba(255,107,53,.1);border:1px solid rgba(255,107,53,.1);margin:auto}
        .su-logo{display:flex;align-items:center;gap:10px;font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:800;color:#FF6B35;margin-bottom:1.5rem;text-decoration:none}
        .su-logo-icon{background:linear-gradient(135deg,#FF6B35,#FF8C5A);border-radius:10px;padding:7px;display:flex}
        .su-logo-icon svg{color:white;width:20px;height:20px}
        .su-title{font-family:'Playfair Display',serif;font-size:2rem;font-weight:800;color:#1A1A2E;margin-bottom:.3rem}
        .su-sub{color:#7A7A8C;font-size:.9rem;margin-bottom:1.6rem}
        .role-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:1.6rem;background:#FFF0E6;border-radius:14px;padding:5px}
        .role-tab{display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 5px;border-radius:10px;border:none;background:transparent;cursor:pointer;transition:all .22s;font-family:'Nunito',sans-serif}
        .role-tab.active{background:white;box-shadow:0 2px 10px rgba(255,107,53,.15)}
        .role-tab-emoji{font-size:1.2rem}
        .role-tab-label{font-size:.68rem;font-weight:800;color:#BDBDBD}
        .role-tab.active .role-tab-label{color:#FF6B35}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .ff{margin-bottom:.2rem}
        .ff.full{grid-column:1/-1}
        .fl{font-size:.8rem;font-weight:800;color:#4A4A5A;margin-bottom:4px;display:block}
        .fw{position:relative}
        .fi{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#C8C0B8;display:flex}
        .fi svg{width:16px;height:16px}
        .fi-input,.fi-textarea{width:100%;padding:11px 13px 11px 40px;border:2px solid #F0E6DC;border-radius:12px;font-size:.9rem;font-family:'Nunito',sans-serif;background:white;color:#2D2D2D;outline:none;transition:border-color .2s}
        .fi-input:focus,.fi-textarea:focus{border-color:#FF6B35;box-shadow:0 0 0 3px rgba(255,107,53,.08)}
        .fi-input.e{border-color:#FF4444}
        .fi-textarea{padding-left:13px;min-height:75px;resize:vertical}
        .fe{font-size:.74rem;color:#FF4444;margin-top:3px;font-weight:700}
        .eye-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#C0B8B0;cursor:pointer;display:flex}
        .eye-btn:hover{color:#FF6B35}
        .terms-row{display:flex;align-items:flex-start;gap:10px;margin:1rem 0 .5rem}
        .terms-row input{margin-top:3px;accent-color:#FF6B35;cursor:pointer;flex-shrink:0}
        .terms-row label{font-size:.82rem;color:#7A7A8C;line-height:1.5;cursor:pointer}
        .terms-row a{color:#FF6B35;font-weight:700}
        .sub-btn{width:100%;padding:13px;border:none;border-radius:12px;background:linear-gradient(135deg,#FF6B35,#FF8C5A);color:white;font-size:.97rem;font-weight:800;cursor:pointer;transition:all .3s;box-shadow:0 4px 16px rgba(255,107,53,.3);display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Nunito',sans-serif;margin-top:1rem}
        .sub-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,107,53,.4)}
        .sub-btn:disabled{opacity:.65;cursor:not-allowed}
        .su-footer{text-align:center;margin-top:1.2rem;font-size:.87rem;color:#7A7A8C}
        .su-footer a{color:#FF6B35;font-weight:800;text-decoration:none}
        /* OTP */
        .otp-emoji{font-size:3.5rem;display:block;text-align:center;margin-bottom:1rem;animation:float 2.5s ease-in-out infinite}
        .otp-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:800;color:#1A1A2E;text-align:center;margin-bottom:.4rem}
        .otp-sub{color:#7A7A8C;font-size:.9rem;text-align:center;margin-bottom:1.5rem;line-height:1.6}
        .otp-sub strong{color:#FF6B35}
        .dev-banner{background:linear-gradient(135deg,#FFF3CD,#FFE69C);border:2px solid #FFB830;border-radius:14px;padding:1rem 1.2rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:12px}
        .dev-banner svg{color:#CC8800;flex-shrink:0}
        .dev-code{font-size:2.2rem;font-weight:900;color:#FF6B35;letter-spacing:8px;font-family:monospace;display:block;margin-top:4px}
        .otp-input{width:100%;padding:16px;text-align:center;font-size:2rem;font-weight:900;letter-spacing:12px;border:2px solid #F0E6DC;border-radius:14px;outline:none;color:#1A1A2E;font-family:'Nunito',sans-serif;margin-bottom:1.5rem;transition:border-color .2s}
        .otp-input:focus{border-color:#FF6B35;box-shadow:0 0 0 3px rgba(255,107,53,.1)}
        .spinner{width:16px;height:16px;border:3px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;flex-shrink:0}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
      <ToastContainer position="top-right" theme="colored" />
      <div className="su-page">
        <div className="su-box">
          {step === "form" ? (
            <>
              <Link to="/signin" className="su-logo">
                <span className="su-logo-icon"><PawPrint /></span>PawPartner
              </Link>
              <h1 className="su-title">Create Account 🐾</h1>
              <p className="su-sub">Join thousands of pet lovers on PawPartner</p>
              <div className="role-tabs">
                {roles.map(r => (
                  <button key={r.id} className={`role-tab${role===r.id?" active":""}`} onClick={() => { setRole(r.id); setErrs({}) }}>
                    <span className="role-tab-emoji">{r.emoji}</span>
                    <span className="role-tab-label">{r.label}</span>
                  </button>
                ))}
              </div>
              <form onSubmit={handleRegister}>
                <div className="grid2">
                  <div className="ff">
                    <label className="fl">Username *</label>
                    <div className="fw"><span className="fi"><User size={16}/></span>
                      <input className={`fi-input${errs.username?" e":""}`} type="text" name="username" placeholder="johndoe" value={form.username} onChange={change}/>
                    </div>{errs.username && <div className="fe">⚠ {errs.username}</div>}
                  </div>
                  <div className="ff">
                    <label className="fl">Email *</label>
                    <div className="fw"><span className="fi"><Mail size={16}/></span>
                      <input className={`fi-input${errs.email?" e":""}`} type="email" name="email" placeholder="you@email.com" value={form.email} onChange={change}/>
                    </div>{errs.email && <div className="fe">⚠ {errs.email}</div>}
                  </div>
                  <div className="ff">
                    <label className="fl">Password *</label>
                    <div className="fw"><span className="fi"><Lock size={16}/></span>
                      <input className={`fi-input${errs.password?" e":""}`} type={showPw?"text":"password"} name="password" placeholder="Min 8 characters" value={form.password} onChange={change}/>
                      <button type="button" className="eye-btn" onClick={()=>setShowPw(s=>!s)}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
                    </div>{errs.password && <div className="fe">⚠ {errs.password}</div>}
                  </div>
                  <div className="ff">
                    <label className="fl">Contact *</label>
                    <div className="fw"><span className="fi"><Phone size={16}/></span>
                      <input className={`fi-input${errs.contact?" e":""}`} type="tel" name="contact" placeholder="10-digit number" value={form.contact} onChange={change}/>
                    </div>{errs.contact && <div className="fe">⚠ {errs.contact}</div>}
                  </div>
                  <div className="ff full">
                    <label className="fl">Address *</label>
                    <div className="fw"><span className="fi"><MapPin size={16}/></span>
                      <input className={`fi-input${errs.address?" e":""}`} type="text" name="address" placeholder="Your city / full address" value={form.address} onChange={change}/>
                    </div>{errs.address && <div className="fe">⚠ {errs.address}</div>}
                  </div>
                  {role==="adoptionCenter" && <>
                    <div className="ff full">
                      <label className="fl">Adoption Center Name *</label>
                      <input className={`fi-input${errs.adoptionCenterName?" e":""}`} style={{paddingLeft:13}} type="text" name="adoptionCenterName" placeholder="e.g. Happy Paws Shelter" value={form.adoptionCenterName} onChange={change}/>
                      {errs.adoptionCenterName && <div className="fe">⚠ {errs.adoptionCenterName}</div>}
                    </div>
                    <div className="ff full">
                      <label className="fl">Description *</label>
                      <textarea className={`fi-textarea${errs.adoptionCenterDescription?" e":""}`} name="adoptionCenterDescription" placeholder="Tell us about your adoption center..." value={form.adoptionCenterDescription} onChange={change}/>
                      {errs.adoptionCenterDescription && <div className="fe">⚠ {errs.adoptionCenterDescription}</div>}
                    </div>
                  </>}
                  {role==="petShop" && <>
                    <div className="ff full">
                      <label className="fl">Shop Name *</label>
                      <input className={`fi-input${errs.shopName?" e":""}`} style={{paddingLeft:13}} type="text" name="shopName" placeholder="e.g. pawsome treats" value={form.shopName} onChange={change}/>
                      {errs.shopName && <div className="fe">⚠ {errs.shopName}</div>}
                    </div>
                    <div className="ff full">
                      <label className="fl">Description</label>
                      <textarea className="fi-textarea" name="shopDescription" placeholder="Tell us about your pet shop..." value={form.shopDescription} onChange={change}/>
                    </div>
                  </>}
                </div>
                <div className="terms-row">
                  <input type="checkbox" id="terms" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/>
                  <label htmlFor="terms">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
                </div>
                {errs.terms && <div className="fe">⚠ {errs.terms}</div>}
                <button type="submit" className="sub-btn" disabled={loading}>
                  {loading ? <span className="spinner"/> : <ArrowRight size={16}/>}
                  {loading ? "Creating Account…" : "Create Account"}
                </button>
              </form>
              <div className="su-footer">Already have an account? <Link to="/signin">Sign in</Link></div>
            </>
          ) : (
            <>
              <span className="otp-emoji">📧</span>
              <h2 className="otp-title">Verify Your Email</h2>
              <p className="otp-sub">Enter the 6-digit OTP sent to <strong>{registeredEmail}</strong></p>
              {devOtp && (
                <div className="dev-banner">
                  <Info size={20}/>
                  <div>
                    <strong style={{fontSize:".82rem",color:"#8A5A00",display:"block"}}>🛠 Dev Mode — No email configured. Your OTP:</strong>
                    <span className="dev-code">{devOtp}</span>
                  </div>
                </div>
              )}
              <form onSubmit={handleVerify}>
                <input className="otp-input" type="text" placeholder="123456"
                  value={otpInput} onChange={e=>setOtpInput(e.target.value.replace(/\D/g,"").slice(0,6))} maxLength={6}/>
                <button type="submit" className="sub-btn" disabled={loading}>
                  {loading ? <span className="spinner"/> : <CheckCircle size={16}/>}
                  {loading ? "Verifying…" : "Verify & Create Account"}
                </button>
              </form>
              <p style={{textAlign:"center",marginTop:"1rem",fontSize:".85rem",color:"#7A7A8C"}}>
                Wrong email?{" "}
                <span style={{color:"#FF6B35",fontWeight:800,cursor:"pointer"}} onClick={()=>{setStep("form");setDevOtp("")}}>Go back</span>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
