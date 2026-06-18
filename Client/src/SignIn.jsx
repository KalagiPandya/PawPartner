import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import axios from "axios"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const API = "http://localhost:8000/api/v1"

const DEMOS = [
  { role:"user",           label:"Pet Owner",       emoji:"🐾", email:"demo_owner@paw.com",  password:"Demo@1234", loginEp:`${API}/users/login`,            to:"/home" },
  { role:"adoptionCenter", label:"Adoption Center", emoji:"❤️", email:"demo_center@paw.com", password:"Demo@1234", loginEp:`${API}/adoption-centers/login`, to:"/adoption-center/dashboard" },
  { role:"petShop",        label:"Pet Shop",        emoji:"🏪", email:"demo_shop@paw.com",   password:"Demo@1234", loginEp:`${API}/pet-shops/login`,        to:"/pet-shop/dashboard" },
]

export default function SignIn() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [role,     setRole]     = useState("user")
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [demoLoad, setDemoLoad] = useState(null)
  const [errs,     setErrs]     = useState({})

  useEffect(() => {
    if (new URLSearchParams(location.search).get("error") === "google_failed")
      toast.error("Google sign-in failed.")
  }, [])

  const saveAndGo = (token, role, to) => {
    localStorage.setItem("token", token)
    localStorage.setItem("role",  role)
    toast.success("Welcome to PawPartner! 🐾")
    setTimeout(() => navigate(to), 600)
  }

  // Normal login
  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = {}
    if (!email)    e2.email    = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) e2.email = "Invalid email"
    if (!password) e2.password = "Password is required"
    if (Object.keys(e2).length) { setErrs(e2); return }
    setLoading(true)
    const eps = { user:`${API}/users/login`, adoptionCenter:`${API}/adoption-centers/login`, petShop:`${API}/pet-shops/login` }
    const tos = { user:"/home", adoptionCenter:"/adoption-center/dashboard", petShop:"/pet-shop/dashboard" }
    try {
      const res   = await axios.post(eps[role], { email: email.toLowerCase(), password }, { withCredentials:true })
      const token = res.data?.data?.accessToken
      if (!token) throw new Error("No token received")
      saveAndGo(token, role, tos[role])
    } catch (err) {
      const msg = err.response?.data?.message
        || (err.code === "ERR_NETWORK" ? "Cannot reach server. Make sure 'npm start' is running and MongoDB is on." : "Login failed.")
      toast.error(msg)
      if (/password/i.test(msg))          setErrs({ password: msg })
      else if (/found|exist/i.test(msg))  setErrs({ email: msg })
    } finally { setLoading(false) }
  }

  // Demo login — accounts are pre-seeded by the server on startup, so this is
  // always a simple, direct login. No registration, no OTP, no retries needed.
  const handleDemo = async (demo) => {
    setDemoLoad(demo.role)
    try {
      const res   = await axios.post(demo.loginEp, { email: demo.email, password: demo.password }, { withCredentials:true })
      const token = res.data?.data?.accessToken
      if (!token) throw new Error("No token received from server")
      toast.success(`Welcome, ${demo.label}! 🎉`)
      saveAndGo(token, demo.role, demo.to)
    } catch (err) {
      if (err.code === "ERR_NETWORK") {
        toast.error("Cannot reach the server. Run 'npm start' from the project root and make sure MongoDB is running (mongod).", { autoClose: 7000 })
      } else {
        const msg = err.response?.data?.message || err.message
        toast.error(
          `Demo login failed: ${msg}. Restart the server (npm start) — demo accounts are auto-created on every startup.`,
          { autoClose: 7000 }
        )
      }
    } finally { setDemoLoad(null) }
  }

  const ROLES = [
    { id:"user",           label:"Pet Owner",       emoji:"🐾" },
    { id:"adoptionCenter", label:"Adoption Center", emoji:"❤️" },
    { id:"petShop",        label:"Pet Shop",        emoji:"🏪" },
  ]
  const busy = loading || !!demoLoad

  return (
    <>
      <style>{`
        *{box-sizing:border-box}
        .si{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;font-family:'Nunito',sans-serif}
        .si-l{background:linear-gradient(135deg,#1A1A2E 0%,#16213E 60%,#0F3460 100%);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:3rem;position:relative;overflow:hidden}
        .si-l::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 70%,rgba(255,107,53,.2),transparent 50%),radial-gradient(circle at 80% 20%,rgba(78,205,196,.12),transparent 40%)}
        .si-lc{position:relative;z-index:1;text-align:center;color:white;width:100%;max-width:340px}
        .si-big{font-size:5rem;animation:float 3s ease-in-out infinite;display:block;margin-bottom:1.2rem}
        .si-brand{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:800;margin-bottom:.7rem;background:linear-gradient(135deg,white,rgba(255,140,90,.9));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .si-tag{color:rgba(255,255,255,.55);font-size:.95rem;line-height:1.7;margin-bottom:2rem}
        .si-feats{display:flex;flex-direction:column;gap:.8rem;margin-bottom:2rem}
        .si-feat{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.07);border-radius:14px;padding:10px 14px;text-align:left}
        .si-feat-e{font-size:1.2rem;flex-shrink:0}
        .si-feat-t{color:rgba(255,255,255,.8);font-size:.87rem;font-weight:600}
        .demo-title{font-size:.72rem;font-weight:800;color:rgba(255,255,255,.38);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:.7rem;text-align:left}
        .demo-btns{display:flex;flex-direction:column;gap:.45rem}
        .demo-btn{display:flex;align-items:center;gap:10px;width:100%;padding:11px 14px;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.14);border-radius:12px;color:white;font-size:.85rem;font-weight:700;cursor:pointer;transition:all .25s;font-family:'Nunito',sans-serif}
        .demo-btn:hover:not(:disabled){background:rgba(255,107,53,.22);border-color:rgba(255,107,53,.5);transform:translateX(3px)}
        .demo-btn:disabled{opacity:.45;cursor:not-allowed}
        .demo-main{flex:1;text-align:left}
        .demo-sub{font-size:.72rem;opacity:.6;display:block;font-weight:600;margin-top:2px}
        .si-r{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:3rem 2rem;background:#FFF8F3;overflow-y:auto}
        .si-box{width:100%;max-width:420px}
        .si-title{font-family:'Playfair Display',serif;font-size:2rem;font-weight:800;color:#1A1A2E;margin-bottom:.3rem}
        .si-sub{color:#7A7A8C;font-size:.92rem;margin-bottom:1.5rem}
        .rtabs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:1.5rem;background:#F0E6DC;border-radius:14px;padding:5px}
        .rtab{display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 4px;border-radius:10px;border:none;background:transparent;cursor:pointer;transition:all .22s;font-family:'Nunito',sans-serif}
        .rtab.a{background:white;box-shadow:0 2px 12px rgba(255,107,53,.15)}
        .rtab-e{font-size:1.2rem}.rtab-l{font-size:.67rem;font-weight:800;color:#BDBDBD}
        .rtab.a .rtab-l{color:#FF6B35}
        .field{margin-bottom:1rem}.fl{font-size:.8rem;font-weight:800;color:#4A4A5A;margin-bottom:4px;display:block}
        .fw{position:relative}.fi{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#C8C0B8;display:flex}
        .fi svg{width:16px;height:16px}
        .finput{width:100%;padding:12px 13px 12px 41px;border:2px solid #F0E6DC;border-radius:13px;font-size:.92rem;font-family:'Nunito',sans-serif;background:white;color:#2D2D2D;outline:none;transition:all .22s}
        .finput:focus{border-color:#FF6B35;box-shadow:0 0 0 3px rgba(255,107,53,.1)}
        .finput.e{border-color:#FF4444;background:#FFF8F8}
        .fe{font-size:.74rem;color:#FF4444;margin-top:3px;font-weight:700}
        .eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#C0B8B0;cursor:pointer;display:flex}
        .eye:hover{color:#FF6B35}
        .forgot{display:block;text-align:right;font-size:.8rem;font-weight:800;color:#FF6B35;text-decoration:none;margin-bottom:1.2rem}
        .sbtn{width:100%;padding:13px;border:none;border-radius:13px;background:linear-gradient(135deg,#FF6B35,#FF8C5A);color:white;font-size:.97rem;font-weight:800;cursor:pointer;transition:all .3s;box-shadow:0 5px 18px rgba(255,107,53,.3);display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Nunito',sans-serif}
        .sbtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 9px 24px rgba(255,107,53,.4)}
        .sbtn:disabled{opacity:.65;cursor:not-allowed;transform:none}
        .sifooter{text-align:center;margin-top:1.2rem;font-size:.87rem;color:#7A7A8C}
        .sifooter a{color:#FF6B35;font-weight:800;text-decoration:none}
        .spinner{width:16px;height:16px;border:3px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;flex-shrink:0}
        @media(max-width:768px){.si{grid-template-columns:1fr}.si-l{display:none}.si-r{padding:2rem 1.5rem}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
      <ToastContainer position="top-right" theme="colored" autoClose={4000}/>
      <div className="si">
        {/* LEFT */}
        <div className="si-l">
          <div className="si-lc">
            <span className="si-big">🐾</span>
            <div className="si-brand">PawPartner</div>
            <p className="si-tag">Your complete pet care companion — adopt, manage, and shop.</p>
            <div className="si-feats">
              {[["🏠","Adopt pets from trusted centers"],["🐾","Manage pet health records"],["🛒","Shop premium pet products"]].map(([e,t],i)=>(
                <div key={i} className="si-feat"><span className="si-feat-e">{e}</span><span className="si-feat-t">{t}</span></div>
              ))}
            </div>
            <div className="demo-title">⚡ One-Click Demo Login</div>
            <div className="demo-btns">
              {DEMOS.map(d=>(
                <button key={d.role} className="demo-btn" disabled={busy} onClick={()=>handleDemo(d)}>
                  {demoLoad===d.role ? <span className="spinner"/> : <span style={{fontSize:"1.1rem"}}>{d.emoji}</span>}
                  <div className="demo-main">
                    <div>{d.label}</div>
                    <span className="demo-sub">{d.email} · Demo@1234</span>
                  </div>
                  <Zap size={13} style={{color:"#FFE66D",flexShrink:0}}/>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="si-r">
          <div className="si-box">
            <h1 className="si-title">Welcome back! 👋</h1>
            <p className="si-sub">Sign in to continue with PawPartner</p>
            <div className="rtabs">
              {ROLES.map(r=>(
                <button key={r.id} className={`rtab${role===r.id?" a":""}`} onClick={()=>setRole(r.id)}>
                  <span className="rtab-e">{r.emoji}</span><span className="rtab-l">{r.label}</span>
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="fl">Email Address</label>
                <div className="fw">
                  <span className="fi"><Mail size={16}/></span>
                  <input className={`finput${errs.email?" e":""}`} type="email" placeholder="your@email.com"
                    value={email} onChange={e=>{setEmail(e.target.value);setErrs(p=>({...p,email:""}))}}/>
                </div>
                {errs.email&&<div className="fe">⚠ {errs.email}</div>}
              </div>
              <div className="field">
                <label className="fl">Password</label>
                <div className="fw">
                  <span className="fi"><Lock size={16}/></span>
                  <input className={`finput${errs.password?" e":""}`} type={showPw?"text":"password"} placeholder="Your password"
                    value={password} onChange={e=>{setPassword(e.target.value);setErrs(p=>({...p,password:""}))}}/>
                  <button type="button" className="eye" onClick={()=>setShowPw(s=>!s)}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
                </div>
                {errs.password&&<div className="fe">⚠ {errs.password}</div>}
              </div>
              <Link to="/forgot-password" className="forgot">Forgot password?</Link>
              <button type="submit" className="sbtn" disabled={busy}>
                {loading?<span className="spinner"/>:<ArrowRight size={16}/>}
                {loading?"Signing in…":"Sign In"}
              </button>
            </form>
            <div className="sifooter">Don't have an account? <Link to="/signup">Create one free</Link></div>
          </div>
        </div>
      </div>
    </>
  )
}
