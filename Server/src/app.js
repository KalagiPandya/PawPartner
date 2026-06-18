import "dotenv/config"
import express  from "express"
import cors     from "cors"
import cookieParser from "cookie-parser"
import session  from "express-session"
import passport from "passport"
import "./utils/passport.js"

const app = express()

app.use(cors({
  origin:      "http://localhost:5173",
  credentials: true,
  methods:     ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","X-Requested-With"]
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

app.use(session({
  secret:            process.env.SESSION_SECRET || "pawpartner_secret",
  resave:            false,
  saveUninitialized: false,
  cookie:            { secure: false, httpOnly: true, sameSite: "lax", maxAge: 86400000 }
}))

app.use(passport.initialize())
app.use(passport.session())

// Routes
import userRouter           from "./routes/user.routes.js"
import ownedPetRouter       from "./routes/owned-pet.routes.js"
import adoptionCenterRouter from "./routes/adoption-center.routes.js"
import centerPetRouter      from "./routes/center-pet.routes.js"
import petShopRouter        from "./routes/pet-shop.routes.js"
import itemRouter           from "./routes/item.routes.js"

app.use("/api/v1/users",                userRouter)
app.use("/api/v1/owned-pets",           ownedPetRouter)
app.use("/api/v1/adoption-centers",     adoptionCenterRouter)
app.use("/api/v1/adoption-center-pets", centerPetRouter)
app.use("/api/v1/pet-shops",            petShopRouter)
app.use("/api/v1/items",                itemRouter)

// Health check
app.get("/api/v1/health", (_, res) => res.json({ status: "ok", message: "PawPartner API 🐾 is running!" }))

// Global error handler
app.use((err, req, res, next) => {
  const code    = err.statusCode || 500
  const message = err.message    || "Internal Server Error"
  console.error(`[ERROR] ${code} — ${message}`)
  res.status(code).json({ statusCode: code, success: false, message, data: null })
})

export { app }
