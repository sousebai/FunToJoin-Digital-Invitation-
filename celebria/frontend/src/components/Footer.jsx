import React from 'react';
import { Sparkles, Heart, Globe, Shield, Code, Server, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-white/70 backdrop-blur-md pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-champagne-500 to-amber-200 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-stone-900 fill-stone-900" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
                Celebria <span className="text-champagne-700 text-[10px] font-sans uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-champagne-100 border border-champagne-300/60">Atelier</span>
              </span>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed max-w-md">
              An haute-couture digital invitation and ceremony management platform crafted with soft aesthetics for weddings, graduations, gender reveals, and milestone celebrations.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Database className="w-3 h-3 text-emerald-600" /> MongoDB
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                <Server className="w-3 h-3 text-amber-600" /> Express.js
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200">
                <Code className="w-3 h-3 text-sky-600" /> React.js
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
                <Globe className="w-3 h-3 text-stone-600" /> Node.js
              </span>
            </div>
          </div>

          {/* Ceremony Categories */}
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-4 font-sans">Ceremonies</h4>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li><a href="/#ceremonies" className="hover:text-champagne-700 transition-colors">Royal Weddings & Galas</a></li>
              <li><a href="/#ceremonies" className="hover:text-champagne-700 transition-colors">University Graduations</a></li>
              <li><a href="/#ceremonies" className="hover:text-champagne-700 transition-colors">Gender Reveals & Showers</a></li>
              <li><a href="/#ceremonies" className="hover:text-champagne-700 transition-colors">Milestone Birthdays</a></li>
              <li><a href="/#ceremonies" className="hover:text-champagne-700 transition-colors">Anniversaries & Soirées</a></li>
            </ul>
          </div>

          {/* Graduation Workshop Tribute */}
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-4 font-sans">Workshop Diploma</h4>
            <p className="text-xs text-stone-600 leading-relaxed mb-3">
              Designed as a capstone graduation project for Software Development Diploma.
            </p>
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 text-xs text-stone-700 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-champagne-700 font-bold">
                <Shield className="w-3.5 h-3.5" /> Full-Stack MERN Architecture
              </div>
              <p className="text-stone-500 text-[11px]">Stateless JWT • Real-Time RSVPs • CSV Export • Soft Luxury UX</p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Celebria Studio. Crafted for excellence.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for your diploma graduation defense.
          </p>
        </div>
      </div>
    </footer>
  );
}