import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Essential',
    price: '$89',
    tag: null,
    description: 'Everything you need for a beautiful digital invitation.',
    features: [
      'Bespoke invitation micro-site',
      'Countdown timer',
      'RSVP system',
      'WhatsApp shareable link',
      'English support',
      '3 months link active',
    ],
    cta: 'Get Started',
    style: 'bg-cream border border-line',
    ctaStyle: 'btn-outline',
  },
  {
    name: 'Premium',
    price: '$149',
    tag: 'Most Popular',
    description: 'The complete experience for the perfect celebration.',
    features: [
      'Everything in Essential',
      'Custom background music',
      'Photo gallery (up to 20 photos)',
      'Multilingual (FR / AR / EN)',
      'Opening animation',
      '12 months link active',
    ],
    cta: 'Choose Premium',
    style: 'bg-burgundy text-cream',
    ctaStyle: 'bg-cream text-burgundy font-body font-medium tracking-wider uppercase text-sm rounded-full px-7 py-3.5 hover:bg-cream/90 transition-all active:scale-95 inline-flex items-center justify-center gap-2',
  },
  {
    name: 'Prestige',
    price: '$229',
    tag: null,
    description: 'A luxury digital experience with bespoke illustrations.',
    features: [
      'Everything in Premium',
      'Custom venue illustration',
      'Opening video animation',
      'Unlimited photos',
      'Priority design (48h)',
      'Lifetime link',
    ],
    cta: 'Go Prestige',
    style: 'bg-cream border border-line',
    ctaStyle: 'btn-outline',
  },
]

function PlanCard({ plan, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const isPremium = plan.name === 'Premium'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      className={`relative rounded-2xl p-8 flex flex-col ${plan.style} ${isPremium ? 'shadow-2xl shadow-burgundy/20 scale-105' : ''}`}
    >
      {/* Popular badge */}
      {plan.tag && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold rounded-full">
          <span className="font-body text-[10px] tracking-wider uppercase text-cream font-medium">{plan.tag}</span>
        </div>
      )}

      {/* Plan name */}
      <p className={`font-body text-xs tracking-widest uppercase mb-2 ${isPremium ? 'text-cream/60' : 'text-muted'}`}>
        {plan.name}
      </p>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-2">
        <span className={`font-display text-5xl font-light ${isPremium ? 'text-cream' : 'text-ink'}`}>
          {plan.price}
        </span>
      </div>
      <p className={`font-body text-sm mb-6 ${isPremium ? 'text-cream/70' : 'text-muted'}`}>
        {plan.description}
      </p>

      {/* Divider */}
      <div className={`h-px mb-6 ${isPremium ? 'bg-cream/20' : 'bg-line'}`} />

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map(feat => (
          <li key={feat} className="flex items-start gap-3">
            <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
              isPremium ? 'bg-cream/20' : 'bg-blush'
            }`}>
              <Check size={9} className={isPremium ? 'text-cream' : 'text-burgundy'} strokeWidth={2.5} />
            </div>
            <span className={`font-body text-sm ${isPremium ? 'text-cream/80' : 'text-ink/75'}`}>{feat}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a href="#order" className={plan.ctaStyle}>
        {plan.cta}
      </a>
    </motion.div>
  )
}

export default function Pricing() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="pricing" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-tag">Simple Pricing</span>
          <h2 className="section-title">All-Inclusive Plans</h2>
          <p className="font-body text-muted mt-4 max-w-md mx-auto text-sm leading-relaxed">
            No hidden fees. No templates. Just a beautifully crafted invitation made for you.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center font-body text-xs text-muted mt-10"
        >
          ✦ You only pay after approving your invitation proof. No upfront payment required.
        </motion.p>
      </div>
    </section>
  )
}
