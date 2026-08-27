import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-cream"
    >
      {/* Decorative background petals */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-[8%] w-64 h-64 rounded-full bg-blush/30 blur-3xl" />
        <div className="absolute bottom-24 right-[6%] w-80 h-80 rounded-full bg-line/40 blur-3xl" />
        <div className="absolute top-1/3 right-[20%] w-40 h-40 rounded-full bg-rose/10 blur-2xl" />
      </div>

      {/* Thin ornamental lines */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-gold/40" />
        <span className="font-body text-[9px] tracking-[0.3em] text-gold/60 rotate-90 origin-center whitespace-nowrap">
          DIGITAL INVITATION
        </span>
        <div className="w-px h-24 bg-gradient-to-t from-transparent to-gold/40" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="font-body text-xs tracking-[0.28em] uppercase text-muted mb-6"
        >
          Premium Digital Wedding Invitations
        </motion.p>

        {/* Script accent */}
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-script text-5xl md:text-6xl text-rose block mb-2"
        >
          Your love story,
        </motion.span>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="font-display text-5xl md:text-7xl font-light text-ink leading-[0.95] mb-8"
        >
          Beautifully<br />
          <em className="italic font-light text-burgundy">Delivered</em>
        </motion.h1>

        {/* Ornamental divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="w-16 h-px bg-line" />
          <span className="text-gold text-lg">❧</span>
          <div className="w-16 h-px bg-line" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="font-body text-base md:text-lg text-muted max-w-xl mx-auto leading-relaxed mb-10"
        >
          Bespoke micro-websites for your wedding. RSVP tracking, countdown
          timers, custom music — shared in one elegant WhatsApp link.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#order" className="btn-primary">
            Create My Invitation
          </a>
          <a href="#gallery" className="btn-outline">
            See Examples
          </a>
        </motion.div>

        {/* Social proof pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-10 inline-flex items-center gap-2 px-4 py-2 bg-blush/50 rounded-full border border-line/60"
        >
          <div className="flex -space-x-2">
            {['A','B','C','D'].map((l, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-burgundy/20 border border-cream flex items-center justify-center"
              >
                <span className="font-body text-[8px] text-burgundy font-semibold">{l}</span>
              </div>
            ))}
          </div>
          <span className="font-body text-xs text-muted">
            Joined by <strong className="text-ink">200+</strong> couples this year
          </span>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#how-it-works"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted/60 hover:text-burgundy transition-colors"
      >
        <span className="font-body text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.a>
    </section>
  )
}
