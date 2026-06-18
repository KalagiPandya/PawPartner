/**
 * One-time helper: wipe demo accounts from MongoDB so seedDemo can re-create them cleanly.
 * Run from the Server/ folder:
 *   node --experimental-vm-modules src/utils/clearDemoAccounts.js
 *
 * You only need this if demo login still fails after restarting with the fixed seed.
 */
import "dotenv/config"
import mongoose       from "mongoose"
import { User }           from "./models/user.model.js"
import { AdoptionCenter } from "./models/adoption-center.model.js"
import { Shop }           from "./models/pet-shop.model.js"
import { DB_NAME }    from "./constants.js"

await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
console.log("Connected to", mongoose.connection.name)

const u = await User.deleteOne({ email: "demo_owner@paw.com" })
const c = await AdoptionCenter.deleteOne({ email: "demo_center@paw.com" })
const s = await Shop.deleteOne({ email: "demo_shop@paw.com" })

console.log(`Deleted: ${u.deletedCount} owner, ${c.deletedCount} center, ${s.deletedCount} shop`)
await mongoose.disconnect()
console.log("Done. Restart the server — demo accounts will be recreated automatically.")
