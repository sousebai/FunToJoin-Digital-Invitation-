import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import {
  Sparkles,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Palette,
  Gift,
  Users,
  Music,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const PRESET_THEMES = [
  {
    id: 'champagne-silk',
    name: 'Champagne Silk & Gold',
    primaryColor: '#C5A059',
    accentColor: '#926A37',
    bgColor: '#FAF7F2',
    textColor: '#2D2A26',
    fontFamily: 'playfair',
    envelopeColor: '#F5EFE6',
    previewBadge: 'bg-champagne-400'
  },
  {
    id: 'dusty-rose',
    name: 'Romantic Dusty Rose & Pearl',
    primaryColor: '#B86B77',
    accentColor: '#C5A059',
    bgColor: '#FBF4F2',
    textColor: '#2D2A26',
    fontFamily: 'serif',
    envelopeColor: '#F7ECE9',
    previewBadge: 'bg-rosedust'
  },
  {
    id: 'botanical-sage',
    name: 'Botanical Sage & Gold',
    primaryColor: '#52796F',
    accentColor: '#C5A059',
    bgColor: '#F0F5F2',
    textColor: '#2D2A26',
    fontFamily: 'serif',
    envelopeColor: '#E6EFEA',
    previewBadge: 'bg-sage'
  },
  {
    id: 'twilight-stardust',
    name: 'Twilight Midnight & Gold',
    primaryColor: '#C5A059',
    accentColor: '#E2C99C',
    bgColor: '#111827',
    textColor: '#F9FAFB',
    fontFamily: 'serif',
    envelopeColor: '#1F2937',
    previewBadge: 'bg-stone-900'
  }
];

export default function CreateEditInvitationPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [ceremonyType, setCeremonyType] = useState(searchParams.get('template') || 'wedding');
  const [hostNames, setHostNames] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('17:00');
  const [timezone, setTimezone] = useState('CET');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [dressCode, setDressCode] = useState('Cocktail & Festive');
  const [dressColors, setDressColors] = useState('#D4AF37, #1E293B, #F8FAFC, #991B1B');
  const [story, setStory] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80');

  // Theme
  const [theme, setTheme] = useState(PRESET_THEMES[0]);

  // Schedule
  const [schedule, setSchedule] = useState([
    { time: '16:00', title: 'Welcome & Welcome Drinks', description: 'Champagne and cocktail appetizers.', icon: 'glass' },
    { time: '17:30', title: 'Main Ceremony', description: 'Official ceremony and heartfelt vows.', icon: 'heart' },
    { time: '19:30', title: 'Gala Dinner & Toasts', description: 'Four-course gastronomic feast.', icon: 'utensils' },
    { time: '22:00', title: 'Celebration & Dance Party', description: 'Music, drinks, and festivities until dawn.', icon: 'sparkles' }
  ]);

  // Registry & Settings
  const [registryTitle, setRegistryTitle] = useState('Wishing Well & Registry');
  const [registryDesc, setRegistryDesc] = useState('Your presence is our gift! However, for those who asked, details are below:');
  const [bankDetails, setBankDetails] = useState('');
  const [allowPlusOnes, setAllowPlusOnes] = useState(true);
  const [maxPlusOnes, setMaxPlusOnes] = useState(2);
  const [showWishesWall, setShowWishesWall] = useState(true);
  const [rsvpDeadline, setRsvpDeadline] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Fetch invitation for editing
  useEffect(() => {
    if (isEditing) {
      const loadInvitation = async () => {
        try {
          const res = await api.getInvitationById(id);
          if (res.success && res.invitation) {
            const inv = res.invitation;
            setTitle(inv.title || '');
            setCeremonyType(inv.ceremonyType || 'wedding');
            setHostNames(inv.hostNames || '');
            setEventDate(inv.eventDate ? inv.eventDate.split('T')[0] : '');
            setEventTime(inv.eventTime || '17:00');
            setTimezone(inv.timezone || 'CET');
            setVenueName(inv.venueName || '');
            setVenueAddress(inv.venueAddress || '');
            setMapUrl(inv.mapUrl || '');
            setDressCode(inv.dressCode || 'Cocktail & Festive');
            setDressColors((inv.dressCodeColors || []).join(', '));
            setStory(inv.story || '');
            setCoverImage(inv.coverImage || '');
            if (inv.theme) setTheme(inv.theme);
            if (inv.schedule && inv.schedule.length > 0) setSchedule(inv.schedule);
            if (inv.registryInfo) {
              setRegistryTitle(inv.registryInfo.title || 'Wishing Well');
              setRegistryDesc(inv.registryInfo.description || '');
              setBankDetails(inv.registryInfo.bankDetails || '');
            }
            if (inv.settings) {
              setAllowPlusOnes(inv.settings.allowPlusOnes !== false);
              setMaxPlusOnes(inv.settings.maxPlusOnes || 2);
              setShowWishesWall(inv.settings.showWishesWall !== false);
              setRsvpDeadline(inv.settings.rsvpDeadline ? inv.settings.rsvpDeadline.split('T')[0] : '');
              setContactEmail(inv.settings.contactEmail || '');
              setContactPhone(inv.settings.contactPhone || '');
            }
          }
        } catch (err) {
          setError(err.message || 'Failed to load invitation details');
        } finally {
          setLoading(false);
        }
      };
      loadInvitation();
    }
  }, [id, isEditing]);

  // Schedule helpers
  const addScheduleItem = () => {
    setSchedule([
      ...schedule,
      { time: '18:00', title: 'New Event Item', description: '', icon: 'clock' }
    ]);
  };

  const removeScheduleItem = (index) => {
    setSchedule(schedule.filter((_, idx) => idx !== index));
  };

  const updateScheduleItem = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !hostNames || !eventDate || !venueName || !venueAddress) {
      setError('Please fill in all mandatory fields: Title, Hosts, Event Date, and Venue.');
      setActiveTab('details');
      return;
    }

    setSaving(true);

    const payload = {
      title,
      ceremonyType,
      hostNames,
      eventDate,
      eventTime,
      timezone,
      venueName,
      venueAddress,
      mapUrl,
      dressCode,
      dressCodeColors: dressColors.split(',').map(c => c.trim()).filter(Boolean),
      story,
      coverImage,
      theme,
      schedule,
      registryInfo: {
        title: registryTitle,
        description: registryDesc,
        bankDetails
      },
      settings: {
        allowPlusOnes,
        maxPlusOnes: parseInt(maxPlusOnes, 10) || 0,
        showWishesWall,
        rsvpDeadline: rsvpDeadline || null,
        contactEmail,
        contactPhone
      },
      status: 'published'
    };

    try {
      if (isEditing) {
        await api.updateInvitation(id, payload);
      } else {
        await api.createInvitation(payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save invitation.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading celebration details...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl glass-card text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-white">
              {isEditing ? 'Edit Celebration' : 'Design Ceremony Invitation'}
            </h1>
            <p className="text-sm text-slate-400">
              Customize event details, luxury color themes, timeline, and RSVP settings.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Invitation'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel border border-white/10">
        {[
          { id: 'details', label: '1. Event Details', icon: Calendar },
          { id: 'theme', label: '2. Theme & Aesthetics', icon: Palette },
          { id: 'schedule', label: '3. Program Itinerary', icon: Clock },
          { id: 'rsvp', label: '4. RSVP & Registry', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Tab 1: Event Details */}
        {activeTab === 'details' && (
          <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white">Ceremony & Venue Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sophia & Alexandre's Royal Wedding Gala"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Ceremony Type *
                </label>
                <select
                  value={ceremonyType}
                  onChange={(e) => setCeremonyType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 capitalize"
                >
                  <option value="wedding">Royal Wedding</option>
                  <option value="graduation">Academic Graduation</option>
                  <option value="gender_reveal">Gender Reveal Party</option>
                  <option value="birthday">Milestone Birthday</option>
                  <option value="baby_shower">Baby Shower</option>
                  <option value="anniversary">Anniversary Celebration</option>
                  <option value="party">VIP Soirée / Gala</option>
                  <option value="other">Other Celebration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Host / Couple Name(s) *
                </label>
                <input
                  type="text"
                  required
                  value={hostNames}
                  onChange={(e) => setHostNames(e.target.value)}
                  placeholder="e.g. Sophia Laurent & Alexandre Dubois"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Start Time & Timezone
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-1/2 px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    placeholder="CET / UTC"
                    className="w-1/2 px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Venue Name *
                </label>
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. Château de Chantilly"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Venue Address *
                </label>
                <input
                  type="text"
                  required
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="e.g. 15 Route des Princes, 60500 Chantilly, France"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Google Maps URL (Optional for 1-tap navigation)
                </label>
                <input
                  type="url"
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Cover / Banner Image URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Our Story / Welcome Message
                </label>
                <textarea
                  rows={4}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="A romantic message, graduation reflection, or event introduction for your guests..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Theme & Aesthetics */}
        {activeTab === 'theme' && (
          <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white">Visual Palette & Dress Code</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Choose Color Palette Preset
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRESET_THEMES.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setTheme(t)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
                      theme.id === t.id
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-white/10 bg-slate-900/60 hover:bg-slate-800'
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs text-slate-400 font-mono">
                        {t.primaryColor} • {t.accentColor}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.primaryColor }}></div>
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.accentColor }}></div>
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.bgColor }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Dress Code Title
                </label>
                <input
                  type="text"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  placeholder="e.g. Black Tie & Champagne Elegance"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Dress Code Color Swatches (Comma separated hex codes)
                </label>
                <input
                  type="text"
                  value={dressColors}
                  onChange={(e) => setDressColors(e.target.value)}
                  placeholder="#D4AF37, #1E293B, #F8FAFC, #991B1B"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Ambient Music MP3 URL (Optional)
                </label>
                <input
                  type="url"
                  value={theme.musicUrl || ''}
                  onChange={(e) => setTheme({ ...theme, musicUrl: e.target.value })}
                  placeholder="https://domain.com/audio/song.mp3"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Leave blank or paste a direct .mp3 link. Guests will see a discrete play/pause audio controller.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Schedule */}
        {activeTab === 'schedule' && (
          <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Event Timeline & Program</h2>
                <p className="text-xs text-slate-400">Add the key moments of your ceremony.</p>
              </div>
              <button
                type="button"
                onClick={addScheduleItem}
                className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Timeline Item
              </button>
            </div>

            <div className="space-y-4">
              {schedule.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="w-24 shrink-0">
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => updateScheduleItem(idx, 'time', e.target.value)}
                      placeholder="17:00"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-amber-300 font-semibold text-xs focus:outline-none focus:border-amber-400 text-center"
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateScheduleItem(idx, 'title', e.target.value)}
                      placeholder="Moment Title (e.g. Ceremony Exchange)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white font-medium text-xs focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateScheduleItem(idx, 'description', e.target.value)}
                      placeholder="Short description..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-slate-400 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeScheduleItem(idx)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: RSVP & Registry */}
        {activeTab === 'rsvp' && (
          <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white">RSVP Rules & Registry Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Allow Plus-Ones
                  </label>
                  <input
                    type="checkbox"
                    checked={allowPlusOnes}
                    onChange={(e) => setAllowPlusOnes(e.target.checked)}
                    className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400"
                  />
                </div>
                {allowPlusOnes && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Max Plus-Ones per Guest</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={maxPlusOnes}
                      onChange={(e) => setMaxPlusOnes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Show Public Wishes Wall
                  </label>
                  <input
                    type="checkbox"
                    checked={showWishesWall}
                    onChange={(e) => setShowWishesWall(e.target.checked)}
                    className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Allows guests' heartfelt messages from RSVPs to be displayed on the invitation page.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  RSVP Deadline Date (Optional)
                </label>
                <input
                  type="date"
                  value={rsvpDeadline}
                  onChange={(e) => setRsvpDeadline(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Host Contact Email / Phone
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-1/2 px-3 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                  />
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 234 567 890"
                    className="w-1/2 px-3 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 pt-4 border-t border-white/10 space-y-4">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-400" /> Wishing Well & Bank Details
                </h3>

                <input
                  type="text"
                  value={registryTitle}
                  onChange={(e) => setRegistryTitle(e.target.value)}
                  placeholder="Title (e.g. Honeymoon Wishing Well)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                />

                <textarea
                  rows={2}
                  value={registryDesc}
                  onChange={(e) => setRegistryDesc(e.target.value)}
                  placeholder="Note to guests..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                />

                <textarea
                  rows={2}
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                  placeholder="IBAN / Bank transfer details / PayPal link..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

            </div>
          </div>
        )}

        {/* Action Button at bottom */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : isEditing ? 'Update Invitation' : 'Publish & Get Link'}
          </button>
        </div>

      </form>

    </div>
  );
}
