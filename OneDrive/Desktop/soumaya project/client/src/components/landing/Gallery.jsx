import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Invitation themes/cards for the gallery
const themes = [
  {
    id: 1,
    title: 'Garden Romance',
    style: 'Floral · Soft Greens · Pastel',
    bg: 'from-[#e8f0e4] to-[#f5f0eb]',
    accent: '#6E8C5C',
    names: 'Sara & Ahmed',
    date: 'June 14, 2025',
  },
  {
    id: 2,
    title: 'Midnight Luxe',
    style: 'Dark · Gold · Opulent',
    bg: 'from-[#1a1420] to-[#2d1f2e]',
    accent: '#A98646',
    names: 'Lina & Karim',
    date: 'September 20, 2025',
    dark: true,
  },
  {
    id: 3,
    title: 'Blossom',
    style: 'Blush · Ivory · Romantic',
    bg: 'from-[#f9ede8] to-[#fdf4f0]',
    accent: '#C98A82',
    names: 'Yasmine & Nour',
    date: 'April 5, 2025',
  },
  {
    id: 4,
    title: 'Champagne Dreams',
    style: 'Champagne · Cream · Classic',
    bg: 'from-[#f5e9d3] to-[#fdf8f0]',
    accent: '#8B6914',
    names: 'Hana & Sami',
    date: 'November 8, 2025',
  },
]

function InvitationCard({ theme }) {
  return (
    <div
      className={`relative w-[280px] h-[420px] rounded-[2rem] overflow-hidden shadow-xl flex-shrink-0 bg-gradient-to-b ${theme.bg} border border-white/30`}
    >
      {/* Top ornament */}
      <div className="absolute top-6 inset-x-0 flex justify-center">
        <div className="w-px h-8 opacity-30" style={{ background: theme.accent }} />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
        {/* Small script tag */}
        <span className="font-script text-lg" style={{ color: theme.accent }}>
          You are invited
        </span>

        {/* Decorative line */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px" style={{ background: `${theme.accent}40` }} />
          <span style={{ color: theme.accent }} className="text-sm">❧</span>
          <div className="flex-1 h-px" style={{ background: `${theme.accent}40` }} />
        </div>

        {/* Couple */}
        <div>
          <p className="font-display text-3xl font-light leading-tight" style={{ color: theme.dark ? '#f5e8d4' : '#3B2A2C' }}>
            {theme.names.split('&')[0].trim()}
          </p>
          <p className="font-body text-xs tracking-widest my-1" style={{ color: `${theme.dark ? '#f5e8d4' : '#3B2A2C'}60` }}>&</p>
          <p className="font-display text-3xl font-light" style={{ color: theme.dark ? '#f5e8d4' : '#3B2A2C' }}>
            {theme.names.split('&')[1].trim()}
          </p>
        </div>

        <p className="font-body text-xs tracking-widest" style={{ color: theme.accent }}>
          {theme.date}
        </p>

        {/* Bottom badge */}
        <div
          className="mt-4 px-4 py-1.5 rounded-full text-[10px] font-body tracking-wider uppercase"
          style={{ background: `${theme.accent}18`, color: theme.accent, border: `1px solid ${theme.accent}35` }}
        >
          {theme.style}
        </div>
      </div>

      {/* Bottom ornament */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center">
        <div className="w-px h-8 opacity-30" style={{ background: theme.accent }} />
      </div>
    </div>
  )
}

export default function Gallery() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [active, setActive] = useState(0)
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    const next = Math.max(0, Math.min(themes.length - 1, active + dir))
    setActive(next)
    const card = scrollRef.current?.children[next]
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  return (
    <section id="gallery" className="py-24 bg-blush/15 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-tag">Our Work</span>
          <h2 className="section-title">Invitation Styles</h2>
          <p className="font-body text-muted mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Each invitation is unique. Browse a few of our design themes below.
          </p>
        </motion.div>

        {/* Cards carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth hide-scrollbar justify-start md:justify-center"
            style={{ scrollbarWidth: 'none' }}
          >
            {themes.map((theme, i) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="snap-center flex-shrink-0"
                onClick={() => setActive(i)}
              >
                <div className={`transition-transform duration-300 ${active === i ? 'scale-100' : 'scale-95 opacity-70'}`}>
                  <InvitationCard theme={theme} />
                </div>
                <p className="text-center font-body text-xs text-muted mt-3">{theme.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => scroll(-1)}
              disabled={active === 0}
              className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-muted hover:text-burgundy hover:border-burgundy/40 transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {themes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActive(i); scroll(i - active) }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${active === i ? 'bg-burgundy w-4' : 'bg-line'}`}
                />
              ))}
            </div>
            <button
              onClick={() => scroll(1)}
              disabled={active === themes.length - 1}
              className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-muted hover:text-burgundy hover:border-burgundy/40 transition-colors disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
