import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Plus, X, Edit, Trash2, PawPrint } from "lucide-react"

const API = "http://localhost:8000/api/v1"
const authH = () => { const t=localStorage.getItem("token"); return t ? { Authorization:`Bearer ${t}` } : {} }
const typeEmoji = { Dog:"🐶", Cat:"🐱", Bird:"🦜", Fish:"🐠", Other:"🐾" }

export default function AdoptionCenterDashboard() {
  const navigate = useNavigate()
  const [center,  setCenter]  = useState(null)
  const [pets,    setPets]    = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [tab,     setTab]     = useState("pets")
  const [form,    setForm]    = useState({ name:"", type:"Dog", breed:"", age:"", gender:"Male", description:"", image:null })
  const [profile, setProfile] = useState({ adoptionCenterName:"", address:"", contact:"", adoptionCenterDescription:"" })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const cRes = await axios.get(`${API}/adoption-centers/profile`, { withCredentials:true, headers:authH() })
      const c = cRes.data?.data
      if (!c) { navigate("/signin"); return }
      setCenter(c)
      setProfile({ adoptionCenterName:c.adoptionCenterName||"", address:c.address||"", contact:c.contact||"", adoptionCenterDescription:c.adoptionCenterDescription||"" })
      // Get this center's pets
      const pRes = await axios.get(`${API}/adoption-center-pets/${c._id}`, { withCredentials:true, headers:authH() })
      setPets(pRes.data?.data || [])
    } catch (err) {
      if (err.response?.status === 401) { navigate("/signin"); return }
      toast.error("Failed to load dashboard")
    } finally { setLoading(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("role"); navigate("/signin")
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ name:"", type:"Dog", breed:"", age:"", gender:"Male", description:"", image:null })
    setModal(true)
  }
  const openEdit = (pet) => {
    setEditing(pet)
    setForm({ name:pet.name, type:pet.type, breed:pet.breed, age:String(pet.age), gender:pet.gender, description:pet.description, image:null })
    setModal(true)
  }
  const closeModal = () => { setModal(false); setEditing(null) }

  const handleSavePet = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) {
        const body = { name:form.name, type:form.type, breed:form.breed, age:form.age, gender:form.gender, description:form.description }
        const res  = await axios.patch(`${API}/adoption-center-pets/update/${editing._id}`, body, { withCredentials:true, headers:authH() })
        setPets(p => p.map(x => x._id===editing._id ? res.data.data : x))
        toast.success("Pet updated! 🐾")
      } else {
        const fd = new FormData()
        Object.entries(form).forEach(([k,v]) => { if (k==="image" && v) fd.append("image",v); else if (k!=="image") fd.append(k,v) })
        const res = await axios.post(`${API}/adoption-center-pets/add`, fd, { withCredentials:true, headers:authH() })
        setPets(p => [...p, res.data.data])
        toast.success("Pet added! 🎉")
      }
      closeModal()
    } catch (err) { toast.error(err.response?.data?.message || "Failed to save pet") }
    finally { setSaving(false) }
  }

  const handleDeletePet = async (id) => {
    if (!window.confirm("Remove this pet?")) return
    try {
      await axios.delete(`${API}/adoption-center-pets/delete/${id}`, { withCredentials:true, headers:authH() })
      setPets(p => p.filter(x => x._id !== id))
      toast.success("Pet removed")
    } catch { toast.error("Failed to delete") }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await axios.patch(`${API}/adoption-centers/update-details`, profile, { withCredentials:true, headers:authH() })
      toast.success("Profile updated! ✅")
    } catch { toast.error("Failed to update profile") }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#FFF8F3",flexDirection:"column",gap:"1rem",fontFamily:"Nunito,sans-serif"}}>
      <div style={{fontSize:"3rem",animation:"float 2s ease-in-out infinite"}}>🐾</div>
      <p style={{color:"#7A7A8C",fontWeight:700}}>Loading dashboard…</p>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *{box-sizing:border-box}
        .db{display:flex;min-height:100vh;font-family:'Nunito',sans-serif;background:#F8F6F3}
        .db-side{width:260px;flex-shrink:0;background:linear-gradient(180deg,#1A1A2E,#16213E);display:flex;flex-direction:column;padding:2rem 0}
        .db-logo{display:flex;align-items:center;gap:10px;font-family:'Playfair Display',serif;font-size:1.35rem;font-weight:800;color:white;padding:0 1.5rem 2rem}
        .db-logo-icon{background:linear-gradient(135deg,#FF6B35,#FF8C5A);border-radius:10px;padding:7px;display:flex}
        .db-logo-icon svg{color:white;width:18px;height:18px}
        .db-center-info{padding:0 1.5rem 2rem;border-bottom:1px solid rgba(255,255,255,.1)}
        .db-center-avatar{width:56px;height:56px;background:linear-gradient(135deg,#FF6B9D,#FF8CB8);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;margin-bottom:.8rem}
        .db-center-name{color:white;font-weight:800;font-size:.97rem;margin-bottom:.2rem}
        .db-center-role{color:rgba(255,255,255,.45);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
        .db-nav{flex:1;padding:1.5rem 0}
        .db-nav-item{display:flex;align-items:center;gap:10px;width:100%;padding:12px 1.5rem;border:none;background:transparent;color:rgba(255,255,255,.6);font-size:.9rem;font-weight:700;cursor:pointer;transition:all .2s;font-family:'Nunito',sans-serif;text-align:left}
        .db-nav-item:hover{background:rgba(255,255,255,.06);color:white}
        .db-nav-item.active{background:rgba(255,107,157,.15);color:#FF6B9D;border-right:3px solid #FF6B9D}
        .db-logout{margin:0 1rem;padding:11px 16px;border:1.5px solid rgba(255,255,255,.15);border-radius:12px;background:transparent;color:rgba(255,255,255,.6);font-size:.88rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;font-family:'Nunito',sans-serif;transition:all .2s;width:calc(100% - 2rem)}
        .db-logout:hover{background:rgba(255,82,82,.15);border-color:rgba(255,82,82,.4);color:#FF5252}
        .db-main{flex:1;overflow-y:auto}
        .db-topbar{background:white;padding:1.2rem 2rem;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 12px rgba(0,0,0,.06);position:sticky;top:0;z-index:10}
        .db-topbar-title{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:800;color:#1A1A2E}
        .db-topbar-sub{color:#7A7A8C;font-size:.85rem;font-weight:600}
        .db-add-btn{background:linear-gradient(135deg,#FF6B9D,#FF8CB8);color:white;border:none;border-radius:12px;padding:10px 18px;font-weight:800;font-size:.88rem;cursor:pointer;display:flex;align-items:center;gap:7px;font-family:'Nunito',sans-serif;transition:all .3s;box-shadow:0 4px 12px rgba(255,107,157,.3)}
        .db-add-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(255,107,157,.4)}
        .db-content{padding:2rem}
        .db-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem;margin-bottom:2rem}
        .db-stat{background:white;border-radius:18px;padding:1.4rem 1.5rem;box-shadow:0 2px 12px rgba(0,0,0,.06)}
        .db-stat-emoji{font-size:2rem;margin-bottom:.5rem}
        .db-stat-num{font-size:2rem;font-weight:900;color:#1A1A2E;font-family:'Playfair Display',serif}
        .db-stat-label{font-size:.8rem;font-weight:700;color:#7A7A8C;text-transform:uppercase;letter-spacing:.5px}
        .db-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.4rem}
        .db-pet-card{background:white;border-radius:20px;padding:1.2rem;box-shadow:0 2px 12px rgba(0,0,0,.06);transition:all .3s;text-align:center;border:2px solid transparent}
        .db-pet-card:hover{transform:translateY(-4px);box-shadow:0 8px 28px rgba(255,107,157,.12);border-color:rgba(255,107,157,.2)}
        .db-pet-avatar{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#FFE0F0,#FFD0E8);display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin:0 auto .8rem;overflow:hidden;border:3px solid rgba(255,107,157,.2)}
        .db-pet-avatar img{width:100%;height:100%;object-fit:cover}
        .db-pet-name{font-size:1.05rem;font-weight:800;color:#1A1A2E;margin-bottom:.3rem}
        .db-pet-tags{display:flex;gap:5px;justify-content:center;flex-wrap:wrap;margin-bottom:.8rem}
        .db-pet-tag{background:rgba(255,107,157,.1);color:#FF6B9D;border-radius:50px;padding:2px 9px;font-size:.72rem;font-weight:800}
        .db-pet-actions{display:flex;gap:7px}
        .db-edit-btn{flex:1;padding:8px;border:none;border-radius:9px;background:rgba(78,205,196,.12);color:#35B5AC;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;font-size:.82rem;display:flex;align-items:center;justify-content:center;gap:4px;transition:all .2s}
        .db-edit-btn:hover{background:#4ECDC4;color:white}
        .db-del-btn{flex:1;padding:8px;border:none;border-radius:9px;background:rgba(255,82,82,.1);color:#FF5252;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;font-size:.82rem;display:flex;align-items:center;justify-content:center;gap:4px;transition:all .2s}
        .db-del-btn:hover{background:#FF5252;color:white}
        .db-empty{text-align:center;padding:4rem 2rem;background:white;border-radius:20px}
        .db-profile-form{background:white;border-radius:20px;padding:2rem;box-shadow:0 2px 12px rgba(0,0,0,.06);max-width:600px}
        .db-field{margin-bottom:1.2rem}
        .db-label{font-size:.82rem;font-weight:800;color:#4A4A5A;margin-bottom:5px;display:block}
        .db-input,.db-textarea{width:100%;padding:11px 14px;border:2px solid #F0E6DC;border-radius:12px;font-size:.92rem;font-family:'Nunito',sans-serif;outline:none;background:white;color:#2D2D2D;transition:border-color .2s}
        .db-input:focus,.db-textarea:focus{border-color:#FF6B9D;box-shadow:0 0 0 3px rgba(255,107,157,.1)}
        .db-textarea{min-height:100px;resize:vertical}
        .db-save-btn{background:linear-gradient(135deg,#FF6B9D,#FF8CB8);color:white;border:none;border-radius:12px;padding:12px 24px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;font-size:.95rem;transition:all .3s;box-shadow:0 4px 12px rgba(255,107,157,.3)}
        .db-save-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 20px rgba(255,107,157,.4)}
        .db-save-btn:disabled{opacity:.65;cursor:not-allowed}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem;backdrop-filter:blur(4px)}
        .mbox{background:white;border-radius:24px;width:100%;max-width:480px;padding:2rem;position:relative;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.2);animation:fadeInUp .3s ease}
        .mclose{position:absolute;top:1rem;right:1rem;background:#FFF0E6;border:none;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#FF6B35;transition:all .2s}
        .mclose:hover{background:#FF6B35;color:white}
        .mtitle{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:800;color:#1A1A2E;margin-bottom:1.5rem}
        .mrow{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .mfield{margin-bottom:.9rem}
        .mlabel{font-size:.8rem;font-weight:800;color:#4A4A5A;margin-bottom:4px;display:block}
        .minput,.mselect,.mtextarea{width:100%;padding:10px 12px;border:2px solid #F0E6DC;border-radius:11px;font-size:.9rem;font-family:'Nunito',sans-serif;outline:none;background:white;color:#2D2D2D;transition:border-color .2s}
        .minput:focus,.mselect:focus,.mtextarea:focus{border-color:#FF6B9D;box-shadow:0 0 0 3px rgba(255,107,157,.08)}
        .mtextarea{min-height:80px;resize:vertical}
        .mactions{display:flex;gap:10px;margin-top:1rem}
        .msub{flex:1;padding:12px;border:none;border-radius:11px;background:linear-gradient(135deg,#FF6B9D,#FF8CB8);color:white;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;transition:all .3s}
        .msub:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 16px rgba(255,107,157,.35)}
        .msub:disabled{opacity:.65;cursor:not-allowed}
        .mcancel{padding:12px 18px;border:2px solid #F0E6DC;border-radius:11px;background:white;color:#7A7A8C;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif}
        .mcancel:hover{border-color:#FF6B9D;color:#FF6B9D}
        .spinner{width:15px;height:15px;border:3px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
        @media(max-width:768px){.db-side{display:none}.db-stats{grid-template-columns:1fr 1fr}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
      <ToastContainer position="top-right" theme="colored"/>
      <div className="db">
        <aside className="db-side">
          <div className="db-logo"><div className="db-logo-icon"><PawPrint/></div>PawPartner</div>
          <div className="db-center-info">
            <div className="db-center-avatar">🏠</div>
            <div className="db-center-name">{center?.adoptionCenterName||"My Center"}</div>
            <div className="db-center-role">Adoption Center</div>
          </div>
          <nav className="db-nav">
            <button className={`db-nav-item${tab==="pets"?" active":""}`} onClick={()=>setTab("pets")}>🐾 My Pets</button>
            <button className={`db-nav-item${tab==="profile"?" active":""}`} onClick={()=>setTab("profile")}>⚙️ Profile</button>
            <button className="db-nav-item" onClick={()=>navigate("/adoption-centers")}>🏠 Public Page</button>
          </nav>
          <button className="db-logout" onClick={handleLogout}>🚪 Sign Out</button>
        </aside>

        <main className="db-main">
          <div className="db-topbar">
            <div>
              <div className="db-topbar-title">{tab==="pets"?"Pet Listings":"Profile Settings"}</div>
              <div className="db-topbar-sub">{tab==="pets"?`${pets.length} pets listed`:"Manage your center info"}</div>
            </div>
            {tab==="pets" && <button className="db-add-btn" onClick={openAdd}><Plus size={16}/>Add Pet</button>}
          </div>

          <div className="db-content">
            {tab==="pets" && (
              <>
                <div className="db-stats">
                  <div className="db-stat"><div className="db-stat-emoji">🐾</div><div className="db-stat-num">{pets.length}</div><div className="db-stat-label">Total Pets</div></div>
                  <div className="db-stat"><div className="db-stat-emoji">🐶</div><div className="db-stat-num">{pets.filter(p=>p.type==="Dog").length}</div><div className="db-stat-label">Dogs</div></div>
                  <div className="db-stat"><div className="db-stat-emoji">🐱</div><div className="db-stat-num">{pets.filter(p=>p.type==="Cat").length}</div><div className="db-stat-label">Cats</div></div>
                </div>
                {pets.length===0 ? (
                  <div className="db-empty">
                    <div style={{fontSize:"3.5rem",marginBottom:"1rem",animation:"float 2.5s ease-in-out infinite"}}>🐾</div>
                    <h3 style={{fontFamily:"Playfair Display,serif",color:"#1A1A2E",marginBottom:".5rem"}}>No pets listed yet</h3>
                    <p style={{color:"#7A7A8C",marginBottom:"1.5rem"}}>Add pets available for adoption.</p>
                    <button className="db-add-btn" onClick={openAdd} style={{margin:"0 auto"}}><Plus size={16}/>Add First Pet</button>
                  </div>
                ) : (
                  <div className="db-grid">
                    {pets.map(pet=>(
                      <div key={pet._id} className="db-pet-card">
                        <div className="db-pet-avatar">{pet.imageUrl?<img src={pet.imageUrl} alt={pet.name}/>:typeEmoji[pet.type]||"🐾"}</div>
                        <div className="db-pet-name">{pet.name}</div>
                        <div className="db-pet-tags">
                          <span className="db-pet-tag">{pet.type}</span>
                          <span className="db-pet-tag">{pet.breed}</span>
                          <span className="db-pet-tag">{pet.age}yr</span>
                          <span className="db-pet-tag">{pet.gender}</span>
                        </div>
                        <div className="db-pet-actions">
                          <button className="db-edit-btn" onClick={()=>openEdit(pet)}><Edit size={13}/>Edit</button>
                          <button className="db-del-btn" onClick={()=>handleDeletePet(pet._id)}><Trash2 size={13}/>Del</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {tab==="profile" && (
              <form className="db-profile-form" onSubmit={handleSaveProfile}>
                <h2 style={{fontFamily:"Playfair Display,serif",fontSize:"1.4rem",fontWeight:800,color:"#1A1A2E",marginBottom:"1.5rem"}}>Center Information</h2>
                <div className="db-field"><label className="db-label">Center Name</label><input className="db-input" value={profile.adoptionCenterName} onChange={e=>setProfile(p=>({...p,adoptionCenterName:e.target.value}))}/></div>
                <div className="db-field"><label className="db-label">Address</label><input className="db-input" value={profile.address} onChange={e=>setProfile(p=>({...p,address:e.target.value}))}/></div>
                <div className="db-field"><label className="db-label">Contact</label><input className="db-input" value={profile.contact} onChange={e=>setProfile(p=>({...p,contact:e.target.value}))}/></div>
                <div className="db-field"><label className="db-label">Description</label><textarea className="db-textarea" value={profile.adoptionCenterDescription} onChange={e=>setProfile(p=>({...p,adoptionCenterDescription:e.target.value}))}/></div>
                <button type="submit" className="db-save-btn" disabled={saving}>{saving?<span className="spinner"/>:"Save Changes ✅"}</button>
              </form>
            )}
          </div>
        </main>
      </div>

      {modal && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
          <div className="mbox">
            <button className="mclose" onClick={closeModal}><X size={15}/></button>
            <h2 className="mtitle">{editing?"✏️ Edit Pet":"➕ Add Pet"}</h2>
            <form onSubmit={handleSavePet}>
              <div className="mfield"><label className="mlabel">Pet Name *</label><input className="minput" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Buddy" required/></div>
              <div className="mrow">
                <div className="mfield"><label className="mlabel">Type *</label>
                  <select className="mselect" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
                    {["Dog","Cat","Bird","Fish","Other"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="mfield"><label className="mlabel">Gender *</label>
                  <select className="mselect" value={form.gender} onChange={e=>setForm(p=>({...p,gender:e.target.value}))}>
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
              </div>
              <div className="mrow">
                <div className="mfield"><label className="mlabel">Breed *</label><input className="minput" value={form.breed} onChange={e=>setForm(p=>({...p,breed:e.target.value}))} required/></div>
                <div className="mfield"><label className="mlabel">Age (yrs) *</label><input className="minput" type="number" min="0" value={form.age} onChange={e=>setForm(p=>({...p,age:e.target.value}))} required/></div>
              </div>
              <div className="mfield"><label className="mlabel">Description *</label><textarea className="mtextarea" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} required/></div>
              <div className="mfield"><label className="mlabel">Photo</label><input className="minput" type="file" accept="image/*" onChange={e=>setForm(p=>({...p,image:e.target.files[0]}))}/></div>
              <div className="mactions">
                <button type="button" className="mcancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="msub" disabled={saving}>{saving?<span className="spinner"/>:editing?"Update":"Add Pet"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
