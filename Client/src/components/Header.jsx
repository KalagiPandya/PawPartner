import { useState, useRef, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { PawPrint, Heart, ShoppingBag, LogOut, Menu, X, User, Home } from "lucide-react"

export default function Header() {
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const navigate   = useNavigate()
  const location   = useLocation()
  const profileRef = useRef(null)
  const isLoggedIn = !!localStorage.getItem("token")
  const role       = localStorage.getItem("role")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    const onClick  = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false) }
    window.addEventListener("scroll", onScroll)
    document.addEventListener("mousedown", onClick)
    return () => { window.removeEventListener("scroll", onScroll); document.removeEventListener("mousedown", onClick) }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("role")
    navigate("/signin"); setProfileOpen(false); setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const links = [
    { to:"/home",             label:"Home",       icon:<Home size={16}/>  },
    { to:"/pet-profile",      label:"My Pets",    icon:<PawPrint size={16}/> },
    { to:"/adoption-centers", label:"Adopt",      icon:<Heart size={16}/> },
    { to:"/pet-shops",        label:"Pet Shops",  icon:<ShoppingBag size={16}/> },
  ]

  return (
    <>
      <style>{`
        .hdr { position:fixed; top:0; left:0; right:0; z-index:1000; font-family:'Nunito',sans-serif; transition:all .3s ease; }
        .hdr-inner { background:rgba(255,248,243,.97); backdrop-filter:blur(20px); border-bottom:2px solid rgba(255,107,53,.1); box-shadow:${scrolled?"0 4px 30px rgba(255,107,53,.12)":"0 2px 20px rgba(0,0,0,.04)"}; }
        .hdr-nav { max-width:1280px; margin:0 auto; padding:0 2rem; display:flex; justify-content:space-between; align-items:center; height:72px; }
        .hdr-logo { display:flex; align-items:center; gap:10px; font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:800; color:#FF6B35; text-decoration:none; transition:transform .3s; }
        .hdr-logo:hover { transform:scale(1.03); }
        .hdr-logo-icon { background:linear-gradient(135deg,#FF6B35,#FF8C5A); border-radius:12px; padding:8px; display:flex; animation:wiggle 4s ease-in-out infinite; }
        .hdr-logo-icon svg { color:white; width:20px; height:20px; }
        .hdr-links { display:flex; align-items:center; gap:.3rem; }
        .hdr-link { display:flex; align-items:center; gap:6px; color:#2D2D2D; text-decoration:none; font-weight:700; font-size:.92rem; padding:.5rem 1rem; border-radius:50px; transition:all .25s; }
        .hdr-link:hover, .hdr-link.active { color:#FF6B35; background:rgba(255,107,53,.1); }
        .hdr-link svg { width:16px; height:16px; }
        .hdr-profile { position:relative; }
        .hdr-profile-btn { width:40px; height:40px; background:linear-gradient(135deg,#FF6B35,#FF8C5A); border:none; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .3s; box-shadow:0 4px 12px rgba(255,107,53,.3); }
        .hdr-profile-btn:hover { transform:scale(1.1); }
        .hdr-profile-btn svg { color:white; width:18px; height:18px; }
        .hdr-dropdown { position:absolute; top:calc(100% + 10px); right:0; background:white; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,.12); min-width:180px; padding:6px; border:1px solid rgba(255,107,53,.1); transition:all .25s; transform-origin:top right; }
        .hdr-dropdown.open { opacity:1; transform:scale(1); pointer-events:all; }
        .hdr-dropdown.closed { opacity:0; transform:scale(.95); pointer-events:none; }
        .hdr-drop-item { display:flex; align-items:center; gap:10px; width:100%; padding:10px 12px; border:none; background:none; color:#2D2D2D; font-size:.88rem; font-weight:700; cursor:pointer; border-radius:10px; transition:all .2s; font-family:'Nunito',sans-serif; text-decoration:none; }
        .hdr-drop-item:hover { background:rgba(255,107,53,.08); color:#FF6B35; }
        .hdr-drop-item svg { width:15px; height:15px; color:#FF6B35; }
        .hdr-signin { background:linear-gradient(135deg,#FF6B35,#FF8C5A); color:white; border:none; border-radius:50px; padding:10px 20px; font-weight:800; font-size:.88rem; cursor:pointer; transition:all .3s; box-shadow:0 4px 12px rgba(255,107,53,.25); font-family:'Nunito',sans-serif; text-decoration:none; display:flex; align-items:center; gap:6px; }
        .hdr-signin:hover { transform:translateY(-2px); box-shadow:0 6px 18px rgba(255,107,53,.35); }
        .hdr-hamburger { display:none; background:none; border:none; color:#FF6B35; cursor:pointer; padding:6px; border-radius:10px; }
        .hdr-hamburger:hover { background:rgba(255,107,53,.1); }
        @media(max-width:768px) {
          .hdr-hamburger { display:flex; }
          .hdr-links { display:${menuOpen?"flex":"none"}; position:fixed; top:72px; left:0; right:0; background:white; flex-direction:column; padding:1.5rem; gap:.5rem; box-shadow:0 8px 24px rgba(0,0,0,.1); border-bottom:3px solid rgba(255,107,53,.15); }
          .hdr-link { width:100%; border-radius:12px; }
        }
      `}</style>
      <header className="hdr">
        <div className="hdr-inner">
          <nav className="hdr-nav">
            <Link to="/home" className="hdr-logo">
              <span className="hdr-logo-icon"><PawPrint/></span>
              PawPartner
            </Link>

            <div className="hdr-links">
              {links.map(l => (
                <Link key={l.to} to={l.to} className={`hdr-link${isActive(l.to)?" active":""}`}>{l.icon}{l.label}</Link>
              ))}

              {isLoggedIn ? (
                <div className="hdr-profile" ref={profileRef}>
                  <button className="hdr-profile-btn" onClick={() => setProfileOpen(o => !o)}><User/></button>
                  <div className={`hdr-dropdown ${profileOpen?"open":"closed"}`}>
                    {role === "adoptionCenter" && (
                      <Link to="/adoption-center/dashboard" className="hdr-drop-item" onClick={() => setProfileOpen(false)}>🏠 Dashboard</Link>
                    )}
                    {role === "petShop" && (
                      <Link to="/pet-shop/dashboard" className="hdr-drop-item" onClick={() => setProfileOpen(false)}>🏪 Dashboard</Link>
                    )}
                    <button className="hdr-drop-item" onClick={handleLogout}><LogOut/> Sign Out</button>
                  </div>
                </div>
              ) : (
                <Link to="/signin" className="hdr-signin"><LogOut size={15}/>Sign In</Link>
              )}
            </div>

            <button className="hdr-hamburger" onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </nav>
        </div>
      </header>
    </>
  )
}
