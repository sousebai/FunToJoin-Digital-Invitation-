import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, QrCode as QrIcon } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, invitationTitle, slug }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const inviteUrl = `${window.location.origin}/invite/${slug}`;

  useEffect(() => {
    if (isOpen && slug) {
      QRCode.toDataURL(inviteUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#2D2A26',
          light: '#FFFFFF'
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [isOpen, slug, inviteUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `qrcode-${slug}.png`;
    link.href = qrDataUrl;
    link.click();
  };

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
          <div className="inline-flex p-3 rounded-2xl bg-champagne-100 text-champagne-800 mb-1">
            <QrIcon className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">Event QR Code</h3>
          <p className="text-xs sm:text-sm text-stone-500 font-serif italic">{invitationTitle}</p>
        </div>

        {/* QR Code Container */}
        <div className="flex justify-center p-4 bg-stone-50 rounded-2xl border border-stone-200/80 max-w-[260px] mx-auto shadow-inner">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Invitation QR Code" className="w-full h-auto rounded-xl" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-stone-400 text-sm">
              Generating...
            </div>
          )}
        </div>

        {/* Link Copy Bar */}
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

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-champagne-500 to-champagne-600 hover:from-champagne-400 hover:to-champagne-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-soft-luxury transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download className="w-4 h-4" /> Download High-Res QR Code
        </button>
      </div>
    </div>
  );
}