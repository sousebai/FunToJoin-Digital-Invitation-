import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Music, Globe, MessageCircle, Camera, Clock, Users } from 'lucide-react'

const features = [
  {
    icon: Clock,
    title: 'Live Countdown',
    description: 'A real-time countdown to your wedding day, displayed beautifully on every guest\'s screen.',
    color: 'bg-blush',
    iconColor: 'text-burgundy',
  },
  {
    icon: Users,
    title: 'RSVP Dashboard',
    description: 'Track every response in your private dashboard. Export your guest list to Excel anytime.',
    color: 'bg-cream',
    iconColor: 'text-gold',
  },
  {
    icon: Globe,
    title: 'Multilingual',
    description: 'Your invitation delivered in French, Arabic, and English — for every guest, in their language.',
    color: 'bg-blush',
    iconColor: 'text-burgundy',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Sharing',
    description: 'Share your unique link in seconds. A single tap delivers your invitation to every guest.',
    color: 'bg-cream',
    iconColor: 'text-gold',
  },
  {
    icon: Music,
    title: 'Custom Music',
    description: 'Set the mood with your song. Background audio plays automatically when your invitation opens.',
    color: 'bg-blush',
    iconColor: 'text-burgundy',
  },
  {
    icon: Camera,
    title: 'Photo Gallery',
    description: 'Showcase your favorite moments with a curated photo gallery built into the invitation.',
    color: 'bg-cream',
    iconColor: 'text-gold',
  },
]

function FeatureCard({ feature, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.55 }}
      className={`${feature.color} border border-line/50 rounded-2xl p-6 hover:shadow-md hover:shadow-line/40 transition-shadow duration-300`}
    >
      <div className={`w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center mb-5 ${feature.iconColor}`}>
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-xl font-medium text-ink mb-2">{feature.title}</h3>
      <p className="font-body text-sm text-muted leading-relaxed">{feature.description}</p>
    </motion.div>
  )
}

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-tag">Everything Included</span>
          <h2 className="section-title">Crafted for Your Big Day</h2>
          <p className="font-body text-muted mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Every invitation includes all features — no hidden costs, no upsells.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
