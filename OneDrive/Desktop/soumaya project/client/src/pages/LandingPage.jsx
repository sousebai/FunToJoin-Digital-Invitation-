import Navbar      from '../components/layout/Navbar'
import Footer      from '../components/layout/Footer'
import Hero        from '../components/landing/Hero'
import HowItWorks  from '../components/landing/HowItWorks'
import Features    from '../components/landing/Features'
import Gallery     from '../components/landing/Gallery'
import Pricing     from '../components/landing/Pricing'
import Testimonials from '../components/landing/Testimonials'
import OrderForm   from '../components/landing/OrderForm'
import FAQ         from '../components/landing/FAQ'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Gallery />
        <Pricing />
        <Testimonials />
        <OrderForm />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
