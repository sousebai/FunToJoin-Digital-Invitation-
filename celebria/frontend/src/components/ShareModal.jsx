import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Send, Mail } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, invitationTitle, slug }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const inviteUrl = `${window.location.origin}/invite/${slug}`;
  const shareText = encodeURIComponent(`You are cordially invited to ${invitationTitle}! Click here to view the invitation and RSVP: ${inviteUrl}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      url: `https://api.whatsapp.com/send?text=${shareText}`
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-600 hover:bg-sky-500 text-white',
      url: `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(`Invitation: ${invitationTitle}`)}`
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-stone-800 hover:bg-stone-700 text-white',
      url: `mailto:?subject=${encodeURIComponent(invitationTitle)}&body=${shareText}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <h3 className="font-serif text-2xl font-bold text-stone-900">Share Invitation</h3>
          <p className="text-xs sm:text-sm text-stone-500 font-serif italic">{invitationTitle}</p>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map((opt, i) => (
            <a
              key={i}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center p-4 rounded-2xl font-medium text-xs gap-2 transition-transform hover:scale-105 shadow-sm ${opt.color}`}
            >
              <opt.icon className="w-5 h-5" />
              {opt.name}
            </a>
          ))}
        </div>

        {/* Direct Link */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Direct Invite Link</label>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="flex-1 bg-transparent px-2 text-stone-700 focus:outline-none truncate font-mono text-[11px]"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold flex items-center gap-1 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}