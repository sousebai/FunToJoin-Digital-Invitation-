import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'

const faqs = [
  {
    q: 'Do I need to pay before seeing my invitation?',
    a: 'No. You only pay after reviewing and approving your invitation proof. We want you to love it before any payment is made.',
  },
  {
    q: 'How long does it take to create my invitation?',
    a: 'Standard turnaround is 3–5 business days. With the Prestige plan, we offer priority 48-hour delivery.',
  },
  {
    q: 'Can guests RSVP directly from the invitation?',
    a: 'Yes! Every invitation includes a built-in RSVP form. Responses appear in your private dashboard in real time.',
  },
  {
    q: 'Can I make changes after the invitation goes live?',
    a: 'Minor edits (venue address, time corrections) are included. Major design changes may incur a small fee.',
  },
  {
    q: 'How do guests open the invitation?',
    a: 'They receive a unique link — usually shared via WhatsApp or email. No app download required; it opens in any browser.',
  },
  {
    q: 'Can I have the invitation in multiple languages?',
    a: 'Yes! The Premium and Prestige plans support French, Arabic, and English simultaneously on the same page.',
  },
]

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className="border-b border-line/60 last:border-0"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-body text-sm font-medium text-ink">{item.q}</span>
        <div className={`flex-shrink-0 w-6 h-6 rounded-full border border-line flex items-center justify-center transition-all duration-300 ${open ? 'bg-burgundy border-burgundy rotate-45' : ''}`}>
          <Plus size={12} className={open ? 'text-cream' : 'text-muted'} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-muted leading-relaxed pb-5">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="faq" className="py-24 bg-cream">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-tag">Questions?</span>
          <h2 className="section-title">We Have Answers</h2>
        </motion.div>

        <div className="bg-white/60 backdrop-blur-sm border border-line/50 rounded-2xl px-6 divide-y divide-line/40">
          {faqs.map((item, i) => (
            <FAQItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
