<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Playfair+Display&size=42&duration=3000&pause=1000&color=FF6B35&center=true&vCenter=true&width=600&lines=🐾+PawPartner;Your+Pet+Care+Companion!;Adopt+%7C+Manage+%7C+Shop" alt="PawPartner" />

<br/>

```
               🐶 ─────── 🐱 ─────── 🐰 ─────── 🦜 ─────── 🐠 ─────── 🐾
```

### *Where every pet finds their forever family* ❤️

<br/>

[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

<br/>

> 👨‍💻 **Developed by Kalagi Pandya** · 

<br/>

[🚀 Quick Start](#-quick-start) · [✨ Features](#-features) · [⚡ Demo Login](#-demo-login--guaranteed-to-work) · [🔌 API](#-api-reference) · [🛠 Tech Stack](#-tech-stack)

</div>

---

## 🌟 What is PawPartner?

**PawPartner** is a full-stack pet care platform connecting loving pet owners with adoption centers and premium pet shops — all in one warm, animated, modern app.

```
                    🏠 Adoption Centers ──► find pets to adopt
                   /
Pet Owner ────────
                   \
                    🛒 Pet Shops ──────► buy food, toys & more
                   /
                  🐾 My Pets ─────────► manage your companions
```

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication
- JWT access + refresh tokens
- Multi-role login (Owner / Center / Shop)
- OTP email verification (shown in-app if no SendGrid)
- Password reset flow
- Google OAuth 2.0 (optional)
- ⚡ **Guaranteed demo accounts**

</td>
<td width="50%">

### 🐾 Pet Management
- Add, edit, delete pet profiles
- Upload pet photos
- Track breed, age, gender & notes
- Beautiful animated cards
- Full CRUD operations

</td>
</tr>
<tr>
<td>

### ❤️ Adoption Centers
- Browse centers with search
- View pets per center
- **Working "Adopt" button** with request form
- Success confirmation screen
- Dedicated center dashboard

</td>
<td>

### 🛒 Pet Shops
- Discover shops near you
- Categorised products 🍖🎾🎀💊
- Shop dashboard for products
- Full CRUD for shop items

</td>
</tr>
</table>

---

## 🎬 Cute Animations

- 🐾 **Loading screen** — bouncing pets with a paw-print trail
- 🌟 **Floating pet emoji** orbit in the hero, surrounded by hearts, bones & stars
- 📊 **Floating stat cards** that drift gently on the home page
- 🎯 **Wiggling paw logo** in the sticky header
- 💕 **Pop-up adoption modal** with a confetti-style success screen

---

## 🚀 Quick Start

### Step 1 — Clone & Install

```bash
git clone https://github.com/your-username/PawPartner.git
cd PawPartner
npm run install:all
```

### Step 2 — Start MongoDB

```bash
# Option A: Local MongoDB
mongod

# Option B: MongoDB Atlas — paste your connection string in Server/.env
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
```

### Step 3 — Launch 🚀

```bash
npm start
```

> ✅ Browser opens automatically at **http://localhost:5173**
> 🌱 Demo accounts are seeded into MongoDB automatically — every time the server starts!

---

## ⚡ Demo Login — Guaranteed to Work!

PawPartner **auto-creates 3 demo accounts directly in the database** the instant the server starts — no registration, no OTP, no flaky timing. Just click and go:

| Button | Role | Email | Password |
|--------|------|-------|----------|
| 🐾 Pet Owner Demo | Pet Owner | `demo_owner@paw.com` | `Demo@1234` |
| ❤️ Adoption Center Demo | Adoption Center | `demo_center@paw.com` | `Demo@1234` |
| 🏪 Pet Shop Demo | Pet Shop | `demo_shop@paw.com` | `Demo@1234` |

> 💡 These accounts are **re-validated on every server restart**, so the password always works — even if you've reset your database or switched machines.

---

## 🔑 Environment Variables

The `.env` is **pre-configured**. Only MongoDB needs to be running:

```env
# ✅ Already configured — just run mongod and start!
PORT=8000
MONGODB_URI=mongodb://localhost:27017
ACCESS_TOKEN_SECRET=pawpartner_access_secret_2024_kalagi
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_SECRET=pawpartner_refresh_secret_2024_kalagi
REFRESH_TOKEN_EXPIRY=30d
SESSION_SECRET=pawpartner_session_secret_2024

# 📸 Optional — for real image uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# 🔑 Optional — for Google Sign-In
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# 📧 Optional — for email OTP delivery
SENDGRID_API_KEY=
VERIFIED_SENDER_EMAIL=
```

> Without optional services: OTP shows in a yellow banner in the app, images use placeholders, Google button is hidden.

---

## 📁 Project Structure

```
PawPartner/
│
├── 📄 start.js                  ← One command: server + client + auto-open browser
├── 📄 package.json
│
├── 🖥️  Client/                  ← React + Vite Frontend
│   └── src/
│       ├── App.jsx              ← Router + Protected routes + Loading splash
│       ├── Home.jsx             ← Animated landing page
│       ├── SignIn.jsx           ← Multi-role login + guaranteed demo buttons
│       ├── SignUp.jsx           ← Registration with OTP
│       ├── ForgotPassword.jsx   ← 4-step password reset
│       ├── PetProfile.jsx       ← Full pet CRUD
│       ├── AdoptionCenter.jsx   ← Browse centers
│       ├── AdoptionCenterPets.jsx  ← Working Adopt button + modal
│       ├── PetShop.jsx          ← Browse shops
│       ├── AdoptionCenterDashboard.jsx
│       ├── PetShopDashboard.jsx
│       └── components/
│           ├── Header.jsx       ← Sticky nav, role-aware menu
│           ├── Footer.jsx
│           ├── LoadingScreen.jsx ← Cute bouncing pet loader
│           └── AdditionalInfo.jsx
│
└── ⚙️  Server/                  ← Express.js REST API
    ├── .env                     ← Pre-filled, ready to use!
    └── src/
        ├── controllers/         ← 6 controllers, fully tested module loading
        ├── models/              ← 6 Mongoose schemas + temp schemas
        ├── routes/              ← 6 route files
        ├── middlewares/         ← verifyJWT + checkRole + multer
        └── utils/
            ├── seedDemo.js      ← 🌱 Auto-creates demo accounts on boot
            ├── mailer.js
            ├── cloudinary.js
            └── passport.js
```

---

## 🔌 API Reference

### 👤 Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/register` | — | Register (returns OTP if no email configured) |
| POST | `/verify-otp` | — | Verify OTP → creates account |
| POST | `/login` | — | Login → returns `accessToken` |
| POST | `/forgot-password` | — | Send reset OTP |
| GET | `/current-user` | ✅ | Get my profile |
| PATCH | `/update-user` | ✅ | Update profile |

> Same pattern for `/api/v1/adoption-centers` and `/api/v1/pet-shops`

### 🐾 My Pets — `/api/v1/owned-pets`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| GET | `/` | ✅ | Get all my pets |
| POST | `/add` | ✅ | Add a pet (with image) |
| PATCH | `/update/:id` | ✅ | Update pet |
| DELETE | `/delete/:id` | ✅ | Delete pet |

### ❤️ Adoption Center Pets — `/api/v1/adoption-center-pets`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| GET | `/:centerId` | — | Get pets at a center (public) |
| POST | `/add` | ✅ Center | Add a pet to your center |

### 📦 Items — `/api/v1/items`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| GET | `/` | — | Get all items (public) |
| POST | `/add` | ✅ Shop | Add a product |

---

## 🛠 Tech Stack

| Frontend | Backend |
|---|---|
| React 18 + Vite 5 | Node.js + Express.js |
| React Router DOM v6 | MongoDB + Mongoose |
| Axios | JWT (access + refresh) |
| React Toastify | bcryptjs (pure JS, no native build) |
| Lucide React icons | Multer + Cloudinary |
| Custom CSS design system | SendGrid + Passport.js |

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| 🔴 Demo login failed | **Restart the server** (`npm start`) — demo accounts auto-seed on every boot |
| 🔴 `ECONNREFUSED 27017` | Start MongoDB: run `mongod` in a terminal |
| 🔴 White page after login | Clear browser storage: `localStorage.clear()` then refresh |
| 🔴 Registration failed | Check MongoDB is running. OTP shows in the yellow in-app banner |
| 🔴 CORS error | Backend = port 8000, Frontend = port 5173. Don't change these |
| 🔴 Images not uploading | Add Cloudinary credentials to `Server/.env` |

---

## 🚀 Push to GitHub

```bash
cd PawPartner
git init
git add .
git commit -m "🐾 feat: initial commit — PawPartner pet care platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/PawPartner.git
git push -u origin main
```

---

## 📄 License

Distributed under the **ISC License**.

---

<div align="center">

```
🐾 ────────────────────────────────────────── 🐾
       Made with ❤️ by Kalagi Pandya
   
    "Every pet deserves a loving home"
🐾 ────────────────────────────────────────── 🐾
```

**⭐ Star this repo if it helped you!**

</div>
