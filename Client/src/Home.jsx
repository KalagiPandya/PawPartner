import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PawPrint, Heart, ShoppingBag, Star, ArrowRight, Sparkles } from "lucide-react"

const stats = [
  { num:"12K+", label:"Happy Pets",    emoji:"🐾" },
  { num:"3.5K+",label:"Adoptions",     emoji:"❤️" },
  { num:"500+", label:"Partner Shops", emoji:"🏪" },
  { num:"98%",  label:"Happy Owners",  emoji:"😊" },
]

const services = [
  { emoji:"🐶", title:"Pet Profiles",     desc:"Create beautiful profiles for your beloved companions. Track health records & precious memories.", link:"/pet-profile",      color:"#FF6B35", bg:"rgba(255,107,53,.08)"  },
  { emoji:"❤️", title:"Adoption Centers", desc:"Find your perfect furry soulmate. Browse loving animals waiting for their forever home.",         link:"/adoption-centers", color:"#FF6B9D", bg:"rgba(255,107,157,.08)" },
  { emoji:"🛒", title:"Pet Shops",        desc:"Discover premium pet products, nutritious food, fun toys and everything your pet needs.",          link:"/pet-shops",        color:"#4ECDC4", bg:"rgba(78,205,196,.08)"  },
]

const testimonials = [
  { name:"Priya Sharma", pet:"Bella 🐩", text:"PawPartner helped me find my dream dog! The adoption process was incredibly smooth.", avatar:"PS", stars:5 },
  { name:"Rahul Mehta",  pet:"Max 🐕",  text:"Amazing platform! Found the perfect food and toys for Max. Highly recommended.", avatar:"RM", stars:5 },
  { name:"Anjali Patel", pet:"Luna 🐱", text:"The pet profile feature is so cute and useful. Love tracking Luna's health records!", avatar:"AP", stars:5 },
]

const PETS = ["🐶","🐱","🐰","🐹","🦊","🐧","🦜","🐠","🐢","🐻"]

export default function Home() {
  const navigate  = useNavigate()
  const [petIdx,   setPetIdx]   = useState(0)
  const [visible,  setVisible]  = useState(false)

  useEffect(() => {
    setVisible(true)
    const t = setInterval(() => setPetIdx(i => (i+1) % PETS.length), 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ paddingTop:72, overflowX:"hidden" }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ minHeight:"calc(100vh - 72px)", background:"linear-gradient(135deg,#FFF8F3 0%,#FFE8D6 100%)", display:"flex", alignItems:"center", position:"relative", overflow:"hidden", padding:"4rem 2rem" }}>
        {/* BG paw prints - pointer-events none so they never block clicks */}
        {["🐾","🐾","🐾","🐾","🐾","🐾"].map((p,i)=>(
          <div key={i} style={{ position:"absolute", fontSize:`${1.5+i*.3}rem`, opacity:.12, pointerEvents:"none", animation:`float ${3+i*.4}s ease-in-out infinite`, animationDelay:`${i*.5}s`, top:`${10+i*15}%`, left:`${5+i*16}%` }}>{p}</div>
        ))}
        <div key="br1" style={{ position:"absolute", fontSize:"2rem", opacity:.1, pointerEvents:"none", animation:"float 4s ease-in-out infinite", top:"20%", right:"8%" }}>🐾</div>
        <div key="br2" style={{ position:"absolute", fontSize:"1.5rem", opacity:.1, pointerEvents:"none", animation:"float 3s ease-in-out infinite 1s", top:"70%", right:"15%" }}>🐾</div>

        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center", width:"100%", position:"relative", zIndex:1 }}>
          {/* LEFT TEXT */}
          <div style={{ opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(30px)", transition:"all .7s ease" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,107,53,.12)", border:"1.5px solid rgba(255,107,53,.25)", borderRadius:50, padding:"6px 16px", fontSize:".82rem", fontWeight:800, color:"#FF6B35", marginBottom:"1.5rem" }}>
              <Sparkles size={13}/> #1 Pet Care Platform in India
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.4rem,4.5vw,4rem)", fontWeight:800, lineHeight:1.15, color:"#1A1A2E", marginBottom:"1.2rem" }}>
              Find Your<br/>
              <span style={{ background:"linear-gradient(135deg,#FF6B35,#FF8C5A)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Perfect</span> Furry<br/>
              Companion 🐾
            </h1>
            <p style={{ fontSize:"1.05rem", color:"#7A7A8C", lineHeight:1.8, marginBottom:"2rem", maxWidth:480 }}>
              Connect with adoption centers, manage your pet's life, and discover everything your beloved companion deserves.
            </p>
            {/* BUTTONS - using onClick for reliable navigation */}
            <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"2.5rem" }}>
              <button onClick={()=>navigate("/adoption-centers")} style={{ background:"linear-gradient(135deg,#FF6B35,#FF8C5A)", color:"white", border:"none", borderRadius:50, padding:"14px 28px", fontWeight:800, fontSize:"1rem", display:"inline-flex", alignItems:"center", gap:8, boxShadow:"0 6px 20px rgba(255,107,53,.3)", cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all .3s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform=""}>
                <Heart size={18}/> Adopt a Pet
              </button>
              <button onClick={()=>navigate("/pet-shops")} style={{ background:"white", color:"#FF6B35", border:"2px solid #FF6B35", borderRadius:50, padding:"12px 28px", fontWeight:800, fontSize:"1rem", display:"inline-flex", alignItems:"center", gap:8, cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all .3s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform=""}>
                <ShoppingBag size={18}/> Shop Now
              </button>
            </div>
            <div style={{ display:"flex", gap:"2rem", flexWrap:"wrap" }}>
              {stats.map((s,i)=>(
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:"1.5rem", fontWeight:900, color:"#FF6B35" }}>{s.num}</div>
                  <div style={{ fontSize:".78rem", color:"#7A7A8C", fontWeight:700 }}>{s.emoji} {s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT ANIMATED PET */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <div style={{ width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,107,53,.15),rgba(255,140,90,.05))", border:"3px solid rgba(255,107,53,.2)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", animation:"float 4s ease-in-out infinite" }}>
              <div style={{ position:"absolute", inset:-20, borderRadius:"50%", border:"2px dashed rgba(255,107,53,.15)", animation:"spin 20s linear infinite" }}/>
              <div style={{ fontSize:"7rem", lineHeight:1, animation:"pulsePaw 2s ease-in-out infinite", transition:"all .4s ease" }}>{PETS[petIdx]}</div>
              {["🦴","⭐","💕","🏠","🎾"].map((e,i)=>(
                <div key={i} style={{ position:"absolute", top:`${50-45*Math.cos(i*72*Math.PI/180)}%`, left:`${50+45*Math.sin(i*72*Math.PI/180)}%`, transform:"translate(-50%,-50%)", fontSize:"1.6rem", animation:`float ${2.5+i*.3}s ease-in-out infinite`, animationDelay:`${i*.4}s`, pointerEvents:"none" }}>{e}</div>
              ))}
            </div>
            <div style={{ position:"absolute", top:"10%", right:"-5%", background:"white", borderRadius:16, padding:"12px 16px", boxShadow:"0 8px 30px rgba(0,0,0,.1)", animation:"float 3.5s ease-in-out infinite .5s", pointerEvents:"none" }}>
              <div style={{ fontSize:".75rem", fontWeight:700, color:"#7A7A8C" }}>Pets Adopted</div>
              <div style={{ fontSize:"1.4rem", fontWeight:900, color:"#FF6B35" }}>3,500+</div>
            </div>
            <div style={{ position:"absolute", bottom:"15%", left:"-5%", background:"white", borderRadius:16, padding:"12px 16px", boxShadow:"0 8px 30px rgba(0,0,0,.1)", animation:"float 3s ease-in-out infinite 1s", pointerEvents:"none" }}>
              <div style={{ fontSize:".75rem", fontWeight:700, color:"#7A7A8C" }}>Happy Families</div>
              <div style={{ fontSize:"1.4rem", fontWeight:900, color:"#4ECDC4" }}>12,000+</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <div style={{ background:"linear-gradient(135deg,#FF6B35,#FF8C5A)", padding:"2.5rem 2rem" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"2rem" }}>
          {stats.map((s,i)=>(
            <div key={i} style={{ textAlign:"center", color:"white" }}>
              <div style={{ fontSize:"2.2rem", marginBottom:".3rem" }}>{s.emoji}</div>
              <div style={{ fontSize:"2rem", fontWeight:900, fontFamily:"'Playfair Display',serif" }}>{s.num}</div>
              <div style={{ fontSize:".88rem", opacity:.85, fontWeight:700 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section style={{ padding:"5rem 2rem", background:"#FFF8F3" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,107,53,.1)", borderRadius:50, padding:"5px 14px", fontSize:".78rem", fontWeight:800, color:"#FF6B35", marginBottom:"1rem" }}>
              <PawPrint size={13}/> What We Offer
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:800, color:"#1A1A2E", marginBottom:".75rem" }}>Everything Your Pet<br/>Could Ever Need</h2>
            <p style={{ color:"#7A7A8C", fontSize:"1.05rem", maxWidth:520, margin:"0 auto" }}>From adoption to daily care — PawPartner is your complete pet care companion.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"2rem" }}>
            {services.map((s,i)=>(
              <button key={i} onClick={()=>navigate(s.link)} style={{ background:s.bg, borderRadius:24, padding:"2.5rem 2rem", textAlign:"left", border:`2px solid transparent`, cursor:"pointer", transition:"all .35s ease", fontFamily:"'Nunito',sans-serif", width:"100%" }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-8px)"; e.currentTarget.style.boxShadow="0 16px 48px rgba(0,0,0,.1)"; e.currentTarget.style.borderColor=s.color+"44" }}
                onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor="transparent" }}>
                <div style={{ width:72, height:72, borderRadius:20, background:`${s.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2.2rem", marginBottom:"1.5rem" }}>{s.emoji}</div>
                <div style={{ fontSize:"1.3rem", fontWeight:800, color:"#1A1A2E", marginBottom:".75rem" }}>{s.title}</div>
                <p style={{ color:"#7A7A8C", fontSize:".92rem", lineHeight:1.7, marginBottom:"1.5rem" }}>{s.desc}</p>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:".9rem", fontWeight:800, color:s.color }}>Explore <ArrowRight size={16}/></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section style={{ padding:"5rem 2rem", background:"linear-gradient(135deg,#FFF0E6,#FFE8D6)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,107,53,.1)", borderRadius:50, padding:"5px 14px", fontSize:".78rem", fontWeight:800, color:"#FF6B35", marginBottom:"1rem" }}>
              <Star size={13}/> Happy Families
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:800, color:"#1A1A2E" }}>What Pet Parents Say ❤️</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.8rem" }}>
            {testimonials.map((t,i)=>(
              <div key={i} style={{ background:"white", borderRadius:24, padding:"2rem", boxShadow:"0 4px 20px rgba(0,0,0,.06)", transition:"transform .3s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-5px)"}
                onMouseLeave={e=>e.currentTarget.style.transform=""}>
                <div style={{ color:"#FFB830", fontSize:"1.1rem", marginBottom:"1rem" }}>{"⭐".repeat(t.stars)}</div>
                <p style={{ color:"#4A4A5A", fontSize:".95rem", lineHeight:1.7, marginBottom:"1.5rem", fontStyle:"italic" }}>"{t.text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#FF6B35,#FF8C5A)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"white", fontSize:".85rem", fontFamily:"'Nunito',sans-serif" }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:".95rem", color:"#1A1A2E", fontFamily:"'Nunito',sans-serif" }}>{t.name}</div>
                    <div style={{ fontSize:".82rem", color:"#7A7A8C", fontFamily:"'Nunito',sans-serif" }}>Pet: {t.pet}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ background:"linear-gradient(135deg,#1A1A2E,#16213E)", padding:"6rem 2rem", textAlign:"center" }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <div style={{ fontSize:"4rem", marginBottom:"1.5rem", animation:"float 3s ease-in-out infinite" }}>🐾</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, color:"white", marginBottom:"1rem" }}>
            Ready to Find Your <span style={{ color:"#FF6B35" }}>Forever Friend?</span>
          </h2>
          <p style={{ color:"rgba(255,255,255,.6)", fontSize:"1.05rem", marginBottom:"2.5rem", lineHeight:1.7 }}>
            Join PawPartner today and discover the joy of unconditional love. Thousands of adorable pets are waiting for a loving home like yours.
          </p>
          <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
            {/* Get Started Free - goes to signup */}
            <button onClick={()=>navigate("/signup")} style={{ background:"linear-gradient(135deg,#FF6B35,#FF8C5A)", color:"white", border:"none", borderRadius:50, padding:"16px 32px", fontWeight:800, fontSize:"1.05rem", display:"inline-flex", alignItems:"center", gap:8, boxShadow:"0 6px 20px rgba(255,107,53,.3)", cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all .3s" }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform=""}>
              Get Started Free 🚀
            </button>
            {/* Browse Pets - goes to adoption centers */}
            <button onClick={()=>navigate("/adoption-centers")} style={{ background:"transparent", color:"rgba(255,255,255,.8)", border:"2px solid rgba(255,255,255,.3)", borderRadius:50, padding:"14px 28px", fontWeight:800, fontSize:"1rem", display:"inline-flex", alignItems:"center", gap:8, cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all .3s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,.1)"; e.currentTarget.style.transform="translateY(-2px)" }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.transform="" }}>
              Browse Pets <ArrowRight size={16}/>
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulsePaw{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
        @media(max-width:900px){
          section > div > div[style*="1fr 1fr"]{grid-template-columns:1fr !important}
          div[style*="repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr) !important}
        }
      `}</style>
    </div>
  )
}
