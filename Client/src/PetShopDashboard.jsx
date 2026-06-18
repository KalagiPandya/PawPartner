import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Plus, X, Edit, Trash2, PawPrint, Package } from "lucide-react"

const API = "http://localhost:8000/api/v1"
const authH = () => { const t=localStorage.getItem("token"); return t?{Authorization:`Bearer ${t}`}:{} }
const TYPE_EMOJI = { food:"🍖", toy:"🎾", accessory:"🎀", medicine:"💊" }

export default function PetShopDashboard() {
  const navigate = useNavigate()
  const [shop,    setShop]    = useState(null)
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [tab,     setTab]     = useState("items")
  const [form,    setForm]    = useState({ name:"", weight:"", description:"", type:"food", image:null })
  const [profile, setProfile] = useState({ shopName:"", address:"", contact:"" })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const sRes = await axios.get(`${API}/pet-shops/profile`, { withCredentials:true, headers:authH() })
      const s = sRes.data?.data
      if (!s) { navigate("/signin"); return }
      setShop(s)
      setProfile({ shopName:s.shopName||"", address:s.address||"", contact:s.contact||"" })
      const iRes = await axios.get(`${API}/items`, { withCredentials:true, headers:authH() })
      const all  = iRes.data?.data || []
      // Filter to show only this shop's items
      setItems(all.filter(i => (i.seller?._id||i.seller)?.toString() === s._id?.toString()))
    } catch (err) {
      if (err.response?.status === 401) { navigate("/signin"); return }
      toast.error("Failed to load dashboard")
    } finally { setLoading(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("role"); navigate("/signin")
  }

  const openAdd = () => {
    setEditing(null); setForm({ name:"", weight:"", description:"", type:"food", image:null }); setModal(true)
  }
  const openEdit = (item) => {
    setEditing(item); setForm({ name:item.name, weight:String(item.weight), description:item.description, type:item.type, image:null }); setModal(true)
  }
  const closeModal = () => { setModal(false); setEditing(null) }

  const handleSaveItem = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      fd.append("name", form.name)
      fd.append("weight", form.weight)
      fd.append("description", form.description)
      fd.append("type", form.type)
      if (form.image) fd.append("image", form.image)

      if (editing) {
        const res = await axios.patch(`${API}/items/update/${editing._id}`, fd, { withCredentials:true, headers:authH() })
        setItems(p => p.map(x => x._id===editing._id ? res.data.data : x))
        toast.success("Item updated! ✅")
      } else {
        const res = await axios.post(`${API}/items/add`, fd, { withCredentials:true, headers:authH() })
        setItems(p => [...p, res.data.data])
        toast.success("Item added! 🎉")
      }
      closeModal()
    } catch (err) { toast.error(err.response?.data?.message || "Failed to save") }
    finally { setSaving(false) }
  }

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return
    try {
      await axios.delete(`${API}/items/delete/${id}`, { withCredentials:true, headers:authH() })
      setItems(p => p.filter(x => x._id !== id))
      toast.success("Item deleted")
    } catch { toast.error("Failed to delete") }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await axios.patch(`${API}/pet-shops/update-details`, profile, { withCredentials:true, headers:authH() })
      toast.success("Profile updated! ✅")
    } catch { toast.error("Failed to update") }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#F0FFFE",flexDirection:"column",gap:"1rem",fontFamily:"Nunito,sans-serif"}}>
      <div style={{fontSize:"3rem",animation:"float 2s ease-in-out infinite"}}>🛒</div>
      <p style={{color:"#7A7A8C",fontWeight:700}}>Loading dashboard…</p>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *{box-sizing:border-box}
        .spdb{display:flex;min-height:100vh;font-family:'Nunito',sans-serif;background:#F0FFFE}
        .spdb-side{width:260px;flex-shrink:0;background:linear-gradient(180deg,#0D4F4C,#0A3D3A);display:flex;flex-direction:column;padding:2rem 0}
        .spdb-logo{display:flex;align-items:center;gap:10px;font-family:'Playfair Display',serif;font-size:1.35rem;font-weight:800;color:white;padding:0 1.5rem 2rem}
        .spdb-logo-icon{background:linear-gradient(135deg,#4ECDC4,#35B5AC);border-radius:10px;padding:7px;display:flex}
        .spdb-logo-icon svg{color:white;width:18px;height:18px}
        .spdb-shop-info{padding:0 1.5rem 2rem;border-bottom:1px solid rgba(255,255,255,.1)}
        .spdb-shop-avatar{width:56px;height:56px;background:linear-gradient(135deg,#4ECDC4,#35B5AC);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;margin-bottom:.8rem}
        .spdb-shop-name{color:white;font-weight:800;font-size:.97rem;margin-bottom:.2rem}
        .spdb-shop-role{color:rgba(255,255,255,.45);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
        .spdb-nav{flex:1;padding:1.5rem 0}
        .spdb-nav-item{display:flex;align-items:center;gap:10px;width:100%;padding:12px 1.5rem;border:none;background:transparent;color:rgba(255,255,255,.6);font-size:.9rem;font-weight:700;cursor:pointer;transition:all .2s;font-family:'Nunito',sans-serif;text-align:left}
        .spdb-nav-item:hover{background:rgba(255,255,255,.06);color:white}
        .spdb-nav-item.active{background:rgba(78,205,196,.15);color:#4ECDC4;border-right:3px solid #4ECDC4}
        .spdb-logout{margin:0 1rem;padding:11px 16px;border:1.5px solid rgba(255,255,255,.15);border-radius:12px;background:transparent;color:rgba(255,255,255,.6);font-size:.88rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;font-family:'Nunito',sans-serif;transition:all .2s;width:calc(100% - 2rem)}
        .spdb-logout:hover{background:rgba(255,82,82,.15);border-color:rgba(255,82,82,.4);color:#FF5252}
        .spdb-main{flex:1;overflow-y:auto}
        .spdb-topbar{background:white;padding:1.2rem 2rem;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 12px rgba(0,0,0,.06);position:sticky;top:0;z-index:10}
        .spdb-topbar-title{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:800;color:#1A1A2E}
        .spdb-topbar-sub{color:#7A7A8C;font-size:.85rem;font-weight:600}
        .spdb-add-btn{background:linear-gradient(135deg,#4ECDC4,#35B5AC);color:white;border:none;border-radius:12px;padding:10px 18px;font-weight:800;font-size:.88rem;cursor:pointer;display:flex;align-items:center;gap:7px;font-family:'Nunito',sans-serif;transition:all .3s;box-shadow:0 4px 12px rgba(78,205,196,.3)}
        .spdb-add-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(78,205,196,.4)}
        .spdb-content{padding:2rem}
        .spdb-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem;margin-bottom:2rem}
        .spdb-stat{background:white;border-radius:18px;padding:1.3rem;box-shadow:0 2px 12px rgba(0,0,0,.06)}
        .spdb-stat-emoji{font-size:1.8rem;margin-bottom:.4rem}
        .spdb-stat-num{font-size:1.9rem;font-weight:900;color:#1A1A2E;font-family:'Playfair Display',serif}
        .spdb-stat-label{font-size:.75rem;font-weight:700;color:#7A7A8C;text-transform:uppercase;letter-spacing:.4px}
        .spdb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1.3rem}
        .spdb-item-card{background:white;border-radius:18px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06);transition:all .3s;border:2px solid transparent}
        .spdb-item-card:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(78,205,196,.14);border-color:rgba(78,205,196,.2)}
        .spdb-item-img{width:100%;height:140px;object-fit:cover}
        .spdb-item-placeholder{width:100%;height:140px;display:flex;align-items:center;justify-content:center;font-size:3.5rem}
        .spdb-item-body{padding:1rem}
        .spdb-item-type{display:inline-flex;align-items:center;gap:4px;background:rgba(78,205,196,.1);color:#35B5AC;border-radius:50px;padding:2px 9px;font-size:.72rem;font-weight:800;margin-bottom:.5rem}
        .spdb-item-name{font-size:1rem;font-weight:800;color:#1A1A2E;margin-bottom:.25rem}
        .spdb-item-weight{font-size:.8rem;color:#7A7A8C;font-weight:600;margin-bottom:.8rem}
        .spdb-item-actions{display:flex;gap:6px}
        .spdb-edit-btn{flex:1;padding:7px;border:none;border-radius:8px;background:rgba(78,205,196,.12);color:#35B5AC;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;font-size:.8rem;display:flex;align-items:center;justify-content:center;gap:3px;transition:all .2s}
        .spdb-edit-btn:hover{background:#4ECDC4;color:white}
        .spdb-del-btn{flex:1;padding:7px;border:none;border-radius:8px;background:rgba(255,82,82,.1);color:#FF5252;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;font-size:.8rem;display:flex;align-items:center;justify-content:center;gap:3px;transition:all .2s}
        .spdb-del-btn:hover{background:#FF5252;color:white}
        .spdb-empty{text-align:center;padding:4rem 2rem;background:white;border-radius:20px}
        .spdb-profile-form{background:white;border-radius:20px;padding:2rem;box-shadow:0 2px 12px rgba(0,0,0,.06);max-width:600px}
        .spdb-field{margin-bottom:1.2rem}
        .spdb-label{font-size:.82rem;font-weight:800;color:#4A4A5A;margin-bottom:5px;display:block}
        .spdb-input{width:100%;padding:11px 14px;border:2px solid #E0F7F5;border-radius:12px;font-size:.92rem;font-family:'Nunito',sans-serif;outline:none;background:white;color:#2D2D2D;transition:border-color .2s}
        .spdb-input:focus{border-color:#4ECDC4;box-shadow:0 0 0 3px rgba(78,205,196,.1)}
        .spdb-save-btn{background:linear-gradient(135deg,#4ECDC4,#35B5AC);color:white;border:none;border-radius:12px;padding:12px 24px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;font-size:.95rem;transition:all .3s}
        .spdb-save-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 20px rgba(78,205,196,.4)}
        .spdb-save-btn:disabled{opacity:.65;cursor:not-allowed}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem;backdrop-filter:blur(4px)}
        .mbox{background:white;border-radius:24px;width:100%;max-width:460px;padding:2rem;position:relative;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.2);animation:fadeInUp .3s ease}
        .mclose{position:absolute;top:1rem;right:1rem;background:#E0F7F5;border:none;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#35B5AC;transition:all .2s}
        .mclose:hover{background:#4ECDC4;color:white}
        .mtitle{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:800;color:#1A1A2E;margin-bottom:1.5rem}
        .mfield{margin-bottom:.9rem}
        .mlabel{font-size:.8rem;font-weight:800;color:#4A4A5A;margin-bottom:4px;display:block}
        .minput,.mselect,.mtextarea{width:100%;padding:10px 12px;border:2px solid #E0F7F5;border-radius:11px;font-size:.9rem;font-family:'Nunito',sans-serif;outline:none;background:white;color:#2D2D2D;transition:border-color .2s}
        .minput:focus,.mselect:focus,.mtextarea:focus{border-color:#4ECDC4;box-shadow:0 0 0 3px rgba(78,205,196,.08)}
        .mtextarea{min-height:80px;resize:vertical}
        .mactions{display:flex;gap:10px;margin-top:1rem}
        .msub{flex:1;padding:12px;border:none;border-radius:11px;background:linear-gradient(135deg,#4ECDC4,#35B5AC);color:white;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;transition:all .3s}
        .msub:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 16px rgba(78,205,196,.35)}
        .msub:disabled{opacity:.65;cursor:not-allowed}
        .mcancel{padding:12px 18px;border:2px solid #E0F7F5;border-radius:11px;background:white;color:#7A7A8C;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif}
        .mcancel:hover{border-color:#4ECDC4;color:#4ECDC4}
        .spinner{width:15px;height:15px;border:3px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
        @media(max-width:768px){.spdb-side{display:none}.spdb-stats{grid-template-columns:1fr 1fr}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
      <ToastContainer position="top-right" theme="colored"/>
      <div className="spdb">
        <aside className="spdb-side">
          <div className="spdb-logo"><div className="spdb-logo-icon"><PawPrint/></div>PawPartner</div>
          <div className="spdb-shop-info">
            <div className="spdb-shop-avatar">🏪</div>
            <div className="spdb-shop-name">{shop?.shopName||"My Shop"}</div>
            <div className="spdb-shop-role">Pet Shop</div>
          </div>
          <nav className="spdb-nav">
            <button className={`spdb-nav-item${tab==="items"?" active":""}`} onClick={()=>setTab("items")}>📦 Products</button>
            <button className={`spdb-nav-item${tab==="profile"?" active":""}`} onClick={()=>setTab("profile")}>⚙️ Profile</button>
            <button className="spdb-nav-item" onClick={()=>navigate("/pet-shops")}>🏪 Public Page</button>
          </nav>
          <button className="spdb-logout" onClick={handleLogout}>🚪 Sign Out</button>
        </aside>

        <main className="spdb-main">
          <div className="spdb-topbar">
            <div>
              <div className="spdb-topbar-title">{tab==="items"?"My Products":"Profile Settings"}</div>
              <div className="spdb-topbar-sub">{tab==="items"?`${items.length} products`:"Manage shop information"}</div>
            </div>
            {tab==="items" && <button className="spdb-add-btn" onClick={openAdd}><Plus size={16}/>Add Product</button>}
          </div>

          <div className="spdb-content">
            {tab==="items" && (
              <>
                <div className="spdb-stats">
                  {[["📦","Total",items.length],["🍖","Food",items.filter(i=>i.type==="food").length],["🎾","Toys",items.filter(i=>i.type==="toy").length],["🎀","Other",items.filter(i=>i.type!=="food"&&i.type!=="toy").length]].map(([e,l,n])=>(
                    <div key={l} className="spdb-stat"><div className="spdb-stat-emoji">{e}</div><div className="spdb-stat-num">{n}</div><div className="spdb-stat-label">{l}</div></div>
                  ))}
                </div>
                {items.length===0 ? (
                  <div className="spdb-empty">
                    <div style={{fontSize:"3.5rem",marginBottom:"1rem"}}>📦</div>
                    <h3 style={{fontFamily:"Playfair Display,serif",color:"#1A1A2E",marginBottom:".5rem"}}>No products yet</h3>
                    <p style={{color:"#7A7A8C",marginBottom:"1.5rem"}}>Add products to showcase your shop.</p>
                    <button className="spdb-add-btn" onClick={openAdd} style={{margin:"0 auto"}}><Plus size={16}/>Add First Product</button>
                  </div>
                ) : (
                  <div className="spdb-grid">
                    {items.map((item,i)=>(
                      <div key={item._id} className="spdb-item-card">
                        {item.imageUrl && !item.imageUrl.includes("placehold")
                          ? <img src={item.imageUrl} alt={item.name} className="spdb-item-img"/>
                          : <div className="spdb-item-placeholder" style={{background:["rgba(78,205,196,.08)","rgba(255,107,53,.08)","rgba(255,107,157,.08)","rgba(255,182,69,.08)"][i%4]}}>{TYPE_EMOJI[item.type]||"📦"}</div>
                        }
                        <div className="spdb-item-body">
                          <div className="spdb-item-type">{TYPE_EMOJI[item.type]} {item.type}</div>
                          <div className="spdb-item-name">{item.name}</div>
                          <div className="spdb-item-weight">{item.weight}g</div>
                          <div className="spdb-item-actions">
                            <button className="spdb-edit-btn" onClick={()=>openEdit(item)}><Edit size={12}/>Edit</button>
                            <button className="spdb-del-btn" onClick={()=>handleDeleteItem(item._id)}><Trash2 size={12}/>Del</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {tab==="profile" && (
              <form className="spdb-profile-form" onSubmit={handleSaveProfile}>
                <h2 style={{fontFamily:"Playfair Display,serif",fontSize:"1.4rem",fontWeight:800,color:"#1A1A2E",marginBottom:"1.5rem"}}>Shop Information</h2>
                <div className="spdb-field"><label className="spdb-label">Shop Name</label><input className="spdb-input" value={profile.shopName} onChange={e=>setProfile(p=>({...p,shopName:e.target.value}))}/></div>
                <div className="spdb-field"><label className="spdb-label">Address</label><input className="spdb-input" value={profile.address} onChange={e=>setProfile(p=>({...p,address:e.target.value}))}/></div>
                <div className="spdb-field"><label className="spdb-label">Contact</label><input className="spdb-input" value={profile.contact} onChange={e=>setProfile(p=>({...p,contact:e.target.value}))}/></div>
                <button type="submit" className="spdb-save-btn" disabled={saving}>{saving?<span className="spinner"/>:"Save Changes ✅"}</button>
              </form>
            )}
          </div>
        </main>
      </div>

      {modal && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
          <div className="mbox">
            <button className="mclose" onClick={closeModal}><X size={15}/></button>
            <h2 className="mtitle">{editing?"✏️ Edit Product":"➕ Add Product"}</h2>
            <form onSubmit={handleSaveItem}>
              <div className="mfield"><label className="mlabel">Name *</label><input className="minput" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Royal Canin" required/></div>
              <div className="mfield"><label className="mlabel">Type *</label>
                <select className="mselect" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
                  <option value="food">🍖 Food</option>
                  <option value="toy">🎾 Toy</option>
                  <option value="accessory">🎀 Accessory</option>
                  <option value="medicine">💊 Medicine</option>
                </select>
              </div>
              <div className="mfield"><label className="mlabel">Weight (grams) *</label><input className="minput" type="number" min="1" value={form.weight} onChange={e=>setForm(p=>({...p,weight:e.target.value}))} required/></div>
              <div className="mfield"><label className="mlabel">Description *</label><textarea className="mtextarea" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} required/></div>
              <div className="mfield"><label className="mlabel">Photo (optional)</label><input className="minput" type="file" accept="image/*" onChange={e=>setForm(p=>({...p,image:e.target.files[0]}))}/></div>
              <div className="mactions">
                <button type="button" className="mcancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="msub" disabled={saving}>{saving?<span className="spinner"/>:editing?"Update":"Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
