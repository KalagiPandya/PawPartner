import { Link } from "react-router-dom"
import { PawPrint, Heart, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => (
  <>
    <style>{`
      .pp-footer {
        background: linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%);
        color: white; padding: 4rem 2rem 2rem;
        position: relative; overflow: hidden;
      }
      .pp-footer::before {
        content: '🐾';
        position: absolute; top: 20px; right: 60px;
        font-size: 6rem; opacity: 0.05;
        transform: rotate(15deg);
      }
      .pp-footer-grid {
        max-width: 1280px; margin: 0 auto;
        display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 3rem;
      }
      .pp-footer-brand { display: flex; flex-direction: column; gap: 1rem; }
      .pp-footer-logo {
        display: flex; align-items: center; gap: 10px;
        font-family: 'Playfair Display', serif;
        font-size: 1.6rem; font-weight: 800; color: white;
        text-decoration: none;
      }
      .pp-footer-logo-icon {
        background: linear-gradient(135deg, #FF6B35, #FF8C5A);
        border-radius: 12px; padding: 8px;
        display: flex;
      }
      .pp-footer-logo-icon svg { color: white; width: 20px; height: 20px; }
      .pp-footer-desc { color: rgba(255,255,255,0.6); font-size: 0.9rem; line-height: 1.8; }
      .pp-footer-socials { display: flex; gap: 12px; margin-top: 0.5rem; }
      .pp-footer-social {
        width: 38px; height: 38px;
        background: rgba(255,255,255,0.1); border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: white; transition: all 0.3s ease; cursor: pointer;
      }
      .pp-footer-social:hover { background: #FF6B35; transform: translateY(-3px); }
      .pp-footer-social svg { width: 18px; height: 18px; }
      .pp-footer-col h4 {
        font-size: 1rem; font-weight: 800; color: #FF6B35;
        margin-bottom: 1.2rem; letter-spacing: 0.5px;
      }
      .pp-footer-links { display: flex; flex-direction: column; gap: 0.7rem; }
      .pp-footer-link {
        color: rgba(255,255,255,0.6); text-decoration: none;
        font-size: 0.88rem; transition: all 0.2s ease;
        display: flex; align-items: center; gap: 6px;
      }
      .pp-footer-link:hover { color: white; padding-left: 4px; }
      .pp-footer-bottom {
        max-width: 1280px; margin: 3rem auto 0;
        padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1);
        display: flex; justify-content: space-between; align-items: center;
        flex-wrap: wrap; gap: 1rem;
      }
      .pp-footer-bottom p { color: rgba(255,255,255,0.4); font-size: 0.85rem; }
      .pp-footer-bottom span { color: #FF6B35; }
      @media (max-width: 768px) {
        .pp-footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        .pp-footer-brand { grid-column: 1 / -1; }
      }
      @media (max-width: 480px) {
        .pp-footer-grid { grid-template-columns: 1fr; }
      }
    `}</style>
    <footer className="pp-footer">
      <div className="pp-footer-grid">
        <div className="pp-footer-brand">
          <Link to="/home" className="pp-footer-logo">
            <span className="pp-footer-logo-icon"><PawPrint /></span>
            PawPartner
          </Link>
          <p className="pp-footer-desc">
            Where every pet finds their forever family. Connecting loving homes with adorable companions since 2024.
          </p>
          <div className="pp-footer-socials">
            <div className="pp-footer-social"><Instagram /></div>
            <div className="pp-footer-social"><Twitter /></div>
            <div className="pp-footer-social"><Facebook /></div>
            <div className="pp-footer-social"><Mail /></div>
          </div>
        </div>
        <div className="pp-footer-col">
          <h4>Explore</h4>
          <div className="pp-footer-links">
            <Link to="/home" className="pp-footer-link">🏠 Home</Link>
            <Link to="/pet-profile" className="pp-footer-link">🐾 My Pets</Link>
            <Link to="/adoption-centers" className="pp-footer-link">❤️ Adoption</Link>
            <Link to="/pet-shops" className="pp-footer-link">🛒 Pet Shops</Link>
          </div>
        </div>
        <div className="pp-footer-col">
          <h4>Services</h4>
          <div className="pp-footer-links">
            <a href="#" className="pp-footer-link">🐶 Pet Profiles</a>
            <a href="#" className="pp-footer-link">🏥 Vet Finder</a>
            <a href="#" className="pp-footer-link">💊 Pet Care Tips</a>
            <a href="#" className="pp-footer-link">📦 Products</a>
          </div>
        </div>
        <div className="pp-footer-col">
          <h4>Company</h4>
          <div className="pp-footer-links">
            <a href="#" className="pp-footer-link">About Us</a>
            <a href="#" className="pp-footer-link">Our Mission</a>
            <a href="#" className="pp-footer-link">Privacy Policy</a>
            <a href="#" className="pp-footer-link">Contact</a>
          </div>
        </div>
      </div>
      <div className="pp-footer-bottom">
        <p>© {new Date().getFullYear()} PawPartner · Made with <span>❤️</span> for pets everywhere</p>
        <p>Built by <span>Jeel Pansuriya</span></p>
      </div>
    </footer>
  </>
)

export default Footer
