import React, { useState } from 'react';
import { Mail, Sparkles } from 'lucide-react';

export default function EnvelopeAnimation({ hostNames, ceremonyType, onOpen, themeColor = '#C5A059' }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      if (onOpen) onOpen();
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[72vh] px-4 py-8">
      <div 
        onClick={handleOpen}
        className={`relative w-full max-w-md aspect-[4/3] rounded-3xl cursor-pointer transition-all duration-700 select-none group ${
          isOpen ? 'scale-105 opacity-0' : 'scale-100 opacity-100 hover:scale-[1.02]'
        }`}
        style={{
          background: 'linear-gradient(145deg, #FCFBF9 0%, #F5EFE6 100%)',
          boxShadow: '0 25px 50px -15px rgba(67, 56, 40, 0.15), 0 0 35px rgba(197, 160, 89, 0.15)',
          border: '1px solid rgba(214, 198, 175, 0.7)'
        }}
      >
        {/* Delicate luxury corner filigrees */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-champagne-400/60 rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-champagne-400/60 rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-champagne-400/60 rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-champagne-400/60 rounded-br-lg"></div>

        {/* Envelope Center */}
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center flex-col">
          <p className="text-[11px] uppercase tracking-[0.25em] text-champagne-700 font-bold mb-3 flex items-center gap-1.5 font-sans">
            <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
            Special Invitation For You
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2 leading-tight tracking-wide">
            {hostNames}
          </h2>

          <p className="text-xs sm:text-sm text-stone-500 font-serif italic mb-6">
            Cordially request the pleasure of your company
          </p>

          {/* Luxury Wax Seal Button */}
          <div className="relative group-hover:scale-110 transition-transform duration-300">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-champagne-600 via-champagne-500 to-amber-600 flex items-center justify-center shadow-wax-seal border-2 border-amber-200/80">
              <div className="w-16 h-16 rounded-full border border-dashed border-white/60 flex items-center justify-center text-white">
                <Mail className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="absolute -inset-1 rounded-full bg-champagne-400/30 blur-sm -z-10 animate-pulse"></div>
          </div>

          <span className="text-xs text-champagne-800 font-semibold tracking-wider mt-4">
            Click to Open Invitation
          </span>
        </div>
      </div>
    </div>
  );
}