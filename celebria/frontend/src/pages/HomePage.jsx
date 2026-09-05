import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  GraduationCap,
  Baby,
  PartyPopper,
  QrCode,
  Users,
  Music,
  Download,
  ArrowRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('wedding');

  const ceremonyDemos = [
    {
      id: 'wedding',
      name: 'Royal Wedding Gala',
      icon: Heart,
      badge: 'Boutique Collection',
      couple: 'Sophia & Alexandre',
      date: 'In 45 Days • Château de Chantilly, France',
      slug: 'sophia-alexandre-wedding',
      cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      description: 'Champagne silk envelope, delicate countdown, candlelit banquet itinerary, and honeymoon wishing well.'
    },
    {
      id: 'graduation',
      name: 'Masters & Diploma Graduation',
      icon: GraduationCap,
      badge: 'Academic Honor',
      couple: 'Ethan Brooks, M.Sc.',
      date: 'In 20 Days • The Glass Pavilion, Paris',
      slug: 'ethan-brooks-graduation-2026',
      cover: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
      description: 'Botanical sage and brushed gold aesthetic, graduation cap toss itinerary, and career launch gift registry.'
    },
    {
      id: 'gender_reveal',
      name: 'Boots or Bows? Gender Reveal',
      icon: Baby,
      badge: 'Sweet Celebrations',
      couple: 'Maya & Lucas Thorne',
      date: 'In 30 Days • Sunlit Willow Gardens',
      slug: 'maya-lucas-gender-reveal',
      cover: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
      description: 'Pastel blush and soft sky dress codes, interactive smoke cannon timeline, and guest predictions wall.'
    },
    {
      id: 'birthday',
      name: 'Milestone 30th Birthday Soirée',
      icon: PartyPopper,
      badge: 'VIP Celebration',
      couple: 'Liam Vance',
      date: 'In 15 Days • Club Velvet Underground',
      slug: 'liam-turns-30',
      cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
      description: 'Velvet night and champagne gold accents, mixology schedule, and late-night party details.'
    }
  ];

  const selectedDemo = ceremonyDemos.find(d => d.id === activeCategory) || ceremonyDemos[0];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Soft Ambient Ethereal Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[500px] bg-gradient-to-b from-champagne-200/40 via-rosedust-light/30 to-transparent blur-3xl -z-10 rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-champagne-300/70 text-champagne-800 text-xs font-semibold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
            Haute Couture Digital Invitations & Guest Management
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 max-w-4xl mx-auto leading-[1.15]">
            Celebrate Life’s Finest Moments with <span className="text-gold-gradient font-serif italic">Pure Elegance</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Create breathtaking digital ceremony invitations with interactive wax seal envelopes, real-time RSVP tracking, live countdowns, and guest list export in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/create"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-base shadow-soft-luxury flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-champagne-400" />
              Design Your Ceremony Invitation
            </Link>

            <Link
              to="/invite/sophia-alexandre-wedding"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-stone-300/80 hover:border-champagne-400 text-stone-800 font-semibold text-base hover:bg-stone-50 flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              Explore Live Guest View
              <ArrowRight className="w-4 h-4 text-champagne-700" />
            </Link>
          </div>

          {/* Social Proof Trust Bar */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-stone-500 text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant RSVPs & Dietary Tracking
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mobile-First Responsive Design
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> WhatsApp & QR Code Sharing
            </span>
          </div>

        </div>
      </section>

      {/* Interactive Ceremony Showcase */}
      <section id="ceremonies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-widest text-champagne-700 font-bold font-sans">Curated Stationery</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Designed for Every Celebration
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto text-sm sm:text-base">
            Select a celebration below to experience our soft luxury templates with live countdowns and RSVP forms.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {ceremonyDemos.map((demo) => {
              const Icon = demo.icon;
              const isActive = activeCategory === demo.id;
              return (
                <button
                  key={demo.id}
                  onClick={() => setActiveCategory(demo.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-stone-900 text-white font-semibold shadow-md scale-105'
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-champagne-400' : 'text-champagne-600'}`} />
                  {demo.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Demo Card Preview */}
        <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-10 shadow-soft-luxury border border-stone-200/90">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-100 text-champagne-800 text-xs font-bold uppercase tracking-wider">
                {selectedDemo.badge}
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                {selectedDemo.name}
              </h3>

              <p className="font-script text-3xl text-champagne-700">
                {selectedDemo.couple}
              </p>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {selectedDemo.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-champagne-600" /> {selectedDemo.date}
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to={`/invite/${selectedDemo.slug}`}
                  className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-105"
                >
                  Open Live Guest View <ArrowRight className="w-4 h-4 text-champagne-400" />
                </Link>

                <Link
                  to={`/create?template=${selectedDemo.id}`}
                  className="px-6 py-3 rounded-xl bg-white border border-stone-300 text-stone-700 hover:text-stone-900 text-sm font-medium hover:bg-stone-50 transition-all shadow-sm"
                >
                  Use This Template
                </Link>
              </div>
            </div>

            {/* Image Preview Box */}
            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-card-soft border border-stone-200 group-hover:scale-[1.02] transition-transform duration-500">
                <img
                  src={selectedDemo.cover}
                  alt={selectedDemo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent flex items-end p-6">
                  <span className="text-xs text-white bg-stone-900/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 font-medium">
                    Live Mobile & Desktop Preview
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs uppercase tracking-widest text-champagne-700 font-bold font-sans">Artisanal Details</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Everything You Need for a Flawless Event
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto text-sm">
            Replace paper invitations with interactive, tactile digital invitations that captivate your guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-8 rounded-3xl glass-card space-y-4 hover:border-champagne-400 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-champagne-100 text-champagne-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Animated Wax Seal Envelope</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Enchant your guests with a simulated wax seal and unfolding linen envelope animation before unveiling your ceremony details.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-card space-y-4 hover:border-champagne-400 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Instant RSVP Tracking</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Track attendance, plus-ones headcount, dietary restrictions (vegan, gluten-free, halal), and personal guest notes in real time.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-card space-y-4 hover:border-champagne-400 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-rosedust-light text-rosedust-dark flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Interactive Timeline & Maps</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Provide an elegant schedule of your day (ceremony, cocktails, dinner) and 1-tap Google Maps directions for traveling guests.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-card space-y-4 hover:border-champagne-400 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">QR Code & WhatsApp Sharing</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Generate scannable QR codes for physical cards or share your ceremony link instantly via WhatsApp, Telegram, or Email.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-card space-y-4 hover:border-champagne-400 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Export to CSV for Caterers</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Download your full guest list, headcount breakdown, and dietary requirements into an Excel-ready CSV sheet with a single click.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-card space-y-4 hover:border-champagne-400 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-sage-light text-sage-dark flex items-center justify-center group-hover:scale-110 transition-transform">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Atmospheric Audio & Themes</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Choose from soft luxury color palettes (Champagne Silk, Sage & Pearl, Dusty Rose) and embed ambient melody tracks for your guests.
            </p>
          </div>

        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="relative rounded-3xl glass-gold p-8 sm:p-14 text-center space-y-6 shadow-soft-luxury overflow-hidden border border-champagne-300">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-champagne-300/30 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
            Ready to Celebrate in Style?
          </h2>

          <p className="text-stone-600 max-w-lg mx-auto text-sm sm:text-base">
            Create an unforgettable first impression for your guests with bespoke digital invitations today.
          </p>

          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-base shadow-soft-luxury transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-champagne-400" />
              Create Free Account & Start
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}