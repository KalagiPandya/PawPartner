import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Store, Phone, MapPin, Search, Package, ShoppingBag } from "lucide-react"

const SAMPLE_SHOPS = [
  { _id:"sh1", shopName:"Pawsome Pet Store",      address:"Ahmedabad, Gujarat",   contact:"9898123456", description:"One-stop shop for all your pet needs. Premium food, toys and accessories.", items:[{name:"Royal Canin Dog Food",type:"food"},{name:"Cat Scratching Post",type:"toy"},{name:"Dog Collar",type:"accessory"},{name:"Flea Treatment",type:"medicine"},{name:"Chew Bone",type:"toy"},{name:"Bird Cage",type:"accessory"}] },
  { _id:"sh2", shopName:"Furry Friends Supplies", address:"Surat, Gujarat",        contact:"9898234567", description:"High-quality pet supplies for dogs, cats, birds and fish. Trusted for 10 years.", items:[{name:"Pedigree Adult",type:"food"},{name:"Laser Pointer",type:"toy"},{name:"Pet Shampoo",type:"accessory"},{name:"Vitamin Drops",type:"medicine"}] },
  { _id:"sh3", shopName:"Happy Tails Shop",       address:"Vadodara, Gujarat",     contact:"9898345678", description:"Your neighbourhood pet shop. Friendly staff and competitive prices.", items:[{name:"Whiskas Cat Food",type:"food"},{name:"Catnip Mouse",type:"toy"},{name:"Dog Harness",type:"accessory"}] },
  { _id:"sh4", shopName:"PetCare Emporium",       address:"Rajkot, Gujarat",       contact:"9898456789", description:"Premium imported pet products. We stock only the best brands.", items:[{name:"Hill's Science Diet",type:"food"},{name:"Kong Toy",type:"toy"},{name:"GPS Pet Tracker",type:"accessory"},{name:"Deworming Tablets",type:"medicine"},{name:"Aquarium Kit",type:"accessory"}] },
  { _id:"sh5", shopName:"The Wagging Store",      address:"Junagadh, Gujarat",     contact:"9898567890", description:"Everything your pet needs from food to grooming. Open 7 days a week.", items:[{name:"Drools Dog Food",type:"food"},{name:"Rope Toy",type:"toy"},{name:"Pet Bed",type:"accessory"}] },
  { _id:"sh6", shopName:"Meow & Woof Mart",       address:"Bhavnagar, Gujarat",    contact:"9898678901", description:"Specialists in cats and dogs. We have over 500 products in store.", items:[{name:"Orijen Cat Food",type:"food"},{name:"Interactive Puzzle",type:"toy"},{name:"Cat Tree",type:"accessory"},{name:"Tick Spray",type:"medicine"}] },
  { _id:"sh7", shopName:"Mumbai Pet World",       address:"Mumbai, Maharashtra",    contact:"9898789012", description:"Mumbai's largest pet supply chain. 3 branches, 1000+ products.", items:[{name:"Acana Dog Food",type:"food"},{name:"Tug Rope",type:"toy"},{name:"Dog Stroller",type:"accessory"},{name:"Joint Supplement",type:"medicine"}] },
  { _id:"sh8", shopName:"Delhi Pet Corner",       address:"New Delhi",             contact:"9898890123", description:"Quality pet products at affordable prices. Delivery across Delhi NCR.", items:[{name:"Purina Pro Plan",type:"food"},{name:"Squeaky Ball",type:"toy"},{name:"Cat Carrier",type:"accessory"}] },
  { _id:"sh9", shopName:"Bengaluru Paws Store",   address:"Bengaluru, Karnataka",  contact:"9898901234", description:"Tech city's premium pet shop. Shop online or in-store.", items:[{name:"Farmina Dog Food",type:"food"},{name:"Smart Feeder",type:"accessory"},{name:"Calming Treats",type:"medicine"},{name:"Feather Wand",type:"toy"}] },
  { _id:"sh10",shopName:"Pune Animal Supplies",   address:"Pune, Maharashtra",     contact:"9899012345", description:"Over 800 products for all pets. Vet-recommended items always in stock.", items:[{name:"Blue Buffalo",type:"food"},{name:"Tennis Ball Pack",type:"toy"},{name:"Grooming Kit",type:"accessory"},{name:"Probiotic Paste",type:"medicine"}] },
]

const TYPE_EMOJI = { food:"🍖", toy:"🎾", accessory:"🎀", medicine:"💊" }
const COLORS = ["rgba(255,107,53,.08)","rgba(78,205,196,.08)","rgba(255,107,157,.08)","rgba(255,182,69,.08)","rgba(130,130,255,.08)"]

export default function PetShop() {
  const [shops,   setShops]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState("")

  useEffect(() => { fetchShops() }, [])

  const fetchShops = async () => {
    try {
      const res  = await axios.get("http://localhost:8000/api/v1/pet-shops", { withCredentials: true })
      const data = res.data?.data || []
      if (data.length >= 10) {
        setShops(data)
      } else {
        // Pad with sample data so there's always 10 cards
        const fill = SAMPLE_SHOPS.slice(data.length)
        setShops([...data, ...fill])
      }
    } catch {
      toast.error("Could not reach server — showing sample data")
      setShops(SAMPLE_SHOPS)
    } finally { setLoading(false) }
  }

  const filtered = shops.filter(s =>
    (s.shopName||s.petShopName||"").toLowerCase().includes(search.toLowerCase()) ||
    (s.address||"").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        .ps-page{padding-top:72px;min-height:100vh;background:#FFF8F3;font-family:'Nunito',sans-serif}
        .ps-hero{background:linear-gradient(135deg,#4ECDC4 0%,#2C9E96 100%);padding:4rem 2rem;text-align:center;color:white;position:relative;overflow:hidden}
        .ps-hero::before{content:'🛒';position:absolute;right:8%;top:50%;transform:translateY(-50%);font-size:8rem;opacity:.1}
        .ps-hero-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.18);border-radius:50px;padding:5px 14px;font-size:.8rem;font-weight:800;margin-bottom:1rem}
        .ps-hero h1{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3rem);font-weight:800;margin-bottom:.8rem}
        .ps-hero p{opacity:.85;font-size:1rem;max-width:500px;margin:0 auto 2rem;line-height:1.7}
        .ps-search{max-width:500px;margin:0 auto;background:white;border-radius:50px;padding:8px 8px 8px 20px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px rgba(0,0,0,.15)}
        .ps-search svg{color:#4ECDC4;flex-shrink:0}
        .ps-search input{flex:1;border:none;outline:none;font-size:.93rem;font-family:'Nunito',sans-serif;color:#2D2D2D;background:transparent}
        .ps-search-btn{background:linear-gradient(135deg,#4ECDC4,#2C9E96);color:white;border:none;border-radius:50px;padding:10px 20px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;font-size:.88rem;white-space:nowrap}
        .ps-main{max-width:1280px;margin:0 auto;padding:3rem 2rem}
        .ps-count{font-size:.9rem;font-weight:700;color:#7A7A8C;margin-bottom:2rem}
        .ps-count span{color:#4ECDC4;font-size:1.05rem}
        .ps-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:1.8rem}
        .ps-card{background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.07);transition:all .35s;border:2px solid transparent}
        .ps-card:hover{transform:translateY(-6px);box-shadow:0 14px 40px rgba(78,205,196,.15);border-color:rgba(78,205,196,.25)}
        .ps-card-top{height:140px;display:flex;align-items:center;justify-content:center;font-size:4rem}
        .ps-card-top img{width:100%;height:100%;object-fit:cover}
        .ps-card-body{padding:1.4rem 1.5rem 1.5rem}
        .ps-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(78,205,196,.1);color:#35B5AC;border-radius:50px;padding:3px 10px;font-size:.73rem;font-weight:800;margin-bottom:.7rem}
        .ps-name{font-size:1.15rem;font-weight:800;color:#1A1A2E;margin-bottom:.5rem}
        .ps-detail{display:flex;align-items:center;gap:7px;color:#7A7A8C;font-size:.83rem;font-weight:600;margin-bottom:.4rem}
        .ps-detail svg{color:#4ECDC4;flex-shrink:0;width:14px;height:14px}
        .ps-items{margin-top:1rem;padding-top:1rem;border-top:1.5px solid #F5F5F5}
        .ps-items-label{font-size:.8rem;font-weight:800;color:#4A4A5A;margin-bottom:.6rem;display:flex;align-items:center;gap:5px}
        .ps-items-row{display:flex;flex-wrap:wrap;gap:6px}
        .ps-item-chip{display:flex;align-items:center;gap:4px;background:#F5F5F5;border-radius:50px;padding:4px 10px;font-size:.75rem;font-weight:700;color:#4A4A5A;transition:all .2s}
        .ps-item-chip:hover{background:rgba(78,205,196,.15);color:#35B5AC}
        .ps-loading{text-align:center;padding:6rem 2rem}
        .ps-loading-emoji{font-size:3rem;animation:float 2s ease-in-out infinite;display:block;margin-bottom:1rem}
        @media(max-width:768px){.ps-grid{grid-template-columns:1fr}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      `}</style>
      <div className="ps-page">
        <div className="ps-hero">
          <div className="ps-hero-tag"><ShoppingBag size={13}/> Premium Pet Stores</div>
          <h1>Pet Shops 🛒</h1>
          <p>Discover premium products, nutritious food, and everything your furry friend needs.</p>
          <div className="ps-search">
            <Search size={18}/>
            <input placeholder="Search shops by name or city…" value={search} onChange={e=>setSearch(e.target.value)}/>
            <button className="ps-search-btn">Search</button>
          </div>
        </div>

        <div className="ps-main">
          {loading ? (
            <div className="ps-loading">
              <span className="ps-loading-emoji">🛒</span>
              <p style={{color:"#7A7A8C",fontWeight:700}}>Loading pet shops…</p>
            </div>
          ) : (
            <>
              <p className="ps-count">Showing <span>{filtered.length}</span> pet shop{filtered.length!==1?"s":""}</p>
              <div className="ps-grid">
                {filtered.map((shop, i) => {
                  const name  = shop.shopName || shop.petShopName || "Pet Shop"
                  const items = shop.items || []
                  return (
                    <div key={shop._id} className="ps-card">
                      <div className="ps-card-top" style={{background:COLORS[i%5]}}>
                        {shop.imageUrl ? <img src={shop.imageUrl} alt={name}/> : "🏪"}
                      </div>
                      <div className="ps-card-body">
                        <div className="ps-badge"><Store size={11}/> Verified Shop</div>
                        <div className="ps-name">{name}</div>
                        {shop.address  && <div className="ps-detail"><MapPin/>{shop.address}</div>}
                        {(shop.contact||shop.contactNumber) && <div className="ps-detail"><Phone/>{shop.contact||shop.contactNumber}</div>}
                        {shop.description && <p style={{color:"#7A7A8C",fontSize:".83rem",lineHeight:1.6,margin:".5rem 0",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",display:"-webkit-box"}}>{shop.description}</p>}
                        {items.length > 0 && (
                          <div className="ps-items">
                            <div className="ps-items-label"><Package size={13}/> Products ({items.length})</div>
                            <div className="ps-items-row">
                              {items.slice(0,6).map((item,j) => (
                                <span key={j} className="ps-item-chip">
                                  {TYPE_EMOJI[item.type]||"📦"} {item.name||item.itemName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
