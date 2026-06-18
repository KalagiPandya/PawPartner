/**
 * Seeds 3 demo accounts on every server startup.
 *
 * Strategy: delete-then-insert (not upsert).
 * This guarantees no stale data, no unique-index conflicts, no validation errors.
 * Demo accounts are ephemeral by design — they are recreated fresh every startup.
 */
import bcrypt             from "bcryptjs"
import { User }           from "../models/user.model.js"
import { AdoptionCenter } from "../models/adoption-center.model.js"
import { Shop }           from "../models/pet-shop.model.js"

const DEMO_PASSWORD = "Demo@1234"

export const seedDemoAccounts = async () => {
  try {
    // Pre-hash once — insertOne skips the pre-save hook, so we hash manually
    const hash = await bcrypt.hash(DEMO_PASSWORD, 10)

    // ── Pet Owner ──────────────────────────────────────────────────────────
    await User.deleteOne({ email: "demo_owner@paw.com" })
    // Also clear any leftover username collision from a broken past seed
    await User.deleteOne({ username: "demo_owner" })
    await User.collection.insertOne({
      email:     "demo_owner@paw.com",
      username:  "demo_owner",
      password:  hash,
      contact:   "9876543210",
      address:   "Junagadh, Gujarat",
      role:      "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log("✅ Demo Pet Owner seeded")

    // ── Adoption Center ────────────────────────────────────────────────────
    await AdoptionCenter.deleteOne({ email: "demo_center@paw.com" })
    await AdoptionCenter.deleteOne({ adoptionCenterName: "demo happy paws center" })
    await AdoptionCenter.collection.insertOne({
      email:                    "demo_center@paw.com",
      password:                 hash,
      adoptionCenterName:       "Demo Happy Paws Center",
      address:                  "Junagadh, Gujarat",
      contact:                  "9876543211",
      adoptionCenterDescription:"A wonderful demo adoption center for all pets.",
      role:                     "adoptionCenter",
      imageUrl:                 "https://res.cloudinary.com/dd2y1lxsf/image/upload/v1737739026/shop_default_axzvoi.jpg",
      createdAt:                new Date(),
      updatedAt:                new Date(),
    })
    console.log("✅ Demo Adoption Center seeded")

    // ── Pet Shop ───────────────────────────────────────────────────────────
    await Shop.deleteOne({ email: "demo_shop@paw.com" })
    await Shop.deleteOne({ shopName: "demo pawsome store" })
    await Shop.collection.insertOne({
      email:     "demo_shop@paw.com",
      username:  "demo_shop",
      password:  hash,
      shopName:  "demo pawsome store",
      address:   "Junagadh, Gujarat",
      contact:   "9876543212",
      role:      "petShop",
      imageUrl:  "",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log("✅ Demo Pet Shop seeded")

    console.log("🐾 All 3 demo accounts ready  —  password: Demo@1234")
  } catch (err) {
    // Log the FULL error so it's visible in npm start output
    console.error("❌ Demo seed FAILED:", err.message)
    console.error(err.stack)
  }
}
