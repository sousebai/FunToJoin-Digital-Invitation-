import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Music, VolumeX, Heart, Send } from 'lucide-react'

// ── Demo data – replace with API fetch using `slug` ──────────────────────
const DEMO = {
  groomName:  'Ahmed',
  brideName:  'Sara',
  weddingDate: '2025-09-14',
  venue: 'The Grand Palace Hotel, Tunis',
  ceremonyTime: '5:00 PM',
  receptionTime: '7:00 PM',
  mapLink: 'https://maps.google.com',
  story: `From a chance meeting at a rooftop gathering in Sidi Bou Saïd, to a quiet sunset proposal on the shores of the Mediterranean — our journey has been one of laughter, late-night conversations, and a love that grew stronger with every shared moment. We can't wait to celebrate with you.`,
  photos: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&q=80',
    'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=400&q=80',
    'https://images.unsplash.com/photo-1501901609772-df0848060b33?w=400&q=80',
  ],
}

// ── Countdown hook ────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({})
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return timeLeft
}

// ── Envelope Animation ────────────────────────────────────────────────────
function EnvelopeGate({ onOpen }) {
  const [opening, setOpening] = useState(false)

  const open = () => {
    setOpening(true)
    setTimeout(onOpen, 1400)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream"
    >
      {/* Ambient blobs */}
      <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-blush/40 blur-3xl" />
      <div className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-line/30 blur-3xl" />

      <div className="relative text-center">
        {/* Envelope SVG */}
        <div
          className="relative mx-auto cursor-pointer"
          style={{ width: 240, height: 180, perspective: 600 }}
          onClick={!opening ? open : undefined}
        >
          {/* Envelope body */}
          <div className="absolute inset-0 bg-white border-2 border-line rounded-lg shadow-xl" />

          {/* Bottom triangles (corners) */}
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <div
              className="absolute bottom-0 left-0 border-r-[120px] border-b-[90px]"
              style={{ borderRightColor: 'transparent', borderBottomColor: '#ECD8D2' }}
            />
            <div
              className="absolute bottom-0 right-0 border-l-[120px] border-b-[90px]"
              style={{ borderLeftColor: 'transparent', borderBottomColor: '#ECD8D2' }}
            />
          </div>

          {/* Flap */}
          <motion.div
            className="absolute top-0 inset-x-0 origin-top"
            style={{ transformStyle: 'preserve-3d' }}
            animate={opening ? { rotateX: -180 } : { rotateX: 0 }}
            transition={{ duration: 1, ease: [0.22, 0, 0.36, 1] }}
          >
            <div
              className="w-full h-0"
              style={{
                borderLeft: '120px solid transparent',
                borderRight: '120px solid transparent',
                borderTop: '90px solid #F2DAD4',
              }}
            />
          </motion.div>

          {/* Letter peeking out */}
          <motion.div
            className="absolute inset-x-4 bg-cream border border-line rounded"
            style={{ bottom: 20, zIndex: 10 }}
            animate={opening ? { y: -80, opacity: 1 } : { y: 0, opacity: 0.6 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            <div className="p-3 text-center">
              <span className="font-script text-lg text-rose">Ahmed & Sara</span>
            </div>
          </motion.div>
        </div>

        {/* Prompt */}
        <motion.p
          animate={opening ? { opacity: 0 } : { opacity: 1 }}
          className="font-body text-sm text-muted mt-6 tracking-wider"
        >
          {opening ? 'Opening…' : 'Tap to open your invitation'}
        </motion.p>

        {!opening && (
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="mt-3 text-rose"
          >
            <Heart size={16} className="mx-auto fill-rose" />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// ── RSVP Form ─────────────────────────────────────────────────────────────
function RSVPForm() {
  const [done, setDone]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', attending: '', guests: '1', meal: '', message: '' })
  const change = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setDone(true)
  }

  if (done) return (
    <div className="text-center py-12">
      <Heart size={40} className="text-rose fill-rose mx-auto mb-4" />
      <h3 className="font-display text-2xl text-ink mb-2">Thank you!</h3>
      <p className="font-body text-sm text-muted">We can't wait to celebrate with you.</p>
    </div>
  )

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-line/60 bg-white/60 font-body text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/25 transition-all'

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md mx-auto">
      <input name="name" value={form.name} onChange={change} required
        className={inputClass} placeholder="Your full name" />

      <div className="grid grid-cols-2 gap-3">
        {['Joyfully accept', 'Regretfully decline'].map(opt => (
          <label key={opt} className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all text-sm font-body ${
            form.attending === opt ? 'border-burgundy bg-burgundy/5 text-burgundy' : 'border-line text-muted hover:border-burgundy/30'
          }`}>
            <input type="radio" name="attending" value={opt} checked={form.attending === opt}
              onChange={change} className="sr-only" />
            {opt}
          </label>
        ))}
      </div>

      {form.attending === 'Joyfully accept' && (
        <select name="guests" value={form.guests} onChange={change} className={inputClass}>
          {['1','2','3','4'].map(n => <option key={n} value={n}>{n} guest{n !== '1' ? 's' : ''}</option>)}
        </select>
      )}

      <textarea name="message" value={form.message} onChange={change} rows={2}
        className={`${inputClass} resize-none`}
        placeholder="Leave a message for the couple (optional)" />

      <button type="submit" disabled={!form.attending || loading}
        className="btn-primary w-full justify-center gap-2 disabled:opacity-50">
        {loading ? 'Sending…' : <><Send size={14} /> Confirm RSVP</>}
      </button>
    </form>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function InvitationPage() {
  const { slug } = useParams()
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const countdown = useCountdown(DEMO.weddingDate)
  const audioRef = useRef(null)

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (musicOn) { audioRef.current.pause(); setMusicOn(false) }
    else         { audioRef.current.play(); setMusicOn(true) }
  }

  const pad = n => String(n ?? 0).padStart(2, '0')

  return (
    <>
      <AnimatePresence>
        {!envelopeOpen && <EnvelopeGate onOpen={() => setEnvelopeOpen(true)} />}
      </AnimatePresence>

      {/* Music toggle FAB */}
      {envelopeOpen && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-cream border border-line shadow-lg flex items-center justify-center text-muted hover:text-burgundy transition-colors"
          aria-label="Toggle music"
        >
          {musicOn ? <Music size={18} /> : <VolumeX size={18} />}
        </button>
      )}

      {/* Hidden audio */}
      <audio ref={audioRef} loop src="/music.mp3" />

      {/* Invitation content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: envelopeOpen ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="min-h-screen bg-cream font-body"
      >
        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blush/30 to-cream overflow-hidden">
          <div className="absolute top-12 left-[8%] w-48 h-48 rounded-full bg-blush/40 blur-3xl" />
          <div className="absolute bottom-24 right-[8%] w-60 h-60 rounded-full bg-line/30 blur-3xl" />

          <div className="relative text-center px-6">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-muted mb-6">
              Together with their families
            </p>
            <span className="font-script text-6xl md:text-8xl text-ink block leading-none mb-1">{DEMO.groomName}</span>
            <p className="font-display text-2xl text-rose/70 my-2">&</p>
            <span className="font-script text-6xl md:text-8xl text-ink block leading-none mb-8">{DEMO.brideName}</span>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-px bg-line" />
              <span className="text-gold text-lg">❧</span>
              <div className="w-16 h-px bg-line" />
            </div>

            <p className="font-display text-xl font-light text-muted mb-10">
              {new Date(DEMO.weddingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-6">
              {[
                { label: 'Days',    val: countdown.days },
                { label: 'Hours',   val: countdown.hours },
                { label: 'Minutes', val: countdown.minutes },
                { label: 'Seconds', val: countdown.seconds },
              ].map(({ label, val }) => (
                <div key={label} className="text-center">
                  <span className="font-display text-4xl font-light text-ink block">{pad(val)}</span>
                  <span className="font-body text-[9px] tracking-widest uppercase text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Our Story ── */}
        <section className="py-20 px-6 max-w-2xl mx-auto text-center">
          <span className="font-script text-4xl text-rose block mb-6">Our Story</span>
          <p className="font-display text-xl font-light text-ink/80 leading-relaxed italic">
            "{DEMO.story}"
          </p>
        </section>

        {/* ── Event Details ── */}
        <section className="py-16 bg-blush/20">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-display text-3xl text-center text-ink mb-10">The Celebration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Ceremony', time: DEMO.ceremonyTime, icon: Heart },
                { label: 'Reception', time: DEMO.receptionTime, icon: Clock },
              ].map(({ label, time, icon: Icon }) => (
                <div key={label} className="bg-white/70 border border-line/50 rounded-2xl p-6 text-center">
                  <Icon size={22} className="text-gold mx-auto mb-3" />
                  <p className="font-body text-xs tracking-widest uppercase text-muted mb-1">{label}</p>
                  <p className="font-display text-3xl font-light text-ink">{time}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white/70 border border-line/50 rounded-2xl p-6 text-center">
              <MapPin size={22} className="text-gold mx-auto mb-3" />
              <p className="font-body text-xs tracking-widest uppercase text-muted mb-1">Venue</p>
              <p className="font-display text-2xl font-light text-ink mb-3">{DEMO.venue}</p>
              <a
                href={DEMO.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-xs px-5 py-2.5"
              >
                View on Map
              </a>
            </div>
          </div>
        </section>

        {/* ── Gallery ── */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <span className="font-script text-4xl text-rose block text-center mb-8">Our Moments</span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {DEMO.photos.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="aspect-square overflow-hidden rounded-2xl"
              >
                <img src={src} alt={`Couple photo ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── RSVP ── */}
        <section className="py-20 bg-blush/20 px-6">
          <div className="max-w-lg mx-auto text-center mb-10">
            <span className="font-script text-4xl text-rose block mb-2">RSVP</span>
            <h2 className="font-display text-3xl text-ink font-light">Will You Join Us?</h2>
            <p className="font-body text-sm text-muted mt-3">
              Please respond by {new Date(new Date(DEMO.weddingDate) - 14 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <RSVPForm />
        </section>

        {/* ── Footer ── */}
        <footer className="py-12 text-center bg-cream border-t border-line/40">
          <span className="font-script text-3xl text-rose block mb-2">Ahmed & Sara</span>
          <p className="font-body text-xs text-muted tracking-widest">
            {new Date(DEMO.weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-12 h-px bg-line" />
            <Heart size={12} className="text-rose fill-rose" />
            <div className="w-12 h-px bg-line" />
          </div>
        </footer>
      </motion.div>
    </>
  )
}
