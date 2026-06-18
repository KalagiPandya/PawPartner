import { useEffect, useState } from "react"

const PETS = ["🐶","🐱","🐰","🦜","🐠"]

export default function LoadingScreen({ message = "Loading…" }) {
  const [petIdx, setPetIdx] = useState(0)
  const [dots,   setDots]   = useState(1)

  useEffect(() => {
    const t1 = setInterval(() => setPetIdx(i => (i+1) % PETS.length), 600)
    const t2 = setInterval(() => setDots(d => d === 3 ? 1 : d+1), 400)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#FFF8F3", gap:"1.5rem", fontFamily:"'Nunito',sans-serif" }}>
      {/* Big bouncing pet */}
      <div style={{ position:"relative" }}>
        <div style={{ fontSize:"6rem", animation:"bounceIn .5s ease forwards, float 2s ease-in-out infinite 0.5s", display:"block" }}>
          {PETS[petIdx]}
        </div>
        {/* shadow */}
        <div style={{ width:60, height:10, background:"rgba(0,0,0,.12)", borderRadius:"50%", margin:"0 auto", animation:"pulsePaw 2s ease-in-out infinite", filter:"blur(3px)" }}/>
      </div>

      {/* Paw print trail */}
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        {[0,1,2,3,4].map(i => (
          <span key={i} style={{ fontSize:"1.4rem", opacity: i <= (petIdx % 5) ? 1 : .2, transition:"opacity .3s", transform:`rotate(${i%2===0?0:15}deg)` }}>🐾</span>
        ))}
      </div>

      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"1.1rem", fontWeight:800, color:"#FF6B35", marginBottom:".3rem" }}>
          PawPartner
        </div>
        <div style={{ fontSize:".9rem", color:"#7A7A8C", fontWeight:600 }}>
          {message}{"·".repeat(dots)}
        </div>
      </div>

      <style>{`
        @keyframes bounceIn { 0%{transform:scale(.4);opacity:0} 60%{transform:scale(1.1)} 80%{transform:scale(.96)} 100%{transform:scale(1);opacity:1} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulsePaw { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(.7)} }
      `}</style>
    </div>
  )
}
