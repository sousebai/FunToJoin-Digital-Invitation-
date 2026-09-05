import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ targetDate }) {
  const calculateTimeLeft = () => {
    if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };
    
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-champagne-100/80 border border-champagne-300 text-champagne-900 font-serif text-base tracking-wide shadow-sm">
        <Clock className="w-4 h-4 text-champagne-700 animate-pulse" />
        Today is the Celebration Day!
      </div>
    );
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 my-6">
      {units.map((unit, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-white border border-stone-200/90 flex items-center justify-center shadow-card-soft backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-champagne-400 to-transparent opacity-80"></div>
            <span className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              {String(unit.value).padStart(2, '0')}
            </span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-champagne-200 group-hover:bg-champagne-400 transition-colors"></div>
          </div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-500 font-bold mt-2">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}