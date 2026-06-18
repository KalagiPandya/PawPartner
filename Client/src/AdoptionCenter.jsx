import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, Heart, ArrowRight, PawPrint } from "lucide-react"

// ── 10 sample adoption centers shown when DB is empty ─────────────────────────
const SAMPLE_CENTERS = [
  { _id:"s1", adoptionCenterName:"Happy Paws Shelter",      address:"Ahmedabad, Gujarat",     adoptionCenterDescription:"A loving shelter for dogs and cats of all ages. We've rehomed over 500 animals since 2018.", imageUrl:"", pets:["🐶","🐱","🐶","🐱","🐰"] },
  { _id:"s2", adoptionCenterName:"Rainbow Bridge Rescue",   address:"Surat, Gujarat",          adoptionCenterDescription:"Specialising in senior pet rescue and rehabilitation. Every animal deserves a second chance.", imageUrl:"", pets:["🐕","🐈","🐇","🐕","🐈"] },
  { _id:"s3", adoptionCenterName:"Furever Home Foundation", address:"Vadodara, Gujarat",       adoptionCenterDescription:"We rescue, rehabilitate, and rehome stray animals across Vadodara with dedicated volunteers.", imageUrl:"", pets:["🐶","🐱","🦜","🐶","🐱"] },
  { _id:"s4", adoptionCenterName:"Pawsome Care Centre",     address:"Rajkot, Gujarat",         adoptionCenterDescription:"Run by passionate animal lovers. Offering vaccinated, microchipped and neutered pets for adoption.", imageUrl:"", pets:["🐕","🐈","🐰","🐟","🐕"] },
  { _id:"s5", adoptionCenterName:"Second Chance Sanctuary", address:"Junagadh, Gujarat",       adoptionCenterDescription:"Our sanctuary provides a safe haven for abused and abandoned animals awaiting adoption.", imageUrl:"", pets:["🐶","🐱","🦜","🐶","🐈"] },
  { _id:"s6", adoptionCenterName:"Gentle Hearts Rescue",    address:"Bhavnagar, Gujarat",      adoptionCenterDescription:"Gentle Hearts has been connecting families with perfect furry companions for over 8 years.", imageUrl:"", pets:["🐕","🐕","🐈","🐇","🐶"] },
  { _id:"s7", adoptionCenterName:"Mumbai Pet Rescue",       address:"Mumbai, Maharashtra",      adoptionCenterDescription:"The largest pet rescue operation in Maharashtra — over 1,200 successful adoptions per year.", imageUrl:"", pets:["🐶","🐱","🐶","🐱","🦜"] },
  { _id:"s8", adoptionCenterName:"Delhi Animal Welfare",    address:"New Delhi",               adoptionCenterDescription:"Delhi's most trusted animal welfare society operating shelters across 6 districts.", imageUrl:"", pets:["🐕","🐈","🐕","🐈","🐰"] },
  { _id:"s9", adoptionCenterName:"Paws & Claws Rescue",     address:"Bengaluru, Karnataka",    adoptionCenterDescription:"Tech-city's heart for animals — we use technology to match pets with their perfect owners.", imageUrl:"", pets:["🐶","🐱","🐟","🦜","🐶"] },
  { _id:"s10",adoptionCenterName:"Wagging Tails Society",   address:"Pune, Maharashtra",       adoptionCenterDescription:"Community-driven pet adoption centre. All pets are health-checked, vaccinated and ready to go.", imageUrl:"", pets:["🐕","🐕","🐈","🐕","🐈"] },
]

const COLORS = [
  "rgba(255,107,53,.08)","rgba(255,107,157,.08)","rgba(78,205,196,.08)",
  "rgba(255,182,69,.08)","rgba(130,130,255,.08)","rgba(255,107,53,.08)",
  "rgba(78,205,196,.08)","rgba(255,107,157,.08)","rgba(130,130,255,.08)","rgba(255,182,69,.08)"
]

const AdoptionCenter = () => {
  const [centers,  setCenters]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState("")
  const navigate = useNavigate()

  useEffect(() => { fetchCenters() }, [])

  const fetchCenters = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/adoption-centers", { withCredentials: true })
      const data = res.data?.data || []
      // merge DB data with samples; show samples padded to 10 total
      if (data.length >= 10) {
        setCenters(data)
      } else {
        const needed = SAMPLE_CENTERS.slice(data.length)
        setCenters([...data, ...needed])
      }
    } catch {
      toast.error("Could not reach server — showing sample data")
      setCenters(SAMPLE_CENTERS)
    } finally { setLoading(false) }
  }

  const filtered = centers.filter(c =>
    c.adoptionCenterName?.toLowerCase().includes(search.toLowerCase()) ||
    c.address?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        .ac-page{padding-top:72px;min-height:100vh;background:#FFF8F3;font-family:'Nunito',sans-serif}
        .ac-hero{background:linear-gradient(135deg,#FF6B9D 0%,#FF6B35 100%);padding:4rem 2rem;text-align:center;color:white;position:relative;overflow:hidden}
        .ac-hero::before{content:'❤️';position:absolute;right:8%;top:50%;transform:translateY(-50%);font-size:8rem;opacity:.1;pointer-events:none}
        .ac-hero-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.18);border-radius:50px;padding:5px 14px;font-size:.8rem;font-weight:800;margin-bottom:1rem}
        .ac-hero h1{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3rem);font-weight:800;margin-bottom:.8rem}
        .ac-hero p{opacity:.85;font-size:1rem;max-width:520px;margin:0 auto 2rem;line-height:1.7}
        .ac-search{max-width:500px;margin:0 auto;background:white;border-radius:50px;padding:8px 8px 8px 20px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px rgba(0,0,0,.15)}
        .ac-search svg{color:#FF6B9D;flex-shrink:0}
        .ac-search input{flex:1;border:none;outline:none;font-size:.93rem;font-family:'Nunito',sans-serif;color:#2D2D2D;background:transparent}
        .ac-search-btn{background:linear-gradient(135deg,#FF6B9D,#FF6B35);color:white;border:none;border-radius:50px;padding:10px 20px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;font-size:.88rem;white-space:nowrap}
        .ac-main{max-width:1280px;margin:0 auto;padding:3rem 2rem}
        .ac-row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem;margin-bottom:2rem}
        .ac-count{font-size:.9rem;font-weight:700;color:#7A7A8C}
        .ac-count span{color:#FF6B9D;font-size:1.1rem}
        .ac-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:1.8rem}
        .ac-card{border-radius:24px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.07);transition:all .35s ease;cursor:pointer}
        .ac-card:hover{transform:translateY(-6px);box-shadow:0 14px 40px rgba(255,107,53,.14)}
        .ac-card-top{height:160px;display:flex;align-items:center;justify-content:center;font-size:4.5rem;position:relative}
        .ac-card-top img{width:100%;height:100%;object-fit:cover}
        .ac-pets-strip{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:4px;background:rgba(255,255,255,.85);border-radius:50px;padding:4px 10px}
        .ac-pet-icon{font-size:1.1rem}
        .ac-card-body{background:white;padding:1.4rem 1.5rem 1.5rem}
        .ac-card-name{font-size:1.15rem;font-weight:800;color:#1A1A2E;margin-bottom:.4rem}
        .ac-card-addr{display:flex;align-items:center;gap:6px;color:#7A7A8C;font-size:.83rem;font-weight:600;margin-bottom:.8rem}
        .ac-card-addr svg{color:#FF6B9D;flex-shrink:0;width:14px;height:14px}
        .ac-card-desc{color:#7A7A8C;font-size:.87rem;line-height:1.6;margin-bottom:1.2rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .ac-card-btn{width:100%;padding:10px;border:none;border-radius:11px;background:linear-gradient(135deg,#FF6B9D,#FF8CB8);color:white;font-weight:800;font-size:.88rem;cursor:pointer;font-family:'Nunito',sans-serif;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .3s}
        .ac-card-btn:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(255,107,157,.3)}
        .ac-loading{text-align:center;padding:6rem 2rem}
        .ac-loading-emoji{font-size:3rem;animation:float 2s ease-in-out infinite;display:block;margin-bottom:1rem}
        @media(max-width:768px){.ac-grid{grid-template-columns:1fr}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      `}</style>
      <div className="ac-page">
        <div className="ac-hero">
          <div className="ac-hero-tag"><Heart size={13}/> Find Your Match</div>
          <h1>Adoption Centers 🐾</h1>
          <p>Thousands of loving animals waiting for their forever family. Find yours today.</p>
          <div className="ac-search">
            <Search size={18}/>
            <input placeholder="Search by name or city…" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter" && e.preventDefault()}/>
            <button className="ac-search-btn">Search</button>
          </div>
        </div>

        <div className="ac-main">
          {loading ? (
            <div className="ac-loading">
              <span className="ac-loading-emoji">🐾</span>
              <p style={{color:"#7A7A8C",fontWeight:700}}>Loading adoption centers…</p>
            </div>
          ) : (
            <>
              <div className="ac-row">
                <p className="ac-count">Showing <span>{filtered.length}</span> adoption center{filtered.length!==1?"s":""}</p>
              </div>
              <div className="ac-grid">
                {filtered.map((c, i) => (
                  <div key={c._id} className="ac-card" style={{background:"white"}} onClick={() => navigate(`/adoption-center-pets/${c._id}`)}>
                    <div className="ac-card-top" style={{background:COLORS[i%10]}}>
                      {c.imageUrl
                        ? <img src={c.imageUrl} alt={c.adoptionCenterName}/>
                        : <span>🏠</span>
                      }
                      {c.pets && (
                        <div className="ac-pets-strip">
                          {c.pets.slice(0,5).map((p,j)=><span key={j} className="ac-pet-icon">{p}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="ac-card-body">
                      <div className="ac-card-name">{c.adoptionCenterName}</div>
                      <div className="ac-card-addr"><MapPin/>{c.address||"Location not specified"}</div>
                      <p className="ac-card-desc">{c.adoptionCenterDescription||"A wonderful adoption center ready to help you find your perfect pet companion."}</p>
                      <button className="ac-card-btn"><Heart size={14}/> View Available Pets <ArrowRight size={13}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default AdoptionCenter
