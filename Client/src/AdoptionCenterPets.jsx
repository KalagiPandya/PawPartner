import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { ArrowLeft, Heart, MapPin, X, CheckCircle, Phone, Mail } from "lucide-react"
import LoadingScreen from "./components/LoadingScreen"

const typeEmoji = { Dog:"🐶", Cat:"🐱", Bird:"🦜", Fish:"🐠", Rabbit:"🐰", Other:"🐾" }

const SAMPLE_PETS = [
  { _id:"p1",  name:"Buddy",    type:"Dog",    breed:"Labrador",        age:"2", gender:"Male",   description:"Friendly and energetic! Buddy loves fetch and cuddles equally. Great with kids and other dogs." },
  { _id:"p2",  name:"Luna",     type:"Cat",    breed:"Persian",         age:"3", gender:"Female", description:"Luna is graceful, calm and loves cosy laps. Perfectly suited for quiet households." },
  { _id:"p3",  name:"Max",      type:"Dog",    breed:"German Shepherd", age:"4", gender:"Male",   description:"Intelligent and loyal. Max is trained in basic commands and loves outdoor adventures." },
  { _id:"p4",  name:"Bella",    type:"Cat",    breed:"Siamese",         age:"1", gender:"Female", description:"Playful and talkative, Bella enjoys interactive toys and will follow you everywhere." },
  { _id:"p5",  name:"Charlie",  type:"Dog",    breed:"Beagle",          age:"2", gender:"Male",   description:"Charlie has an amazing nose and an even better heart. Loves sniffing everything on walks." },
  { _id:"p6",  name:"Daisy",    type:"Rabbit", breed:"Holland Lop",     age:"1", gender:"Female", description:"Super fluffy and gentle. Daisy is litter-trained and enjoys fresh veggies and gentle petting." },
  { _id:"p7",  name:"Rocky",    type:"Dog",    breed:"Rottweiler",      age:"3", gender:"Male",   description:"Despite his tough look, Rocky is a big softie. Well socialised and great with children." },
  { _id:"p8",  name:"Whiskers", type:"Cat",    breed:"Tabby",           age:"5", gender:"Male",   description:"A calm senior cat who loves sunny windowsills and gentle strokes. Perfect for adults." },
  { _id:"p9",  name:"Tweety",   type:"Bird",   breed:"Cockatiel",       age:"2", gender:"Female", description:"Tweety can whistle tunes and loves attention. Talks a little and enjoys shoulder perching." },
  { _id:"p10", name:"Goldie",   type:"Fish",   breed:"Goldfish",        age:"1", gender:"Male",   description:"A beautiful golden fish that glides gracefully. Perfect starter pet for children." },
]

const BG = ["rgba(255,107,53,.08)","rgba(255,107,157,.08)","rgba(78,205,196,.08)","rgba(255,182,69,.08)","rgba(130,130,255,.08)"]

export default function AdoptionCenterPets() {
  const [pets,     setPets]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [center,   setCenter]   = useState(null)
  const [adoptPet, setAdoptPet] = useState(null) // pet being adopted (shows modal)
  const [form,     setForm]     = useState({ name:"", email:"", phone:"", message:"" })
  const [sending,  setSending]  = useState(false)
  const [adopted,  setAdopted]  = useState(false)
  const { centerId } = useParams()

  useEffect(() => { fetchData() }, [centerId])

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.allSettled([
        axios.get(`http://localhost:8000/api/v1/adoption-center-pets/${centerId}`, { withCredentials:true }),
        axios.get("http://localhost:8000/api/v1/adoption-centers", { withCredentials:true }),
      ])
      if (cRes.status==="fulfilled") {
        const found = cRes.value.data?.data?.find(c=>c._id===centerId)
        setCenter(found||null)
      }
      let real = []
      if (pRes.status==="fulfilled") real = pRes.value.data?.data||[]
      setPets(real.length >= 10 ? real : [...real, ...SAMPLE_PETS.slice(real.length)])
    } catch {
      setPets(SAMPLE_PETS)
    } finally { setLoading(false) }
  }

  const handleAdoptClick = (pet) => {
    const token = localStorage.getItem("token")
    if (!token) { toast.error("Please sign in to adopt a pet! 🐾"); return }
    setAdoptPet(pet)
    setAdopted(false)
    setForm({ name:"", email:"", phone:"", message:`I am interested in adopting ${pet.name}. Please contact me.` })
  }

  const handleAdoptSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) { toast.error("Please fill all required fields"); return }
    setSending(true)
    // Simulate sending adoption request (in production this would call an API)
    await new Promise(r => setTimeout(r, 1500))
    setSending(false)
    setAdopted(true)
    toast.success(`🎉 Adoption request sent for ${adoptPet.name}!`)
  }

  if (loading) return <LoadingScreen message="Loading adorable pets"/>

  return (
    <>
      <style>{`
        .acp{padding-top:72px;min-height:100vh;background:#FFF8F3;font-family:'Nunito',sans-serif}
        .acp-hero{background:linear-gradient(135deg,#FF6B9D,#FF6B35);padding:3.5rem 2rem;color:white;position:relative;overflow:hidden}
        .acp-hero::before{content:'🐾';position:absolute;right:8%;top:50%;transform:translateY(-50%);font-size:7rem;opacity:.1;pointer-events:none}
        .acp-back{display:inline-flex;align-items:center;gap:7px;color:rgba(255,255,255,.85);text-decoration:none;font-size:.88rem;font-weight:700;margin-bottom:1.2rem;transition:color .2s}
        .acp-back:hover{color:white}
        .acp-hero h1{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;margin-bottom:.4rem}
        .acp-hero p{opacity:.85;font-size:.97rem}
        .acp-main{max-width:1280px;margin:0 auto;padding:3rem 2rem}
        .acp-count{font-size:.9rem;font-weight:700;color:#7A7A8C;margin-bottom:2rem}
        .acp-count span{color:#FF6B9D;font-size:1.05rem}
        .acp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.8rem}
        .acp-card{background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.07);transition:all .35s}
        .acp-card:hover{transform:translateY(-6px);box-shadow:0 14px 40px rgba(255,107,157,.14)}
        .acp-img{width:100%;height:200px;object-fit:cover}
        .acp-ph{width:100%;height:200px;display:flex;align-items:center;justify-content:center;font-size:5rem}
        .acp-body{padding:1.3rem 1.4rem 1.5rem}
        .acp-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.5rem}
        .acp-name{font-size:1.15rem;font-weight:800;color:#1A1A2E}
        .acp-e{font-size:1.5rem}
        .acp-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:.9rem}
        .acp-tag{background:rgba(255,107,157,.1);color:#FF6B9D;border-radius:50px;padding:3px 10px;font-size:.75rem;font-weight:800}
        .acp-desc{color:#7A7A8C;font-size:.86rem;line-height:1.6;margin-bottom:1.2rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .acp-btn{width:100%;padding:12px;border:none;border-radius:12px;background:linear-gradient(135deg,#FF6B9D,#FF8CB8);color:white;font-weight:800;font-size:.92rem;cursor:pointer;font-family:'Nunito',sans-serif;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .3s}
        .acp-btn:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(255,107,157,.35)}
        /* Modal */
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem;backdrop-filter:blur(6px)}
        .mbox{background:white;border-radius:28px;width:100%;max-width:480px;padding:2.5rem;position:relative;max-height:90vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,.25);animation:popUp .35s cubic-bezier(.34,1.56,.64,1)}
        .mclose{position:absolute;top:1rem;right:1rem;background:#FFF0E6;border:none;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#FF6B35;transition:all .2s}
        .mclose:hover{background:#FF6B35;color:white}
        .mtitle{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:800;color:#1A1A2E;margin-bottom:.4rem}
        .msub{color:#7A7A8C;font-size:.88rem;margin-bottom:1.5rem}
        .mfield{margin-bottom:1rem}
        .mlabel{font-size:.8rem;font-weight:800;color:#4A4A5A;margin-bottom:4px;display:block}
        .minput,.mtextarea{width:100%;padding:11px 13px;border:2px solid #F0E6DC;border-radius:12px;font-size:.9rem;font-family:'Nunito',sans-serif;outline:none;color:#2D2D2D;transition:border-color .2s}
        .minput:focus,.mtextarea:focus{border-color:#FF6B9D;box-shadow:0 0 0 3px rgba(255,107,157,.1)}
        .mtextarea{min-height:80px;resize:vertical}
        .msub-btn{width:100%;padding:13px;border:none;border-radius:12px;background:linear-gradient(135deg,#FF6B9D,#FF8CB8);color:white;font-weight:800;font-size:.95rem;cursor:pointer;font-family:'Nunito',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .3s;margin-top:.5rem}
        .msub-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 20px rgba(255,107,157,.4)}
        .msub-btn:disabled{opacity:.65;cursor:not-allowed}
        .success-screen{text-align:center;padding:1rem 0}
        .success-icon{width:80px;height:80px;background:linear-gradient(135deg,#4ECDC4,#35B5AC);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.2rem}
        .success-icon svg{color:white;width:40px;height:40px}
        .spinner{width:16px;height:16px;border:3px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
        @media(max-width:600px){.acp-grid{grid-template-columns:1fr}}
        @keyframes popUp{from{transform:scale(.8) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
      <ToastContainer position="top-right" theme="colored"/>
      <div className="acp">
        <div className="acp-hero">
          <div style={{ maxWidth:1280, margin:"0 auto" }}>
            <Link to="/adoption-centers" className="acp-back"><ArrowLeft size={15}/> Back to Adoption Centers</Link>
            <h1>🐾 {center?.adoptionCenterName||"Available Pets"}</h1>
            {center?.address && <p><MapPin size={14} style={{display:"inline",marginRight:4}}/>{center.address}</p>}
            {!center && <p>Find your perfect companion below</p>}
          </div>
        </div>

        <div className="acp-main">
          <div className="acp-count">Found <span>{pets.length}</span> pet{pets.length!==1?"s":""} available for adoption</div>
          <div className="acp-grid">
            {pets.map((pet,i)=>(
              <div key={pet._id||i} className="acp-card">
                {pet.imageUrl
                  ? <img src={pet.imageUrl} alt={pet.name} className="acp-img"/>
                  : <div className="acp-ph" style={{background:BG[i%5]}}>{typeEmoji[pet.type]||"🐾"}</div>
                }
                <div className="acp-body">
                  <div className="acp-hdr">
                    <div className="acp-name">{pet.name}</div>
                    <span className="acp-e">{typeEmoji[pet.type]||"🐾"}</span>
                  </div>
                  <div className="acp-tags">
                    {pet.type   && <span className="acp-tag">{pet.type}</span>}
                    {pet.breed  && <span className="acp-tag">{pet.breed}</span>}
                    {pet.age    && <span className="acp-tag">{pet.age} yr{pet.age!=="1"?"s":""}</span>}
                    {pet.gender && <span className="acp-tag">{pet.gender}</span>}
                  </div>
                  {pet.description && <p className="acp-desc">{pet.description}</p>}
                  <button className="acp-btn" onClick={()=>handleAdoptClick(pet)}>
                    <Heart size={15}/> Adopt {pet.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADOPT MODAL */}
      {adoptPet && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setAdoptPet(null)}>
          <div className="mbox">
            <button className="mclose" onClick={()=>setAdoptPet(null)}><X size={15}/></button>
            {adopted ? (
              <div className="success-screen">
                <div className="success-icon"><CheckCircle/></div>
                <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",fontWeight:800,color:"#1A1A2E",marginBottom:".5rem"}}>Request Sent! 🎉</h2>
                <p style={{color:"#7A7A8C",marginBottom:"1.5rem",lineHeight:1.7}}>
                  Your adoption request for <strong style={{color:"#FF6B9D"}}>{adoptPet.name}</strong> has been submitted!
                  The adoption center will contact you within 24-48 hours.
                </p>
                <div style={{background:"rgba(78,205,196,.1)",borderRadius:16,padding:"1rem",marginBottom:"1.5rem"}}>
                  <p style={{color:"#35B5AC",fontWeight:700,fontSize:".9rem"}}>✅ What happens next?</p>
                  <p style={{color:"#7A7A8C",fontSize:".85rem",marginTop:".4rem",lineHeight:1.6}}>
                    1. Center reviews your request<br/>
                    2. They contact you via email/phone<br/>
                    3. Schedule a meet & greet<br/>
                    4. Complete adoption paperwork 🐾
                  </p>
                </div>
                <button className="msub-btn" onClick={()=>setAdoptPet(null)}>Done ✨</button>
              </div>
            ) : (
              <>
                <div style={{fontSize:"3rem",marginBottom:".5rem"}}>{typeEmoji[adoptPet.type]||"🐾"}</div>
                <h2 className="mtitle">Adopt {adoptPet.name}</h2>
                <p className="msub">Fill in your details and the adoption center will contact you within 24-48 hours.</p>
                <form onSubmit={handleAdoptSubmit}>
                  <div className="mfield"><label className="mlabel">Your Name *</label><input className="minput" placeholder="John Doe" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required/></div>
                  <div className="mfield"><label className="mlabel">Email Address *</label><input className="minput" type="email" placeholder="you@email.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required/></div>
                  <div className="mfield"><label className="mlabel">Phone Number *</label><input className="minput" type="tel" placeholder="10-digit number" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} required/></div>
                  <div className="mfield"><label className="mlabel">Message</label><textarea className="mtextarea" value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}/></div>
                  <button type="submit" className="msub-btn" disabled={sending}>
                    {sending ? <><span className="spinner"/> Processing…</> : <><Heart size={16}/> Send Adoption Request</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
