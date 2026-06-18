import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import LoadingScreen           from "./components/LoadingScreen"
import Header                  from "./components/Header"
import Footer                  from "./components/Footer"
import Home                    from "./Home"
import SignIn                  from "./SignIn"
import SignUp                  from "./SignUp"
import ForgotPassword          from "./ForgotPassword"
import AdditionalInfo          from "./components/AdditionalInfo"
import PetProfile              from "./PetProfile"
import AdoptionCenter          from "./AdoptionCenter"
import AdoptionCenterPets      from "./AdoptionCenterPets"
import PetShop                 from "./PetShop"
import AdoptionCenterDashboard from "./AdoptionCenterDashboard"
import PetShopDashboard        from "./PetShopDashboard"

// Routes that hide header/footer
const NO_NAV = ["/","/signin","/signup","/forgot-password","/additional-info",
                "/adoption-center/dashboard","/pet-shop/dashboard"]

// Guard: redirect to signin if not logged in
function Protected({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/signin" replace />
}

function AppContent() {
  const location = useLocation()
  const showNav  = !NO_NAV.includes(location.pathname)

  return (
    <>
      {showNav && <Header />}
      <Routes>
        <Route path="/"                               element={<Navigate to="/signin" replace />} />
        <Route path="/signin"                         element={<SignIn />} />
        <Route path="/signup"                         element={<SignUp />} />
        <Route path="/forgot-password"                element={<ForgotPassword />} />
        <Route path="/additional-info"                element={<AdditionalInfo />} />
        <Route path="/home"                           element={<Protected><Home /></Protected>} />
        <Route path="/pet-profile"                    element={<Protected><PetProfile /></Protected>} />
        <Route path="/adoption-centers"               element={<Protected><AdoptionCenter /></Protected>} />
        <Route path="/adoption-center-pets/:centerId" element={<Protected><AdoptionCenterPets /></Protected>} />
        <Route path="/pet-shops"                      element={<Protected><PetShop /></Protected>} />
        <Route path="/adoption-center/dashboard"      element={<Protected><AdoptionCenterDashboard /></Protected>} />
        <Route path="/pet-shop/dashboard"             element={<Protected><PetShopDashboard /></Protected>} />
        <Route path="*"                               element={<Navigate to="/signin" replace />} />
      </Routes>
      {showNav && <Footer />}
    </>
  )
}

export default function App() {
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    // Show cute loading screen for 1.8s on first load
    const t = setTimeout(() => setBooting(false), 1800)
    return () => clearTimeout(t)
  }, [])

  if (booting) return <LoadingScreen message="Getting things ready" />

  return (
    <Router>
      <AppContent />
    </Router>
  )
}
