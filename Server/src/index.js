import "dotenv/config"
import connectDB from "./db/index.js"
import { app } from "./app.js"
import { seedDemoAccounts } from "./utils/seedDemo.js"

connectDB()
  .then(async () => {
    await seedDemoAccounts()
    app.listen(process.env.PORT || 8000, () => {
      console.log(`\n🐾 PawPartner Server running on port ${process.env.PORT || 8000}`)
      console.log(`   API: http://localhost:${process.env.PORT || 8000}/api/v1`)
    })
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message)
    process.exit(1)
  })
