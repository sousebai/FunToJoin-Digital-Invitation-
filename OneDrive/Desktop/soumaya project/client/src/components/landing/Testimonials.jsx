import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote:
      'Our guests kept complimenting the invitation — they thought it was from a luxury studio. The envelope animation was magical.',
    name: 'Sara & Ahmed',
    subtitle: 'Married June 2025 · Garden Romance theme',
    initials: 'S&A',
  },
  {
    quote:
      'We received RSVPs from 90% of our guests before we even followed up. The dashboard made tracking effortless.',
    name: 'Yasmine & Nour',
    subtitle: 'Married April 2025 · Blossom theme',
    initials: 'Y&N',
  },
  {
    quote:
      'Sharing via WhatsApp was so elegant. One link, one tap — our family in France, UK and Tunisia all received it instantly.',
    name: 'Lina & Karim',
    subtitle: 'Married September 2025 · Midnight Luxe theme',
    initials: 'L&K',
  },
]

function TestimonialCard({ t, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.55 }}
      className="bg-white/70 backdrop-blur-sm border border-line/50 rounded-2xl p-7 flex flex-col gap-5"
    >
      <Quote size={28} className="text-blush" />
      <p className="font-display text-lg font-light text-ink/80 leading-relaxed italic">
        "{t.quote}"
      </p>
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-line/40">
        <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center flex-shrink-0">
          <span className="font-script text-sm text-burgundy">{t.initials}</span>
        </div>
        <div>
          <p className="font-body text-sm font-medium text-ink">{t.name}</p>
          <p className="font-body text-xs text-muted">{t.subtitle}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="testimonials" className="py-24 bg-blush/15">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-tag">Love Letters</span>
          <h2 className="section-title">From Our Couples</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
