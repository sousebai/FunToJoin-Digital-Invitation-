import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    number: '01',
    title: 'Place Your Order',
    description:
      'Fill in our short form with your wedding details — date, venue, style preferences, and languages needed.',
    icon: '✉️',
  },
  {
    number: '02',
    title: 'We Get in Touch',
    description:
      'Our team contacts you within 24 hours to discuss your vision, collect photos, and finalize the details.',
    icon: '💬',
  },
  {
    number: '03',
    title: 'We Design & Craft',
    description:
      'Your bespoke invitation micro-site is created with care — animations, music, your story, all included.',
    icon: '✨',
  },
  {
    number: '04',
    title: 'Share & Celebrate',
    description:
      'Approve your proof, complete payment, and your link goes live instantly. Share it on WhatsApp with one tap.',
    icon: '🥂',
  },
]

function Step({ step, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="relative flex flex-col items-center text-center"
    >
      {/* Connector line (not on last) */}
      {index < steps.length - 1 && (
        <div className="hidden md:block absolute top-10 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-gradient-to-r from-line to-transparent" />
      )}

      {/* Icon circle */}
      <div className="relative z-10 w-20 h-20 rounded-full bg-cream border-2 border-line flex items-center justify-center mb-6 shadow-sm">
        <span className="text-3xl">{step.icon}</span>
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-burgundy flex items-center justify-center">
          <span className="font-body text-[9px] text-cream font-semibold">{step.number}</span>
        </span>
      </div>

      <h3 className="font-display text-xl font-medium text-ink mb-3">{step.title}</h3>
      <p className="font-body text-sm text-muted leading-relaxed max-w-[200px]">{step.description}</p>
    </motion.div>
  )
}

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="py-24 bg-blush/20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-tag">Simple & Elegant</span>
          <h2 className="section-title">How It Works</h2>
          <p className="font-body text-muted mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            From your first message to your guests receiving the link — we handle everything.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          {steps.map((step, i) => (
            <Step key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
