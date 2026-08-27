import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import InvitationPage from './pages/InvitationPage'
import Dashboard from './pages/Dashboard'
import ThankYou from './pages/ThankYou'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/i/:slug" element={<InvitationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/merci" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  )
}
