import passport from "passport"
import { User } from "../models/user.model.js"

// Only setup Google strategy when credentials exist
const setupGoogleStrategy = async () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log("[Passport] Google OAuth not configured — skipping")
    return
  }
  try {
    const { Strategy: GoogleStrategy } = await import("passport-google-oauth20")
    passport.use(new GoogleStrategy(
      {
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:  process.env.GOOGLE_CALLBACK_URL || "http://localhost:8000/api/v1/users/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id })
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              username: profile.displayName.replace(/\s+/g,"_").toLowerCase() + "_" + Date.now(),
              email:    profile.emails[0].value,
              contact:  "0000000000",
              address:  "Update your address",
            })
          }
          const token = user.generateAccessToken()
          return done(null, { user, accessToken: token })
        } catch (err) {
          return done(err, false)
        }
      }
    ))
    passport.serializeUser((data, done) => done(null, data.user.id))
    passport.deserializeUser(async (id, done) => {
      try { done(null, await User.findById(id)) } catch (e) { done(e, false) }
    })
    console.log("[Passport] Google OAuth strategy registered")
  } catch (err) {
    console.warn("[Passport] Could not load Google strategy:", err.message)
  }
}

await setupGoogleStrategy()
export default passport
