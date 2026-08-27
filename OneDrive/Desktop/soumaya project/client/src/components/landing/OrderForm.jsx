import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'

const styles = [
  'Floral & Garden',
  'Midnight Luxe',
  'Blossom & Blush',
  'Champagne Classic',
  'Modern Minimal',
  'Not sure yet',
]

export default function OrderForm() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [form, setForm] = useState({
    groomName: '', brideName: '', weddingDate: '',
    email: '', phone: '', style: '', languages: [], notes: '',
  })

  const handleChange = e => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
  }

  const toggleLang = lang => {
    setForm(p => ({
      ...p,
      languages: p.languages.includes(lang)
        ? p.languages.filter(l => l !== lang)
        : [...p.languages, lang],
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setSubmitted(true)
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-line bg-white/60 font-body text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all'

  if (submitted) {
    return (
      <section id="order" className="py-24 bg-blush/20">
        <div className="max-w-lg mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <CheckCircle size={56} className="text-gold mx-auto mb-6" />
            <span className="font-script text-4xl text-rose block mb-3">Thank you!</span>
            <h2 className="font-display text-3xl text-ink mb-4">Order Received</h2>
            <p className="font-body text-muted text-sm leading-relaxed">
              We've received your request and will get in touch within 24 hours to begin crafting your invitation. 
              Check your email for a confirmation.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="order" className="py-24 bg-blush/20">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-tag">Start Here</span>
          <h2 className="section-title">Create My Invitation</h2>
          <p className="font-body text-muted mt-4 text-sm leading-relaxed">
            Fill in the details below. No payment required at this stage.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-sm border border-line/50 rounded-3xl p-8 space-y-5"
        >
          {/* Couple names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs text-muted tracking-wider uppercase block mb-1.5">
                Groom's Name
              </label>
              <input name="groomName" value={form.groomName} onChange={handleChange}
                className={inputClass} placeholder="Ahmed" required />
            </div>
            <div>
              <label className="font-body text-xs text-muted tracking-wider uppercase block mb-1.5">
                Bride's Name
              </label>
              <input name="brideName" value={form.brideName} onChange={handleChange}
                className={inputClass} placeholder="Sara" required />
            </div>
          </div>

          {/* Wedding date */}
          <div>
            <label className="font-body text-xs text-muted tracking-wider uppercase block mb-1.5">
              Wedding Date
            </label>
            <input type="date" name="weddingDate" value={form.weddingDate} onChange={handleChange}
              className={inputClass} required />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs text-muted tracking-wider uppercase block mb-1.5">
                Email
              </label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className={inputClass} placeholder="hello@example.com" required />
            </div>
            <div>
              <label className="font-body text-xs text-muted tracking-wider uppercase block mb-1.5">
                Phone / WhatsApp
              </label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                className={inputClass} placeholder="+1 555 0123" />
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="font-body text-xs text-muted tracking-wider uppercase block mb-2">
              Preferred Style
            </label>
            <div className="flex flex-wrap gap-2">
              {styles.map(s => (
                <button
                  key={s} type="button"
                  onClick={() => setForm(p => ({ ...p, style: s }))}
                  className={`px-3 py-1.5 rounded-full font-body text-xs border transition-all ${
                    form.style === s
                      ? 'bg-burgundy text-cream border-burgundy'
                      : 'border-line text-muted hover:border-burgundy/40 hover:text-burgundy'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="font-body text-xs text-muted tracking-wider uppercase block mb-2">
              Languages Needed
            </label>
            <div className="flex gap-2">
              {['English', 'French', 'Arabic'].map(lang => (
                <button
                  key={lang} type="button"
                  onClick={() => toggleLang(lang)}
                  className={`px-3 py-1.5 rounded-full font-body text-xs border transition-all ${
                    form.languages.includes(lang)
                      ? 'bg-gold/20 text-gold border-gold/50'
                      : 'border-line text-muted hover:border-gold/40 hover:text-gold'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-body text-xs text-muted tracking-wider uppercase block mb-1.5">
              Additional Notes
            </label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Tell us about your venue, theme, special requests..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Sending...
              </span>
            ) : (
              <>
                <Send size={15} />
                Send My Request
              </>
            )}
          </button>

          <p className="text-center font-body text-xs text-muted">
            No payment required. We'll contact you within 24 hours.
          </p>
        </motion.form>
      </div>
    </section>
  )
}
