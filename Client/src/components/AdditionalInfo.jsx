import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdditionalInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ username: '', email: '', contact: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Grab token from URL query param (Google OAuth redirect)
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');
        if (tokenFromUrl) {
            localStorage.setItem('token', tokenFromUrl);
            localStorage.setItem('role', 'user');
        }

        const token = tokenFromUrl || localStorage.getItem('token');
        if (!token) { navigate('/signin'); return; }

        axios.get('http://localhost:8000/api/v1/users/current-user', { withCredentials: true })
            .then(res => {
                if (res.data?.data) {
                    const u = res.data.data;
                    setFormData({ username: u.username || '', email: u.email || '', contact: u.contact || '', address: u.address || '' });
                }
            })
            .catch(() => navigate('/signin'));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!formData.username.trim()) e.username = 'Username is required';
        if (!formData.contact.trim()) e.contact = 'Contact is required';
        else if (!/^\d{10}$/.test(formData.contact.replace(/\D/g, ''))) e.contact = 'Enter valid 10-digit number';
        if (!formData.address.trim()) e.address = 'Address is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await axios.patch('http://localhost:8000/api/v1/users/update-user', formData, { withCredentials: true });
            toast.success('Profile complete! 🎉');
            setTimeout(() => navigate('/home'), 800);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally { setLoading(false); }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
                .ai-page { min-height: 100vh; background: #FFF8F3; display: flex; align-items: center; justify-content: center; padding: 2rem; font-family: 'Nunito', sans-serif; }
                .ai-box { background: white; border-radius: 28px; width: 100%; max-width: 480px; padding: 2.5rem; box-shadow: 0 8px 40px rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.1); }
                .ai-emoji { font-size: 3rem; text-align: center; display: block; margin-bottom: 1rem; animation: float 2.5s ease-in-out infinite; }
                .ai-title { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 800; color: #1A1A2E; text-align: center; margin-bottom: 0.4rem; }
                .ai-sub { color: #7A7A8C; text-align: center; font-size: 0.92rem; margin-bottom: 2rem; }
                .ai-field { margin-bottom: 1.1rem; }
                .ai-label { font-size: 0.82rem; font-weight: 800; color: #4A4A5A; margin-bottom: 5px; display: block; }
                .ai-wrap { position: relative; }
                .ai-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #C8C0B8; display: flex; }
                .ai-icon svg { width: 17px; height: 17px; }
                .ai-input { width: 100%; padding: 12px 13px 12px 42px; border: 2px solid #F0E6DC; border-radius: 13px; font-size: 0.93rem; font-family: 'Nunito', sans-serif; background: white; color: #2D2D2D; outline: none; transition: all 0.22s; }
                .ai-input:focus { border-color: #FF6B35; box-shadow: 0 0 0 3px rgba(255,107,53,0.1); }
                .ai-input.error { border-color: #FF4444; }
                .ai-input[disabled] { background: #FAF6F2; color: #9A9A9A; }
                .ai-error { font-size: 0.76rem; color: #FF4444; margin-top: 4px; font-weight: 700; }
                .ai-submit { width: 100%; padding: 13px; border: none; border-radius: 13px; background: linear-gradient(135deg,#FF6B35,#FF8C5A); color: white; font-size: 0.98rem; font-weight: 800; cursor: pointer; transition: all 0.3s; box-shadow: 0 5px 18px rgba(255,107,53,0.3); display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Nunito', sans-serif; margin-top: 0.5rem; }
                .ai-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 9px 24px rgba(255,107,53,0.4); }
                .ai-submit:disabled { opacity: 0.68; cursor: not-allowed; }
                .spinner { width: 17px; height: 17px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
            <ToastContainer position="top-right" theme="colored" />
            <div className="ai-page">
                <div className="ai-box">
                    <span className="ai-emoji">🐾</span>
                    <h1 className="ai-title">Complete Your Profile</h1>
                    <p className="ai-sub">Just a few more details to get you started!</p>
                    <form onSubmit={handleSubmit}>
                        <div className="ai-field">
                            <label className="ai-label">Username *</label>
                            <div className="ai-wrap">
                                <span className="ai-icon"><User size={17} /></span>
                                <input className={`ai-input${errors.username ? ' error' : ''}`} type="text" name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} />
                            </div>
                            {errors.username && <div className="ai-error">⚠ {errors.username}</div>}
                        </div>
                        <div className="ai-field">
                            <label className="ai-label">Email</label>
                            <div className="ai-wrap">
                                <span className="ai-icon"><User size={17} /></span>
                                <input className="ai-input" type="email" name="email" value={formData.email} disabled />
                            </div>
                        </div>
                        <div className="ai-field">
                            <label className="ai-label">Contact Number *</label>
                            <div className="ai-wrap">
                                <span className="ai-icon"><Phone size={17} /></span>
                                <input className={`ai-input${errors.contact ? ' error' : ''}`} type="tel" name="contact" placeholder="10-digit mobile number" value={formData.contact} onChange={handleChange} />
                            </div>
                            {errors.contact && <div className="ai-error">⚠ {errors.contact}</div>}
                        </div>
                        <div className="ai-field">
                            <label className="ai-label">Address *</label>
                            <div className="ai-wrap">
                                <span className="ai-icon"><MapPin size={17} /></span>
                                <input className={`ai-input${errors.address ? ' error' : ''}`} type="text" name="address" placeholder="Your full address" value={formData.address} onChange={handleChange} />
                            </div>
                            {errors.address && <div className="ai-error">⚠ {errors.address}</div>}
                        </div>
                        <button type="submit" className="ai-submit" disabled={loading}>
                            {loading ? <span className="spinner" /> : <ArrowRight size={16} />}
                            {loading ? 'Saving...' : 'Complete Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AdditionalInfo;
