import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Sparkles,
  PlusCircle,
  Calendar,
  MapPin,
  Users,
  Eye,
  Edit,
  Trash2,
  Share2,
  QrCode,
  CheckCircle2,
  XCircle,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import QRCodeModal from '../components/QRCodeModal';
import ShareModal from '../components/ShareModal';

export default function DashboardPage() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [selectedForQr, setSelectedForQr] = useState(null);
  const [selectedForShare, setSelectedForShare] = useState(null);

  const fetchInvitations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getMyInvitations();
      if (res.success) {
        setInvitations(res.invitations || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your invitations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also remove all guest RSVPs.`)) {
      try {
        await api.deleteInvitation(id);
        setInvitations(invitations.filter(inv => inv._id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete invitation.');
      }
    }
  };

  // Metrics summary
  const totalInvitations = invitations.length;
  const totalRsvps = invitations.reduce((sum, inv) => sum + (inv.stats?.totalRsvps || 0), 0);
  const totalAttendingGuests = invitations.reduce((sum, inv) => sum + (inv.stats?.totalHeadcount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight flex items-center gap-3">
            Host Dashboard
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Manage your celebrations, track live guest RSVPs, and share your invitation links.
          </p>
        </div>

        <Link
          to="/create"
          className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-champagne-400" />
          Create New Ceremony
        </Link>
      </div>

      {/* Analytics Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-card space-y-2">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-bold font-sans">Active Invitations</span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-4xl font-bold text-stone-900">{totalInvitations}</span>
            <div className="p-2.5 rounded-2xl bg-champagne-100 text-champagne-800">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-card space-y-2">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-bold font-sans">Total RSVP Responses</span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-4xl font-bold text-stone-900">{totalRsvps}</span>
            <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-800">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-card space-y-2">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-bold font-sans">Confirmed Headcount</span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-4xl font-bold text-emerald-700">{totalAttendingGuests}</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Invitations List */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Your Celebrations</h2>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-stone-500 text-sm glass-card rounded-3xl">
            Loading invitations...
          </div>
        ) : invitations.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-card border border-dashed border-stone-300 space-y-4">
            <div className="w-16 h-16 rounded-full bg-champagne-100 text-champagne-800 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">No celebrations created yet</h3>
            <p className="text-sm text-stone-500 max-w-sm mx-auto">
              Start by crafting your first bespoke digital ceremony invitation.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 text-white font-semibold text-sm shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-champagne-400" /> Create First Invitation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invitations.map((inv) => (
              <div
                key={inv._id}
                className="rounded-3xl glass-card overflow-hidden shadow-card-soft hover:shadow-soft-luxury transition-all flex flex-col justify-between border border-stone-200/90 group"
              >
                {/* Card Header with image banner */}
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={inv.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                      alt={inv.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent"></div>
                    
                    {/* Category pill */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 text-xs font-bold text-stone-800 uppercase tracking-wider font-sans">
                        {inv.ceremonyType.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Status pill */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 backdrop-blur-md border border-emerald-300 text-xs font-bold text-emerald-800 capitalize font-sans">
                        {inv.status}
                      </span>
                    </div>

                    {/* Title in image */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-serif text-xl font-bold text-white truncate drop-shadow">
                        {inv.title}
                      </h3>
                      <p className="font-script text-xl text-champagne-200 truncate">
                        {inv.hostNames}
                      </p>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-xs text-stone-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-champagne-600 shrink-0" />
                        <span className="truncate">
                          {new Date(inv.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-champagne-600 shrink-0" />
                        <span className="truncate">{inv.venueName}</span>
                      </div>
                    </div>

                    {/* RSVP Metrics Pillbox */}
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-3 text-center divide-x divide-stone-200">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-bold">Attending</span>
                        <span className="text-sm font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {inv.stats?.attending || 0}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-bold">Headcount</span>
                        <span className="text-sm font-bold text-stone-900 flex items-center justify-center gap-1 mt-0.5">
                          <Users className="w-3.5 h-3.5 text-champagne-700" />
                          {inv.stats?.totalHeadcount || 0}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-bold">Declined</span>
                        <span className="text-sm font-bold text-rose-700 flex items-center justify-center gap-1 mt-0.5">
                          <XCircle className="w-3.5 h-3.5" />
                          {inv.stats?.declined || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-6 pb-6 pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* View RSVP Guest list */}
                    <Link
                      to={`/dashboard/rsvps/${inv._id}`}
                      className="px-3.5 py-2 rounded-xl bg-champagne-50 hover:bg-champagne-100 border border-champagne-200 text-champagne-900 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5 text-champagne-700" />
                      Guest List ({inv.stats?.totalRsvps || 0})
                    </Link>

                    {/* Public Live View */}
                    <Link
                      to={`/invite/${inv.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                      title="Open Public Invitation"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Share Modal */}
                    <button
                      onClick={() => setSelectedForShare(inv)}
                      className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-champagne-700 hover:bg-stone-50 transition-colors"
                      title="Share Invitation"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* QR Code */}
                    <button
                      onClick={() => setSelectedForQr(inv)}
                      className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-champagne-700 hover:bg-stone-50 transition-colors"
                      title="View QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <Link
                      to={`/edit/${inv._id}`}
                      className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                      title="Edit Invitation"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(inv._id, inv.title)}
                      className="p-2 rounded-xl border border-stone-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Invitation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedForQr && (
        <QRCodeModal
          isOpen={!!selectedForQr}
          onClose={() => setSelectedForQr(null)}
          invitationTitle={selectedForQr.title}
          slug={selectedForQr.slug}
        />
      )}

      {selectedForShare && (
        <ShareModal
          isOpen={!!selectedForShare}
          onClose={() => setSelectedForShare(null)}
          invitationTitle={selectedForShare.title}
          slug={selectedForShare.slug}
        />
      )}

    </div>
  );
}