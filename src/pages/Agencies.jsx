import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  Percent,
  Layers,
  Send
} from 'lucide-react';

export default function Agencies() {
  const [storeCount, setStoreCount] = useState(25);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [agencyName, setAgencyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [clientTier, setClientTier] = useState('16-50');
  const [platformFocus, setPlatformFocus] = useState('Shopify');

  // Calculator (Pro Plan: $14.95/mo * 25% = $3.7375/mo per store)
  const monthlyEarnings = Math.round(storeCount * 14.95 * 0.25 * 100) / 100;
  const annualEarnings = Math.round(monthlyEarnings * 12);
  const protectedAdSpend = storeCount * 1850 * 12; // Approx $1,850/mo protected per store

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leads = JSON.parse(localStorage.getItem('404killer_agency_leads') || '[]');
      leads.push({
        agencyName,
        contactName,
        email,
        website,
        clientTier,
        platformFocus,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('404killer_agency_leads', JSON.stringify(leads));
    } catch (e) {
      // Ignore storage error
    }

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto relative">
      {/* Background Decor */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-60 left-10 w-80 h-80 bg-blue-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Agency & Performance Partner Program</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
          Protect Your Clients' ROAS. <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Earn 25% Lifetime Recurring Rev-Share.
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          Stop client churn caused by sold-out inventory and broken ad landing pages. Install 404 Killer App across your agency roster and build a compounding monthly revenue stream.
        </p>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <Percent className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white mb-2">25% Recurring Every Month</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Receive 25% of every dollar your client stores pay for the lifetime of their account. Paid automatically every 30 days via direct deposit or Stripe.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white mb-2">Client Retainer Insurance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            When a viral SKU sells out on Friday night, our 50ms sentinel automatically reroutes ad traffic to active in-stock inventory. Zero burned spend, protected ROAS.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white mb-2">Co-Branded Pitch Audits</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Use our Free Storefront Scanner during prospective client pitches to reveal how much ad spend they are currently burning on 404s, helping you close more retainers.
          </p>
        </div>
      </div>

      {/* Interactive Agency Calculator */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-16 shadow-2xl">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Partner Earnings Calculator</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            How Much Will Your Agency Earn?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Slide to select the number of active e-commerce client stores you manage.
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-6">
          <div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-300 mb-2">
              <span>Client Stores Protected</span>
              <span className="text-xl font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                {storeCount} Stores
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={storeCount}
              onChange={(e) => setStoreCount(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
              <span>5 Stores</span>
              <span>50 Stores</span>
              <span>100 Stores</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Passive Agency Monthly Income</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                ${monthlyEarnings.toLocaleString()}
                <span className="text-xs font-semibold text-slate-400"> /mo</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">${annualEarnings.toLocaleString()} ARR passive recurring</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Client Ad Spend Protected</span>
              <div className="text-3xl font-black text-cyan-400 mt-1">
                ${(protectedAdSpend / 1000).toFixed(0)}k
                <span className="text-xs font-semibold text-slate-400"> /yr</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Wasted ad traffic salvaged across your roster</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agency VIP Application Form */}
      <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        {!submitted ? (
          <div>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Apply for Agency VIP Partner Status</h3>
              <p className="text-xs text-slate-400 mt-1">
                Fast-track approval within 24 hours. Get your dedicated agency dashboard & 25% recurring link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Agency Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Media Group"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    required
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-400 transition-all placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-400 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Work Email
                  </label>
                  <input
                    type="email"
                    placeholder="sarah@apexmedia.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-400 transition-all placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Agency Website
                  </label>
                  <input
                    type="text"
                    placeholder="https://apexmedia.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    required
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-400 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Active E-Commerce Clients
                  </label>
                  <select
                    value={clientTier}
                    onChange={(e) => setClientTier(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-400 transition-all"
                  >
                    <option value="1-5">1 – 5 Brands</option>
                    <option value="6-15">6 – 15 Brands</option>
                    <option value="16-50">16 – 50 Brands</option>
                    <option value="50+">50+ Brands (Enterprise Partner)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Primary Store Platform
                  </label>
                  <select
                    value={platformFocus}
                    onChange={(e) => setPlatformFocus(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-400 transition-all"
                  >
                    <option value="Shopify">Shopify / Shopify Plus</option>
                    <option value="WooCommerce">WooCommerce / WordPress</option>
                    <option value="Multi-Platform">Multi-Platform (Shopify, BigComm, etc.)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Submitting Application...' : 'Apply for Agency VIP Status &rarr;'}</span>
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
                <span>⚡ Instant Approval for 10+ Client Agencies</span>
                <span>•</span>
                <span>🔒 Zero Exclusivity Mandates</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Application Received!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{contactName}</strong>. Our partner director will review <strong>{agencyName}</strong> and send your dedicated 25% recurring partner dashboard link to <strong>{email}</strong> within 24 hours.
            </p>
            <div className="pt-4">
              <Link
                to="/audit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                <span>Try the Free Storefront Scanner &rarr;</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
