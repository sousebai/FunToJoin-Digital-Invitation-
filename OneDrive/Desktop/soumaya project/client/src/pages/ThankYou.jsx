import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, CheckCircle } from 'lucide-react'

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="absolute top-16 left-[10%] w-64 h-64 rounded-full bg-blush/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-[10%] w-80 h-80 rounded-full bg-line/30 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        className="relative text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, delay: 0.2 }}
        >
          <CheckCircle size={60} className="text-gold mx-auto mb-6" />
        </motion.div>

        <span className="font-script text-5xl text-rose block mb-3">Merci !</span>
        <h1 className="font-display text-4xl font-light text-ink mb-5">
          Your Order Is Received
        </h1>
        <p className="font-body text-sm text-muted leading-relaxed mb-8">
          We've received your invitation request and our team will reach out within 24 hours.
          Get ready — your love story is about to be beautifully shared.
        </p>

        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-px bg-line" />
          <Heart size={14} className="text-rose fill-rose" />
          <div className="w-12 h-px bg-line" />
        </div>

        <Link to="/" className="btn-outline">
          ← Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
