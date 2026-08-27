import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, CheckCircle, Clock, Download, Search, Eye, EyeOff } from 'lucide-react'

// Demo guest data
const GUESTS = [
  { id: 1, name: 'Fatma Ben Ali',    attending: true,  guests: 2, meal: 'Vegetarian', rsvpDate: '2025-07-12' },
  { id: 2, name: 'Karim Mansour',   attending: true,  guests: 3, meal: 'Standard',   rsvpDate: '2025-07-14' },
  { id: 3, name: 'Leila Chouikha',  attending: false, guests: 0, meal: '—',          rsvpDate: '2025-07-15' },
  { id: 4, name: 'Nour Trabelsi',   attending: true,  guests: 1, meal: 'Vegan',      rsvpDate: '2025-07-16' },
  { id: 5, name: 'Sami Jebali',     attending: true,  guests: 2, meal: 'Standard',   rsvpDate: '2025-07-18' },
  { id: 6, name: 'Hana Chaabane',   attending: null,  guests: 0, meal: '—',          rsvpDate: '—' },
]

const STATS = [
  { label: 'Invitations Sent', value: 48,  icon: Users,        color: 'text-ink' },
  { label: 'Attending',        value: 32,  icon: CheckCircle,  color: 'text-gold' },
  { label: 'Declined',         value: 6,   icon: EyeOff,       color: 'text-rose' },
  { label: 'Pending',          value: 10,  icon: Clock,        color: 'text-muted' },
]

function exportCSV(guests) {
  const rows = ['Name,Attending,Guests,Meal,RSVP Date',
    ...guests.map(g => `${g.name},${g.attending === null ? 'Pending' : g.attending ? 'Yes' : 'No'},${g.guests},${g.meal},${g.rsvpDate}`)
  ]
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'guestlist.csv'
  a.click()
}

export default function Dashboard() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = GUESTS.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all'
      ? true
      : filter === 'attending' ? g.attending === true
      : filter === 'declined'  ? g.attending === false
      : g.attending === null
    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="bg-cream/95 border-b border-line/60 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <span className="font-script text-3xl text-burgundy">Invitia</span>
        <div className="flex items-center gap-3">
          <span className="font-body text-xs text-muted hidden md:block">Ahmed & Sara · Sept 14, 2025</span>
          <div className="w-8 h-8 rounded-full bg-blush flex items-center justify-center">
            <span className="font-script text-sm text-burgundy">A</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <span className="font-body text-xs tracking-widest uppercase text-muted">Dashboard</span>
          <h1 className="font-display text-4xl font-light text-ink mt-1">RSVP Overview</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-white/70 border border-line/50 rounded-2xl p-5"
              >
                <Icon size={18} className={`${s.color} mb-3`} />
                <p className="font-display text-4xl font-light text-ink">{s.value}</p>
                <p className="font-body text-xs text-muted mt-1">{s.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="bg-white/70 border border-line/50 rounded-2xl p-5 mb-8">
          <div className="flex justify-between mb-3">
            <span className="font-body text-xs text-muted">Response rate</span>
            <span className="font-body text-xs font-medium text-ink">79%</span>
          </div>
          <div className="h-2 bg-line rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '79%' }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              className="h-full bg-burgundy rounded-full"
            />
          </div>
        </div>

        {/* Guest table */}
        <div className="bg-white/70 border border-line/50 rounded-2xl overflow-hidden">
          {/* Table toolbar */}
          <div className="px-5 py-4 border-b border-line/40 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search guests…"
                className="w-full pl-8 pr-4 py-2 rounded-lg border border-line/60 bg-cream font-body text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-gold/50"
              />
            </div>
            <div className="flex items-center gap-2">
              {['all', 'attending', 'declined', 'pending'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full font-body text-[10px] tracking-wider uppercase transition-all ${
                    filter === f ? 'bg-burgundy text-cream' : 'text-muted hover:text-burgundy'
                  }`}
                >
                  {f}
                </button>
              ))}
              <button
                onClick={() => exportCSV(filtered)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-muted hover:text-burgundy hover:border-burgundy/40 transition-colors font-body text-xs"
              >
                <Download size={12} />
                Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line/40">
                  {['Guest Name', 'Status', 'Guests', 'Meal', 'RSVP Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-body text-[10px] tracking-widest uppercase text-muted font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, i) => (
                  <tr key={g.id} className={`border-b border-line/20 last:border-0 hover:bg-blush/20 transition-colors ${i % 2 === 0 ? '' : 'bg-cream/30'}`}>
                    <td className="px-5 py-3.5 font-body text-sm text-ink">{g.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full font-body text-[10px] tracking-wider uppercase font-medium ${
                        g.attending === true  ? 'bg-gold/15 text-gold' :
                        g.attending === false ? 'bg-rose/15 text-rose' :
                        'bg-line/60 text-muted'
                      }`}>
                        {g.attending === true ? 'Attending' : g.attending === false ? 'Declined' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-body text-sm text-ink/70">{g.guests || '—'}</td>
                    <td className="px-5 py-3.5 font-body text-sm text-ink/70">{g.meal}</td>
                    <td className="px-5 py-3.5 font-body text-xs text-muted">{g.rsvpDate}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center font-body text-sm text-muted">
                      No guests match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
