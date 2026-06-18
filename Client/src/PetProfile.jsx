import { useState, useEffect } from "react"
import axios from "axios"
import { Plus, X, Edit, Trash2, PawPrint, Heart } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LoadingScreen from "./components/LoadingScreen"

const API = "http://localhost:8000/api/v1"
const authH = () => { const t=localStorage.getItem("token"); return t?{Authorization:`Bearer ${t}`}:{} }
const typeEmoji = { Dog:"🐶", Cat:"🐱", Bird:"🦜", Fish:"🐠", Rabbit:"🐰", Other:"🐾" }
const COLORS    = ["rgba(255,107,53,.08)","rgba(255,107,157,.08)","rgba(78,205,196,.08)","rgba(255,182,69,.08)","rgba(130,130,255,.08)"]

export default function PetProfile() {
  const [pets,       setPets]       = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState(false)
  const [editing,    setEditing]    = useState(null)
  const [saving,     setSaving]     = useState(false)
  const [form,       setForm]       = useState({ name:"", type:"Dog", breed:"", age:"", gender:"Male", description:"", image:null })

  useEffect(() => { fetchPets() }, [])

  const fetchPets = async () => {
    try {
      const res = await axios.get(`${API}/owned-pets/`, { withCredentials:true, headers:authH() })
      setPets(res.data?.data || [])
    } catch (err) {
      if (err.response?.status !== 401) toast.error("Failed to load pets")
    } finally { setLoading(false) }
  }

  const openAdd  = () => { setEditing(null); setForm({ name:"", type:"Dog", breed:"", age:"", gender:"Male", description:"", image:null }); setModal(true) }
  const openEdit = (pet) => { setEditing(pet); setForm({ name:pet.name, type:pet.type, breed:pet.breed, age:String(pet.age), gender:pet.gender, description:pet.description, image:null }); setModal(true) }
  const closeModal = () => { setModal(false); setEditing(null) }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) {
        const body = { name:form.name, type:form.type, breed:form.breed, age:form.age, gender:form.gender, description:form.description }
        const res  = await axios.patch(`${API}/owned-pets/update/${editing._id}`, body, { withCredentials:true, headers:authH() })
        setPets(p => p.map(x => x._id===editing._id ? res.data.data : x))
        toast.success("Pet updated! 🐾")
      } else {
        const fd = new FormData()
        Object.entries(form).forEach(([k,v]) => { if (k==="image" && v) fd.append("image",v); else if (k!=="image") fd.append(k,v) })
        const res = await axios.post(`${API}/owned-pets/add`, fd, { withCredentials:true, headers:authH() })
        setPets(p => [...p, res.data.data])
        toast.success("Pet added! 🎉")
      }
      closeModal()
    } catch (err) { toast.error(err.response?.data?.message || "Failed to save") }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this pet from your profile?")) return
    try {
      await axios.delete(`${API}/owned-pets/delete/${id}`, { withCredentials:true, headers:authH() })
      setPets(p => p.filter(x => x._id !== id))
      toast.success("Pet removed")
    } catch { toast.error("Failed to delete") }
  }

  if (loading) return <LoadingScreen message="Loading your pets"/>

  return (
    <>
      <style>{`
        .pp-page{padding-top:72px;min-height:100vh;background:#FFF8F3;font-family:'Nunito',sans-serif}
        .pp-hero{background:linear-gradient(135deg,#FF6B35,#FF8C5A);padding:3.5rem 2rem;color:white;text-align:center;position:relative;overflow:hidden}
        .pp-hero::before{content:'🐾';position:absolute;right:8%;top:50%;transform:translateY(-50%);font-size:8rem;opacity:.1}
        .pp-hero h1{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;margin-bottom:.5rem}
        .pp-hero p{opacity:.85;font-size:1rem}
        .pp-main{max-width:1280px;margin:0 auto;padding:3rem 2rem}
        .pp-hdr{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:2rem}
        .pp-hdr h2{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:800;color:#1A1A2E}
        .pp-hdr span{color:#7A7A8C;font-size:.9rem;font-weight:600}
        .add-btn{background:linear-gradient(135deg,#FF6B35,#FF8C5A);color:white;border:none;border-radius:14px;padding:12px 20px;font-weight:800;font-size:.9rem;cursor:pointer;display:flex;align-items:center;gap:7px;font-family:'Nunito',sans-serif;transition:all .3s;box-shadow:0 4px 14px rgba(255,107,53,.3)}
        .add-btn:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(255,107,53,.4)}
        .pp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem}
        .pp-card{background:white;border-radius:24px;padding:1.5rem;box-shadow:0 4px 20px rgba(0,0,0,.06);display:flex;flex-direction:column;align-items:center;text-align:center;transition:all .3s;border:2px solid transparent}
        .pp-card:hover{transform:translateY(-5px);box-shadow:0 12px 36px rgba(255,107,53,.12);border-color:rgba(255,107,53,.15)}
        .pp-avatar{width:100px;height:100px;border-radius:50%;border:4px solid rgba(255,107,53,.2);margin-bottom:1rem;display:flex;align-items:center;justify-content:center;font-size:3rem;overflow:hidden;position:relative}
        .pp-avatar img{width:100%;height:100%;object-fit:cover}
        .pp-avatar-badge{position:absolute;bottom:-2px;right:-2px;background:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:.9rem;box-shadow:0 2px 8px rgba(0,0,0,.1)}
        .pp-name{font-size:1.2rem;font-weight:800;color:#1A1A2E;margin-bottom:.3rem}
        .pp-breed{color:#7A7A8C;font-size:.85rem;font-weight:600;margin-bottom:.8rem}
        .pp-tags{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:1rem}
        .pp-tag{background:rgba(255,107,53,.08);color:#FF6B35;border-radius:50px;padding:3px 10px;font-size:.75rem;font-weight:800}
        .pp-desc{color:#7A7A8C;font-size:.85rem;line-height:1.6;margin-bottom:1.2rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .pp-actions{display:flex;gap:8px;width:100%}
        .pp-edit{flex:1;padding:9px;border:none;border-radius:10px;background:rgba(78,205,196,.12);color:#35B5AC;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;font-size:.85rem;display:flex;align-items:center;justify-content:center;gap:5px;transition:all .2s}
        .pp-edit:hover{background:#4ECDC4;color:white}
        .pp-del{flex:1;padding:9px;border:none;border-radius:10px;background:rgba(255,82,82,.1);color:#FF5252;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;font-size:.85rem;display:flex;align-items:center;justify-content:center;gap:5px;transition:all .2s}
        .pp-del:hover{background:#FF5252;color:white}
        .pp-empty{text-align:center;padding:5rem 2rem}
        .pp-empty-emoji{font-size:4rem;margin-bottom:1rem;animation:float 2.5s ease-in-out infinite;display:block}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem;backdrop-filter:blur(4px)}
        .mbox{background:white;border-radius:28px;width:100%;max-width:500px;padding:2.5rem;position:relative;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.2);animation:fadeInUp .3s ease}
        .mclose{position:absolute;top:1.2rem;right:1.2rem;background:#FFF0E6;border:none;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#FF6B35;transition:all .2s}
        .mclose:hover{background:#FF6B35;color:white}
        .mtitle{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:800;color:#1A1A2E;margin-bottom:2rem}
        .mrow{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .mf{margin-bottom:1rem}
        .ml{font-size:.8rem;font-weight:800;color:#4A4A5A;margin-bottom:4px;display:block}
        .mi,.ms,.mta{width:100%;padding:11px 13px;border:2px solid #F0E6DC;border-radius:12px;font-size:.9rem;font-family:'Nunito',sans-serif;outline:none;background:white;color:#2D2D2D;transition:border-color .2s}
        .mi:focus,.ms:focus,.mta:focus{border-color:#FF6B35;box-shadow:0 0 0 3px rgba(255,107,53,.08)}
        .mta{min-height:85px;resize:vertical}
        .macts{display:flex;gap:10px;margin-top:1rem}
        .msub{flex:1;padding:13px;border:none;border-radius:12px;background:linear-gradient(135deg,#FF6B35,#FF8C5A);color:white;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;font-size:.95rem;transition:all .3s}
        .msub:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 16px rgba(255,107,53,.35)}
        .msub:disabled{opacity:.65;cursor:not-allowed}
        .mcancel{padding:13px 18px;border:2px solid #F0E6DC;border-radius:12px;background:white;color:#7A7A8C;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif}
        .mcancel:hover{border-color:#FF6B35;color:#FF6B35}
        .spinner{width:16px;height:16px;border:3px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
        @media(max-width:600px){.pp-grid{grid-template-columns:1fr 1fr}.mrow{grid-template-columns:1fr}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
      <ToastContainer position="top-right" theme="colored"/>
      <div className="pp-page">
        <div className="pp-hero">
          <h1>🐾 My Pets</h1>
          <p>Your beloved companions, all in one place</p>
        </div>
        <div className="pp-main">
          <div className="pp-hdr">
            <div>
              <h2>Pet Collection</h2>
              <span>{pets.length} pet{pets.length!==1?"s":""} registered</span>
            </div>
            <button className="add-btn" onClick={openAdd}><Plus size={17}/>Add New Pet</button>
          </div>

          {pets.length === 0 ? (
            <div className="pp-empty">
              <span className="pp-empty-emoji">🐾</span>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:800,color:"#1A1A2E",marginBottom:".5rem"}}>No pets yet!</h3>
              <p style={{color:"#7A7A8C",marginBottom:"2rem"}}>Add your first furry friend to get started.</p>
              <button className="add-btn" style={{margin:"0 auto"}} onClick={openAdd}><Plus size={17}/>Add My First Pet</button>
            </div>
          ) : (
            <div className="pp-grid">
              {pets.map((pet,i) => (
                <div key={pet._id} className="pp-card">
                  <div className="pp-avatar" style={{background:COLORS[i%5]}}>
                    {pet.imageUrl ? <img src={pet.imageUrl} alt={pet.name}/> : <span>{typeEmoji[pet.type]||"🐾"}</span>}
                    <div className="pp-avatar-badge">{typeEmoji[pet.type]||"🐾"}</div>
                  </div>
                  <div className="pp-name">{pet.name}</div>
                  <div className="pp-breed">{pet.breed}</div>
                  <div className="pp-tags">
                    <span className="pp-tag">{pet.type}</span>
                    <span className="pp-tag">{pet.age} yr{pet.age!="1"?"s":""}</span>
                    <span className="pp-tag">{pet.gender}</span>
                  </div>
                  {pet.description && <p className="pp-desc">{pet.description}</p>}
                  <div className="pp-actions">
                    <button className="pp-edit" onClick={()=>openEdit(pet)}><Edit size={14}/>Edit</button>
                    <button className="pp-del"  onClick={()=>handleDelete(pet._id)}><Trash2 size={14}/>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
          <div className="mbox">
            <button className="mclose" onClick={closeModal}><X size={16}/></button>
            <h2 className="mtitle">{editing?"✏️ Edit Pet":"➕ Add New Pet"}</h2>
            <form onSubmit={handleSave}>
              <div className="mf"><label className="ml">Pet Name *</label><input className="mi" type="text" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Buddy" required/></div>
              <div className="mrow">
                <div className="mf"><label className="ml">Type *</label>
                  <select className="ms" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
                    {["Dog","Cat","Bird","Fish","Rabbit","Other"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="mf"><label className="ml">Gender *</label>
                  <select className="ms" value={form.gender} onChange={e=>setForm(p=>({...p,gender:e.target.value}))}>
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
              </div>
              <div className="mrow">
                <div className="mf"><label className="ml">Breed *</label><input className="mi" type="text" value={form.breed} onChange={e=>setForm(p=>({...p,breed:e.target.value}))} placeholder="e.g. Labrador" required/></div>
                <div className="mf"><label className="ml">Age (years) *</label><input className="mi" type="number" min="0" value={form.age} onChange={e=>setForm(p=>({...p,age:e.target.value}))} required/></div>
              </div>
              <div className="mf"><label className="ml">Description *</label><textarea className="mta" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="Tell us about your pet…" required/></div>
              <div className="mf"><label className="ml">Photo {!editing?"*":""}</label><input className="mi" type="file" accept="image/*" onChange={e=>setForm(p=>({...p,image:e.target.files[0]}))} required={!editing}/></div>
              <div className="macts">
                <button type="button" className="mcancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="msub" disabled={saving}>{saving?<span className="spinner"/>:editing?"Update Pet":"Add Pet"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
