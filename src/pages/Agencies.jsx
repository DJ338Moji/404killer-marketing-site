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
  Send,
  Building,
  Globe
} from 'lucide-react';

export default function Agencies() {
  const [storeCount, setStoreCount] = useState(15);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State: Agency + End-Client Registration
  const [agencyName, setAgencyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientDomain, setClientDomain] = useState('');
  const [platformFocus, setPlatformFocus] = useState('Shopify');

  // Calculator: Enterprise Sentinel MSRP $299/mo * 20% Wholesale Discount = $59.80/mo margin kept per store
  const wholesaleDiscountPerStore = 59.80; // $299 MSRP - $239.20 wholesale price
  const monthlySavings = Math.round(storeCount * wholesaleDiscountPerStore * 100) / 100;
  const annualSavings = Math.round(monthlySavings * 12);
  const protectedAdSpend = storeCount * 3000 * 12; // Approx $3,000/mo ad spend protected per client roster

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
        clientName,
        clientDomain,
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
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-60 left-10 w-80 h-80 bg-blue-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-black uppercase tracking-widest text-cyan-400 mb-4">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Authorized Wholesale Reseller Partner Program</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
          Package Enterprise Reliability. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
            20% Wholesale Discount Off MSRP.
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Stop client churn caused by sold-out inventory and broken ad landing pages. Buy 404 Killer™ enterprise seats at a <strong className="text-cyan-400">20% wholesale discount</strong>, fold them into your monthly agency retainers, and re-bill clients on your own terms.
        </p>

        {/* Wholesale Boundary Callout */}
        <div className="mt-6 max-w-xl mx-auto p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
          <strong className="text-white">Wholesale Policy:</strong> The 20% discount applies strictly to fixed subscription licensing (<strong className="text-cyan-400">$239.20/mo</strong> vs $299/mo MSRP). Ad-block performance recovery (AdSentinel™) operates enterprise-direct.
        </div>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
            <Percent className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white mb-2">20% Wholesale Partner Margin</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            License Enterprise Sentinel for your clients at <strong className="text-white">$239.20/mo</strong> instead of $299/mo MSRP. Bundle it into a $2,500/mo CRO or media retainer and keep the entire margin.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white mb-2">Client Retainer Insurance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            When a viral SKU sells out on Friday night, our &lt;50ms sentinel automatically reroutes ad traffic to active in-stock inventory. Zero burned ad spend, protected client ROAS.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white mb-2">Co-Branded Pitch Audits</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Use our Free Storefront Scanner during prospective client pitches to reveal how much ad spend they are currently burning on 404s, helping your agency close more retainers.
          </p>
        </div>
      </div>

      {/* Agency Wholesale Margin Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-16 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-white tracking-tight">Agency Wholesale Margin Calculator</h3>
            <p className="text-xs text-slate-400 mt-1">
              Based on Enterprise Sentinel MSRP ($299/mo) with your 20% wholesale partner tier ($239.20/mo).
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center text-sm font-bold text-slate-300 mb-2">
              <span>Client Stores Protected</span>
              <span className="text-xl font-black text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20">
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
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
              <span>5 Stores</span>
              <span>50 Stores</span>
              <span>100 Stores</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly Agency Margin Kept</span>
              <div className="text-3xl font-black text-cyan-400 mt-1">
                ${monthlySavings.toLocaleString()}
                <span className="text-xs font-semibold text-slate-400"> /mo</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">${annualSavings.toLocaleString()} ARR wholesale value</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Client Ad Spend Protected</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                ${(protectedAdSpend / 1000).toFixed(0)}k
                <span className="text-xs font-semibold text-slate-400"> /yr</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Wasted ad traffic salvaged across your roster</p>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Portal: Agency & End-Client Registration Form */}
      <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        {!submitted ? (
          <div>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 text-cyan-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Partner Portal: Register Agency &amp; Client</h3>
              <p className="text-xs text-slate-400 mt-1">
                Register your agency and initial client domain to activate your 20% wholesale discount tier.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Agency Info */}
              <div className="border-b border-slate-800 pb-3 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>1. Agency Information</span>
                </span>
              </div>

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
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Agency Contact Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Agency Work Email
                  </label>
                  <input
                    type="email"
                    placeholder="sarah@apexmedia.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-500"
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
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* End-Client Info */}
              <div className="border-b border-slate-800 pb-3 pt-3 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>2. End-Client Storefront Information</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    End-Client Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nomad Goods"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-400 transition-all placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Client Storefront Domain
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. nomadgoods.com"
                    value={clientDomain}
                    onChange={(e) => setClientDomain(e.target.value)}
                    required
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-400 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Client Store Platform
                </label>
                <select
                  value={platformFocus}
                  onChange={(e) => setPlatformFocus(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-400 transition-all"
                >
                  <option value="Shopify">Shopify / Shopify Plus</option>
                  <option value="BigCommerce">BigCommerce</option>
                  <option value="Magento">Magento / Adobe Commerce</option>
                  <option value="WooCommerce">WooCommerce</option>
                  <option value="Custom">Custom Headless / Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Registering Partner & Client...' : 'Register Client Under 20% Wholesale Tier &rarr;'}</span>
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
                <span>⚡ Wholesale Tier Activates Immediately</span>
                <span>•</span>
                <span>🔒 Agency Re-Bills Client Directly</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Partner &amp; Client Registered!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{contactName}</strong>. <strong>{agencyName}</strong> has been registered as an Authorized Wholesale Reseller Partner. <strong>{clientDomain}</strong> is now mapped under your <strong>20% wholesale pricing tier</strong> ($239.20/mo vs $299/mo MSRP).
            </p>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 max-w-sm mx-auto">
              Our partner team has sent your wholesale activation details and deployment instructions to <strong className="text-cyan-400">{email}</strong>.
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setClientName('');
                  setClientDomain('');
                  setSubmitted(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                + Register Another Client Domain
              </button>
              <Link
                to="/audit"
                className="px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold transition-all"
              >
                Scan Client Storefront &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
