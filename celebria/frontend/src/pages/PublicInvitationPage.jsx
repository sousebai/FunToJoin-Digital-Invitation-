import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Music,
  Volume2,
  VolumeX,
  Share2,
  Gift,
  CheckCircle2,
  XCircle,
  ExternalLink,
  AlertCircle,
  Send,
  X
} from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import EnvelopeAnimation from '../components/EnvelopeAnimation';
import ShareModal from '../components/ShareModal';

export default function PublicInvitationPage() {
  const { slug } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Envelope and Audio state
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);

  // Modals
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // RSVP Form State
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('attending');
  const [plusOnes, setPlusOnes] = useState(0);
  const [plusOneNames, setPlusOneNames] = useState('');
  const [dietary, setDietary] = useState('');
  const [wishesMessage, setWishesMessage] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [submittingRsvp, setSubmittingRsvp] = useState(false);
  const [rsvpSuccessMsg, setRsvpSuccessMsg] = useState('');
  const [rsvpError, setRsvpError] = useState('');

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await api.getPublicInvitation(slug);
        if (res.success && res.invitation) {
          setInvitation(res.invitation);
          setWishes(res.wishes || []);
        }
      } catch (err) {
        setError(err.message || 'Unable to load celebration details.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvite();
  }, [slug]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch((e) => console.log('Audio autoplay prevented:', e));
    }
  };

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpened(true);
    if (invitation?.theme?.musicUrl && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(() => {});
    }
  };

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setRsvpError('');
    setRsvpSuccessMsg('');

    if (!guestName.trim()) {
      setRsvpError('Please provide your name.');
      return;
    }

    setSubmittingRsvp(true);

    try {
      const res = await api.submitRsvp(slug, {
        guestName,
        email,
        phone,
        status: rsvpStatus,
        plusOnes: rsvpStatus === 'attending' ? parseInt(plusOnes, 10) || 0 : 0,
        plusOneNames: plusOneNames ? plusOneNames.split(',').map(s => s.trim()) : [],
        dietaryRestrictions: dietary,
        wishesMessage,
        songRequest
      });

      if (res.success) {
        setRsvpSuccessMsg(res.message);
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C5A059', '#B86B77', '#52796F', '#E2C99C', '#FAF7F2']
        });

        if (wishesMessage.trim()) {
          setWishes([
            {
              guestName,
              wishesMessage,
              createdAt: new Date().toISOString()
            },
            ...wishes
          ]);
        }
      }
    } catch (err) {
      setRsvpError(err.message || 'Failed to submit RSVP. Please try again.');
    } finally {
      setSubmittingRsvp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-stone-500 space-y-3">
        <Sparkles className="w-8 h-8 text-champagne-600 animate-spin" />
        <p className="font-serif text-lg">Preparing your celebration invitation...</p>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="p-8 rounded-3xl bg-white border border-stone-200 max-w-md space-y-4 shadow-card-soft">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-stone-900">Celebration Not Found</h2>
          <p className="text-sm text-stone-500">{error || 'This invitation link may be invalid or expired.'}</p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-sm"
          >
            Go to Celebria Home
          </Link>
        </div>
      </div>
    );
  }

  if (!isEnvelopeOpened) {
    return (
      <EnvelopeAnimation
        hostNames={invitation.hostNames}
        ceremonyType={invitation.ceremonyType}
        themeColor={invitation.theme?.primaryColor}
        onOpen={handleOpenEnvelope}
      />
    );
  }

  return (
    <div className="relative min-h-screen pb-28 bg-[#FAF7F2] text-[#2D2A26]">
      
      {invitation.theme?.musicUrl && (
        <audio ref={audioRef} src={invitation.theme.musicUrl} loop />
      )}

      {/* Floating Controls Bar (Audio + Share) */}
      <div className="fixed top-6 right-4 z-40 flex items-center gap-2">
        {invitation.theme?.musicUrl && (
          <button
            onClick={toggleMusic}
            className="p-3 rounded-full bg-white/90 border border-stone-200 text-stone-800 shadow-card-soft hover:scale-110 transition-transform backdrop-blur-md"
            title={isPlayingMusic ? 'Mute Melody' : 'Play Celebration Melody'}
          >
            {isPlayingMusic ? <Volume2 className="w-5 h-5 text-champagne-700 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
          </button>
        )}
        <button
          onClick={() => setIsShareOpen(true)}
          className="p-3 rounded-full bg-white/90 border border-stone-200 text-stone-800 shadow-card-soft hover:scale-110 transition-transform backdrop-blur-md"
          title="Share Invitation"
        >
          <Share2 className="w-5 h-5 text-champagne-700" />
        </button>
      </div>

      {/* Main Luxury Invitation Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
        
        {/* Hero Card */}
        <div className="relative rounded-3xl overflow-hidden bg-[#FDFAF6] border border-stone-200/90 shadow-soft-luxury p-6 sm:p-12 text-center space-y-8">
          
          {/* Top Decorative Filigree */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-champagne-400 to-transparent"></div>
            <Sparkles className="w-4 h-4 text-champagne-600" />
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-champagne-400 to-transparent"></div>
          </div>

          <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-champagne-700 font-sans">
            {invitation.ceremonyType.replace('_', ' ')} Invitation
          </p>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 leading-tight tracking-tight">
            {invitation.title}
          </h1>

          <p className="font-script text-3xl sm:text-4xl text-champagne-700">
            {invitation.hostNames}
          </p>

          {invitation.coverImage && (
            <div className="rounded-2xl overflow-hidden shadow-card-soft aspect-video max-h-[320px] mx-auto border border-stone-200">
              <img
                src={invitation.coverImage}
                alt={invitation.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {invitation.story && (
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl mx-auto italic font-serif">
              "{invitation.story}"
            </p>
          )}

          {/* Live Countdown */}
          <div className="pt-2">
            <p className="text-xs uppercase tracking-widest text-stone-500 font-bold mb-2 font-sans">
              Counting down to our special day
            </p>
            <CountdownTimer targetDate={invitation.eventDate} />
          </div>

          {/* Key Date & Location Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-2xl bg-white border border-stone-200/90 text-left shadow-sm">
            
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-champagne-100 text-champagne-800 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold font-sans">Date & Time</span>
                <p className="text-sm font-bold text-stone-900">
                  {new Date(invitation.eventDate).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-champagne-800 font-medium mt-0.5">
                  Starting at {invitation.eventTime || '18:00'} ({invitation.timezone || 'CET'})
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-champagne-100 text-champagne-800 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold font-sans">Venue & Location</span>
                <p className="text-sm font-bold text-stone-900">{invitation.venueName}</p>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{invitation.venueAddress}</p>
                {invitation.mapUrl && (
                  <a
                    href={invitation.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-champagne-700 hover:text-champagne-800 font-bold mt-1"
                  >
                    Open in Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Big RSVP CTA */}
          <div className="pt-2">
            <button
              onClick={() => setIsRsvpOpen(true)}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-base shadow-soft-luxury transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <Heart className="w-4 h-4 text-champagne-400 fill-champagne-400" />
              RSVP for This Celebration
            </button>
            {invitation.settings?.rsvpDeadline && (
              <p className="text-xs text-stone-500 mt-2 font-serif italic">
                Kindly respond by {new Date(invitation.settings.rsvpDeadline).toLocaleDateString()}
              </p>
            )}
          </div>

        </div>

        {/* Schedule / Timeline Section */}
        {invitation.schedule && invitation.schedule.length > 0 && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#FDFAF6] border border-stone-200/90 shadow-soft-luxury space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs uppercase tracking-widest text-champagne-700 font-bold font-sans">The Itinerary</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Event Program</h2>
            </div>

            <div className="relative border-l-2 border-champagne-300 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8 my-6">
              {invitation.schedule.map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-white border-2 border-champagne-500 group-hover:bg-champagne-500 transition-colors"></div>
                  
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-champagne-100 text-champagne-900 font-bold text-xs mb-1">
                    {item.time}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dress Code Section */}
        {invitation.dressCode && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FDFAF6] border border-stone-200/90 shadow-soft-luxury text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-champagne-700 font-bold font-sans">Attire Guide</span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">{invitation.dressCode}</h2>

            {invitation.dressCodeColors && invitation.dressCodeColors.length > 0 && (
              <div className="flex flex-col items-center space-y-2 pt-2">
                <p className="text-xs text-stone-500 font-serif italic">Color Palette Inspiration</p>
                <div className="flex items-center gap-3">
                  {invitation.dressCodeColors.map((color, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div
                        className="w-8 h-8 rounded-full border border-stone-300 shadow-sm"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-[10px] text-stone-500 font-mono">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wishing Well & Registry Info */}
        {invitation.registryInfo && (invitation.registryInfo.title || invitation.registryInfo.bankDetails) && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FDFAF6] border border-stone-200/90 shadow-soft-luxury text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-champagne-100 text-champagne-800 flex items-center justify-center mx-auto">
              <Gift className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">{invitation.registryInfo.title || 'Wishing Well'}</h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
              {invitation.registryInfo.description}
            </p>

            {invitation.registryInfo.bankDetails && (
              <div className="p-4 rounded-xl bg-white border border-stone-200 max-w-md mx-auto text-left shadow-sm">
                <pre className="text-xs text-stone-800 font-mono whitespace-pre-wrap">
                  {invitation.registryInfo.bankDetails}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Guest Wishes & Memory Wall */}
        {invitation.settings?.showWishesWall && wishes.length > 0 && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#FDFAF6] border border-stone-200/90 shadow-soft-luxury space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs uppercase tracking-widest text-champagne-700 font-bold font-sans">Guest Messages</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Wishes & Blessings</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishes.map((w, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-stone-900">{w.guestName}</span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(w.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 italic leading-relaxed font-serif">
                    "{w.wishesMessage}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Floating Bottom RSVP Bar */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white/90 backdrop-blur-md border-t border-stone-200 z-40 flex items-center justify-between max-w-3xl mx-auto shadow-lg">
        <div className="hidden sm:block">
          <p className="text-xs font-bold text-stone-900 truncate max-w-[240px]">{invitation.title}</p>
          <p className="text-[11px] text-stone-500">{invitation.venueName}</p>
        </div>
        <button
          onClick={() => setIsRsvpOpen(true)}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <Heart className="w-4 h-4 text-champagne-400 fill-champagne-400" />
          RSVP Now
        </button>
      </div>

      {/* RSVP Modal Dialog */}
      {isRsvpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <button
              onClick={() => setIsRsvpOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="inline-flex p-2.5 rounded-2xl bg-champagne-100 text-champagne-800 mb-1">
                <Heart className="w-6 h-6 fill-champagne-700" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Celebrate with Us</h3>
              <p className="text-xs text-stone-500 font-serif italic">{invitation.title}</p>
            </div>

            {rsvpSuccessMsg ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="font-serif text-lg font-bold text-stone-900">{rsvpSuccessMsg}</p>
                <p className="text-xs text-stone-600">
                  Your response has been confirmed and updated on the host's roster.
                </p>
                <button
                  onClick={() => setIsRsvpOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                {rsvpError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    {rsvpError}
                  </div>
                )}

                {/* Attendance Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('attending')}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      rsvpStatus === 'attending'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <CheckCircle2 className={`w-5 h-5 ${rsvpStatus === 'attending' ? 'text-emerald-600' : ''}`} />
                    <span className="text-xs">Joyfully Accept</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRsvpStatus('declined')}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      rsvpStatus === 'declined'
                        ? 'border-rose-400 bg-rose-50 text-rose-900 font-bold shadow-sm'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <XCircle className={`w-5 h-5 ${rsvpStatus === 'declined' ? 'text-rose-600' : ''}`} />
                    <span className="text-xs">Regretfully Decline</span>
                  </button>
                </div>

                {/* Guest Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 font-sans">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Jane & John Doe"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-champagne-500"
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1 font-sans">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1 font-sans">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 890"
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs"
                    />
                  </div>
                </div>

                {/* Plus-ones */}
                {rsvpStatus === 'attending' && invitation.settings?.allowPlusOnes && (
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700">Accompanying Guests (Plus-Ones)</span>
                      <select
                        value={plusOnes}
                        onChange={(e) => setPlusOnes(e.target.value)}
                        className="px-2 py-1 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs"
                      >
                        {[...Array((invitation.settings.maxPlusOnes || 2) + 1)].map((_, i) => (
                          <option key={i} value={i}>
                            {i === 0 ? 'Just Me (0)' : `+${i} guest${i > 1 ? 's' : ''}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {plusOnes > 0 && (
                      <input
                        type="text"
                        value={plusOneNames}
                        onChange={(e) => setPlusOneNames(e.target.value)}
                        placeholder="Names of accompanying guests..."
                        className="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs"
                      />
                    )}
                  </div>
                )}

                {/* Dietary restrictions */}
                {rsvpStatus === 'attending' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 font-sans">
                      Dietary Requirements / Allergies
                    </label>
                    <input
                      type="text"
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      placeholder="e.g. Vegetarian, Gluten-free, Halal, None..."
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs"
                    />
                  </div>
                )}

                {/* Heartfelt Wishes */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 font-sans">
                    Congratulations Message for the Hosts
                  </label>
                  <textarea
                    rows={2}
                    value={wishesMessage}
                    onChange={(e) => setWishesMessage(e.target.value)}
                    placeholder="Share your warmest wishes, love, or blessings..."
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs"
                  />
                </div>

                {/* Song Request */}
                {rsvpStatus === 'attending' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1 font-sans">
                      Song Request for the DJ (Optional)
                    </label>
                    <input
                      type="text"
                      value={songRequest}
                      onChange={(e) => setSongRequest(e.target.value)}
                      placeholder="Favorite celebration song..."
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingRsvp}
                  className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-champagne-400" />
                  {submittingRsvp ? 'Submitting...' : 'Confirm RSVP'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {isShareOpen && (
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          invitationTitle={invitation.title}
          slug={invitation.slug}
        />
      )}

    </div>
  );
}
