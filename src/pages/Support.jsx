import React, { useState, useEffect } from 'react';
import { 
  EnvelopeIcon, 
  ChatBubbleBottomCenterTextIcon, 
  SparklesIcon,
  CheckCircleIcon,
  TicketIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const DEPARTMENTS = [
  {
    id: 'SUPPORT',
    name: 'Technical Support & Auto-Healer',
    email: 'support@404killer.com',
    icon: '🛠️',
    description: 'Shopify app setup, 301 auto-healing, broken redirect chains & crawler diagnostic questions.'
  },
  {
    id: 'ORDERS',
    name: 'Orders, Invoicing & Billing',
    email: 'orders@404killer.com',
    icon: '💳',
    description: 'Subscription modifications, annual Sentinel invoices ($1,599/yr), and 30-day money-back guarantee processing.'
  },
  {
    id: 'QA',
    name: 'Email Pre-Flight QA Desk',
    email: 'qa@404killer.com',
    icon: '⚡',
    description: 'Forward campaign preview blasts to verify destination HTTP 200 URLs, UTM parameters, and image tags.'
  },
  {
    id: 'PR',
    name: 'Agency VIP & Partnerships',
    email: 'pr@404killer.com',
    icon: '🤝',
    description: '25% lifetime recurring rev-share, co-marketing webinars, multi-brand agency onboarding, and press inquiries.'
  }
];

export default function Support() {
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'track'
  
  // Submit Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    shopDomain: '',
    department: 'SUPPORT',
    subject: '',
    description: '',
    priority: 'NORMAL'
  });
  const [submitting, setSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  // Tracking State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackResults, setTrackResults] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('404killer_recent_tickets') || '[]');
      setRecentTickets(saved);
    } catch (e) {}
  }, []);

  const getApiUrl = (path) => {
    const isDev = window.location.hostname === 'localhost';
    const base = isDev ? 'http://localhost:3000' : 'https://app.404killer.com';
    return `${base}${path}`;
  };

  const saveTicketToLocal = (ticket) => {
    try {
      const existing = JSON.parse(localStorage.getItem('404killer_recent_tickets') || '[]');
      const filtered = existing.filter(t => t.ticketNumber !== ticket.ticketNumber);
      const updated = [ticket, ...filtered].slice(0, 5);
      localStorage.setItem('404killer_recent_tickets', JSON.stringify(updated));
      setRecentTickets(updated);
    } catch (e) {}
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setCreatedTicket(null);

    try {
      const response = await fetch(getApiUrl('/api/tickets'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (data?.success && data?.ticket) {
        setCreatedTicket(data.ticket);
        saveTicketToLocal(data.ticket);
        setForm({
          name: '',
          email: '',
          shopDomain: '',
          department: 'SUPPORT',
          subject: '',
          description: '',
          priority: 'NORMAL'
        });
      } else {
        alert(data?.error || "Unable to submit ticket. Please email support@404killer.com.");
      }
    } catch (err) {
      alert("Network error connecting to ticketing service. Please email support@404killer.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackQuery = async (queryOverride) => {
    const query = queryOverride || trackQuery;
    if (!query.trim()) return;

    setTrackLoading(true);
    setTrackError('');
    setTrackResults(null);

    try {
      const isEmail = query.includes('@');
      const param = isEmail ? `email=${encodeURIComponent(query.trim())}` : `ticketNumber=${encodeURIComponent(query.trim())}`;
      const response = await fetch(getApiUrl(`/api/tickets?${param}`));
      const data = await response.json();

      if (data?.success) {
        if (data.ticket) {
          setTrackResults([data.ticket]);
          saveTicketToLocal(data.ticket);
        } else if (data.tickets && data.tickets.length > 0) {
          setTrackResults(data.tickets);
        } else {
          setTrackError("No tickets found with that ID or email.");
        }
      } else {
        setTrackError(data?.error || "Ticket not found.");
      }
    } catch (err) {
      setTrackError("Failed to reach ticketing service. Please try again shortly.");
    } finally {
      setTrackLoading(false);
    }
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">Open & In Queue</span>;
      case 'INVESTIGATING':
        return <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">Investigating</span>;
      case 'RESOLVED':
        return <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Resolved</span>;
      case 'CLOSED':
        return <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-500/20 text-slate-300 border border-slate-500/30">Closed</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">
            <SparklesIcon className="w-4 h-4" />
            <span>Support Intelligence & Automated Ticketing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-theme leading-tight">
            How Can We <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Help</span> You Today?
          </h1>
          <p className="text-base sm:text-lg text-theme-muted max-w-2xl mx-auto leading-relaxed">
            Every inquiry generates a tracked ticket and routes to our senior engineering desk. We monitor issues 24/7 through to complete resolution.
          </p>
        </div>

        {/* 4 Specialized Department Desks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {DEPARTMENTS.map((dept) => (
            <div key={dept.id} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 backdrop-blur-xl relative flex flex-col justify-between hover:border-emerald-500/40 transition-colors shadow-lg">
              <div>
                <div className="text-2xl mb-2">{dept.icon}</div>
                <h3 className="font-bold text-sm text-theme mb-1">{dept.name}</h3>
                <div className="text-xs font-mono font-semibold text-cyan-400 mb-3">{dept.email}</div>
                <p className="text-xs text-theme-muted leading-relaxed">{dept.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                <span>Forwarded to Lead Desk</span>
                <span className="text-emerald-400 font-bold">24/7 SLA</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Interface: Tabs */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl">
          {/* Tab Selector Bar */}
          <div className="flex border-b border-[var(--card-border)] bg-black/30">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-4 px-6 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'new'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                  : 'text-theme-muted hover:text-theme'
              }`}
            >
              <TicketIcon className="w-5 h-5" />
              <span>1. Open a Tracked Ticket</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`flex-1 py-4 px-6 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'track'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10'
                  : 'text-theme-muted hover:text-theme'
              }`}
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span>2. Track Issue Status</span>
            </button>
          </div>

          <div className="p-6 sm:p-10">
            {/* TAB 1: Open Ticket */}
            {activeTab === 'new' && (
              <div>
                {createdTicket ? (
                  <div className="max-w-xl mx-auto text-center py-8 space-y-6 animate-fade-in">
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10">
                      <CheckCircleIcon className="w-10 h-10" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                        Official Ticket Created
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-black text-theme font-mono mt-1">
                        {createdTicket.ticketNumber}
                      </h2>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-left text-xs space-y-3 max-w-md mx-auto">
                      <div className="flex justify-between pb-2 border-b border-white/5">
                        <span className="text-theme-muted">Department Desk:</span>
                        <strong className="text-cyan-400">{createdTicket.department} Desk</strong>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-white/5">
                        <span className="text-theme-muted">Registered Email:</span>
                        <span className="text-theme font-mono">{createdTicket.email}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-white/5">
                        <span className="text-theme-muted">Status:</span>
                        {getStatusPill(createdTicket.status)}
                      </div>
                      <div className="flex justify-between pb-2 border-b border-white/5">
                        <span className="text-theme-muted">Assigned Routing:</span>
                        <span className="text-emerald-400 font-semibold">devreviq@gmail.com</span>
                      </div>
                      <p className="text-[11px] text-theme-muted pt-2 leading-relaxed">
                        Our senior engineering team has received your ticket logs. You will receive an email update whenever notes or resolutions are posted.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                      <button
                        onClick={() => {
                          setTrackQuery(createdTicket.ticketNumber);
                          setActiveTab('track');
                          handleTrackQuery(createdTicket.ticketNumber);
                        }}
                        className="py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-500/20"
                      >
                        Track Progress Now &rarr;
                      </button>
                      <button
                        onClick={() => setCreatedTicket(null)}
                        className="py-3.5 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-theme font-bold text-xs uppercase tracking-wider transition-colors border border-white/10"
                      >
                        Open Another Ticket
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-6 max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-theme-muted uppercase tracking-wider">
                          Your Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sarah Jenkins"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-theme text-xs placeholder:text-theme-muted focus:outline-none focus:border-cyan-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-theme-muted uppercase tracking-wider">
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="sarah@yourbrand.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-theme text-xs placeholder:text-theme-muted focus:outline-none focus:border-cyan-500/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-theme-muted uppercase tracking-wider">
                          Store Domain / Website
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. yourstore.com"
                          value={form.shopDomain}
                          onChange={(e) => setForm({ ...form, shopDomain: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-theme text-xs placeholder:text-theme-muted focus:outline-none focus:border-cyan-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-theme-muted uppercase tracking-wider">
                          Department Desk
                        </label>
                        <select
                          value={form.department}
                          onChange={(e) => setForm({ ...form, department: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-theme text-xs focus:outline-none focus:border-cyan-500/50"
                        >
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept.id} value={dept.id} className="bg-slate-900 text-white">
                              {dept.icon} {dept.name} ({dept.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-theme-muted uppercase tracking-wider">
                        Issue Subject *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Meta ad landing page returning 404 after product rename"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-theme text-xs placeholder:text-theme-muted focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-theme-muted uppercase tracking-wider">
                        Detailed Description & URLs *
                      </label>
                      <textarea
                        required
                        rows="4"
                        placeholder="Paste broken links, UTM tags, Klaviyo template previews, or describe billing question..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-theme text-xs placeholder:text-theme-muted focus:outline-none focus:border-cyan-500/50 resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? 'Generating Tracked Ticket...' : 'Open Tracked Support Ticket &rarr;'}
                    </button>

                    <div className="flex items-center justify-center gap-4 text-[11px] text-theme-muted pt-1">
                      <span>🔒 SSL Encrypted</span>
                      <span>•</span>
                      <span>⚡ Auto-Forwarded to devreviq@gmail.com</span>
                      <span>•</span>
                      <span>🛡️ Zero Data Reselling</span>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: Track Existing Ticket */}
            {activeTab === 'track' && (
              <div className="max-w-2xl mx-auto space-y-8">
                {/* Search Box */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-theme-muted uppercase tracking-wider block">
                    Search by Ticket ID (TK-404-XXXXX) or Registered Email
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. TK-404-98214 or you@brand.com"
                      value={trackQuery}
                      onChange={(e) => setTrackQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTrackQuery()}
                      className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-theme text-xs placeholder:text-theme-muted focus:outline-none focus:border-amber-500/50 font-mono"
                    />
                    <button
                      onClick={() => handleTrackQuery()}
                      disabled={trackLoading || !trackQuery.trim()}
                      className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/20 shrink-0"
                    >
                      {trackLoading ? 'Searching...' : 'Track Ticket'}
                    </button>
                  </div>
                </div>

                {trackError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                    {trackError}
                  </div>
                )}

                {/* Tracking Results Card */}
                {trackResults && trackResults.length > 0 && (
                  <div className="space-y-6">
                    {trackResults.map((t) => (
                      <div key={t.id || t.ticketNumber} className="bg-black/40 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Ticket Reference</span>
                            <span className="text-2xl font-black font-mono text-theme">{t.ticketNumber}</span>
                          </div>
                          <div>{getStatusPill(t.status)}</div>
                        </div>

                        {/* Interactive Status Progression Timeline */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Resolution Progression</span>
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                            <div className={`p-2 rounded-xl border ${
                              ['OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED'].includes(t.status)
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-white/5 text-slate-500 border-white/5'
                            }`}>
                              1. Received
                            </div>
                            <div className={`p-2 rounded-xl border ${
                              ['INVESTIGATING', 'RESOLVED', 'CLOSED'].includes(t.status)
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : 'bg-white/5 text-slate-500 border-white/5'
                            }`}>
                              2. Triage Desk
                            </div>
                            <div className={`p-2 rounded-xl border ${
                              ['INVESTIGATING', 'RESOLVED', 'CLOSED'].includes(t.status)
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                                : 'bg-white/5 text-slate-500 border-white/5'
                            }`}>
                              3. Engineering
                            </div>
                            <div className={`p-2 rounded-xl border ${
                              ['RESOLVED', 'CLOSED'].includes(t.status)
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-white/5 text-slate-500 border-white/5'
                            }`}>
                              4. Resolved
                            </div>
                          </div>
                        </div>

                        {/* Ticket Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Department</span>
                            <span className="font-bold text-cyan-400 mt-1 block">{t.department} Desk</span>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Priority</span>
                            <span className="font-bold text-theme mt-1 block">{t.priority}</span>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Submitted Date</span>
                            <span className="font-bold text-theme mt-1 block">{new Date(t.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Subject & Description */}
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2 text-xs">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Reported Issue</span>
                          <h4 className="font-bold text-theme text-sm">{t.subject}</h4>
                          <p className="text-theme-muted leading-relaxed whitespace-pre-wrap">{t.description}</p>
                        </div>

                        {/* Engineering Resolution Notes */}
                        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 space-y-2">
                          <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
                            <ClockIcon className="w-4 h-4" />
                            <span>Engineering Update & Resolution Notes</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed italic">
                            {t.resolutionNotes || "This ticket is actively queued for review by our engineering team. Any log updates or configuration fixes will appear here automatically."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recently Viewed on this device */}
                {(!trackResults || trackResults.length === 0) && recentTickets.length > 0 && (
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-3">
                      Recent Tickets Logged on This Device
                    </span>
                    <div className="space-y-2.5">
                      {recentTickets.map((t) => (
                        <button
                          key={t.ticketNumber}
                          onClick={() => {
                            setTrackQuery(t.ticketNumber);
                            handleTrackQuery(t.ticketNumber);
                          }}
                          className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between text-xs cursor-pointer"
                        >
                          <div>
                            <span className="font-mono font-bold text-cyan-400 block text-sm">{t.ticketNumber}</span>
                            <span className="text-theme-muted truncate block max-w-sm sm:max-w-md mt-0.5">{t.subject}</span>
                          </div>
                          {getStatusPill(t.status || 'OPEN')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
