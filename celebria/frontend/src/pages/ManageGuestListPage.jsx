import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Search,
  ArrowLeft,
  Trash2,
  ExternalLink,
  Utensils,
  Music,
  Mail,
  Phone
} from 'lucide-react';

export default function ManageGuestListPage() {
  const { invitationId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchRsvps = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getEventRsvps(invitationId);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to load guest list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRsvps();
  }, [invitationId]);

  const handleDelete = async (rsvpId, guestName) => {
    if (window.confirm(`Remove RSVP for "${guestName}"?`)) {
      try {
        await api.deleteRsvp(rsvpId);
        setData((prev) => ({
          ...prev,
          rsvps: prev.rsvps.filter((r) => r._id !== rsvpId)
        }));
      } catch (err) {
        alert(err.message || 'Failed to delete RSVP.');
      }
    }
  };

  const handleExportCsv = () => {
    const token = localStorage.getItem('celebria_token');
    const exportUrl = api.exportRsvpsCsvUrl(invitationId);
    
    fetch(exportUrl, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `guests-${data?.invitation?.slug || 'event'}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => alert('Export failed: ' + err.message));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-500">
        Loading guest list and RSVP analytics...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800">
          {error || 'Guest list not found.'}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { analytics, invitation, rsvps } = data;

  const filteredRsvps = (rsvps || []).filter((r) => {
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.email && r.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.dietaryRestrictions && r.dietaryRestrictions.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl border border-stone-200 bg-white text-stone-500 hover:text-stone-900 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
                Guest List & RSVPs
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-champagne-100 text-champagne-800 border border-champagne-300 uppercase tracking-wider font-sans">
                {invitation.ceremonyType}
              </span>
            </div>
            <p className="text-sm text-stone-500 mt-1 flex items-center gap-2 font-serif italic">
              {invitation.title} •{' '}
              <Link
                to={`/invite/${invitation.slug}`}
                target="_blank"
                className="text-champagne-700 hover:text-champagne-800 font-bold inline-flex items-center gap-1 not-italic font-sans text-xs"
              >
                View Public Invite <ExternalLink className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>

        {/* CSV Export */}
        <button
          onClick={handleExportCsv}
          className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <Download className="w-4 h-4 text-champagne-400" />
          Export Guest List (CSV)
        </button>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="p-6 rounded-3xl glass-card space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold font-sans">Total Headcount</span>
          <p className="font-serif text-3xl font-bold text-emerald-700">
            {analytics.totalHeadcount} <span className="text-xs text-stone-500 font-sans font-normal">guests</span>
          </p>
          <p className="text-[11px] text-stone-500">Includes {analytics.totalPlusOnes} plus-ones</p>
        </div>

        <div className="p-6 rounded-3xl glass-card space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold font-sans">Attending Responses</span>
          <p className="font-serif text-3xl font-bold text-stone-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            {analytics.attendingCount}
          </p>
          <p className="text-[11px] text-stone-500">Primary respondents</p>
        </div>

        <div className="p-6 rounded-3xl glass-card space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold font-sans">Declined Responses</span>
          <p className="font-serif text-3xl font-bold text-rose-700 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-600" />
            {analytics.declinedCount}
          </p>
          <p className="text-[11px] text-stone-500">Cannot make it</p>
        </div>

        <div className="p-6 rounded-3xl glass-card space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold font-sans">Total Responses</span>
          <p className="font-serif text-3xl font-bold text-stone-900">
            {analytics.totalResponses}
          </p>
          <p className="text-[11px] text-stone-500">Via digital invitation</p>
        </div>

      </div>

      {/* Dietary Requirements Summary Bar */}
      {analytics.dietarySummary && Object.keys(analytics.dietarySummary).length > 0 && (
        <div className="p-5 rounded-2xl bg-white border border-stone-200 flex flex-wrap items-center gap-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-800 mr-2">
            <Utensils className="w-4 h-4 text-champagne-600" /> Caterer Dietary Summary:
          </div>
          {Object.entries(analytics.dietarySummary).map(([diet, count]) => (
            <span
              key={diet}
              className="px-3 py-1 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800"
            >
              <strong className="text-stone-900 font-bold">{count}x</strong> {diet}
            </span>
          ))}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, dietary..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 placeholder:text-stone-400 text-xs focus:outline-none focus:border-champagne-500 shadow-sm"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-medium self-stretch sm:self-auto justify-center">
          {[
            { id: 'all', label: `All (${rsvps.length})` },
            { id: 'attending', label: `Attending (${analytics.attendingCount})` },
            { id: 'declined', label: `Declined (${analytics.declinedCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                statusFilter === tab.id
                  ? 'bg-white text-stone-900 font-bold shadow-sm'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Guests Table */}
      <div className="rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-card-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 font-bold font-sans">
                <th className="py-4 px-6">Guest</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Party Size</th>
                <th className="py-4 px-6">Dietary Notes</th>
                <th className="py-4 px-6">Wishes & Song</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {filteredRsvps.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-stone-400 font-serif italic">
                    No guest responses match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredRsvps.map((rsvp) => (
                  <tr key={rsvp._id} className="hover:bg-stone-50/60 transition-colors">
                    
                    <td className="py-4 px-6">
                      <p className="font-bold text-stone-900 text-sm">{rsvp.guestName}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 mt-1">
                        {rsvp.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-stone-400" /> {rsvp.email}
                          </span>
                        )}
                        {rsvp.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-stone-400" /> {rsvp.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {rsvp.status === 'attending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Attending
                        </span>
                      ) : rsvp.status === 'declined' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-semibold text-[11px]">
                          <XCircle className="w-3 h-3 text-rose-600" /> Declined
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
                          <Clock className="w-3 h-3 text-amber-600" /> Maybe
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {rsvp.status === 'attending' ? (
                        <div>
                          <p className="font-semibold text-stone-900">
                            {1 + (rsvp.plusOnes || 0)} person{1 + (rsvp.plusOnes || 0) > 1 ? 's' : ''}
                          </p>
                          {rsvp.plusOnes > 0 && (
                            <p className="text-[11px] text-stone-500">
                              +{rsvp.plusOnes} {rsvp.plusOneNames?.length > 0 ? `(${rsvp.plusOneNames.join(', ')})` : 'guest'}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-stone-400">-</span>
                      )}
                    </td>

                    <td className="py-4 px-6 max-w-[180px]">
                      {rsvp.dietaryRestrictions ? (
                        <span className="px-2 py-1 rounded-md bg-stone-100 text-stone-800 border border-stone-200 text-[11px] font-medium inline-block">
                          {rsvp.dietaryRestrictions}
                        </span>
                      ) : (
                        <span className="text-stone-400">None</span>
                      )}
                    </td>

                    <td className="py-4 px-6 max-w-[220px]">
                      {rsvp.wishesMessage && (
                        <p className="italic text-stone-600 truncate font-serif" title={rsvp.wishesMessage}>
                          "{rsvp.wishesMessage}"
                        </p>
                      )}
                      {rsvp.songRequest && (
                        <p className="text-[11px] text-champagne-800 flex items-center gap-1 mt-0.5 font-medium">
                          <Music className="w-3 h-3 shrink-0 text-champagne-600" /> {rsvp.songRequest}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(rsvp._id, rsvp.guestName)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete RSVP"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
