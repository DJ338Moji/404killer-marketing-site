import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  Zap,
  Lock,
  Layers,
  TrendingUp,
  Server,
  Cpu,
  CheckCircle2,
  ArrowRight,
  FileText,
  Clock,
  Sparkles,
  BarChart3,
  Scale,
  Send,
  Eye,
  AlertCircle
} from 'lucide-react';

export default function AdSentinel() {
  // Calculator state: Network pageviews, ad-block rate, average CPM
  const [pageviewsMillions, setPageviewsMillions] = useState(250); // 250M pageviews/mo
  const [adblockRate, setAdblockRate] = useState(32); // 32% blocked
  const [avgCpm, setAvgCpm] = useState(2.80); // $2.80 average CPM
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    monthlyPageviews: '100M - 500M',
    primaryWrapper: 'Prebid / Custom Wrapper',
    notes: ''
  });

  // Economic calculations
  const totalMonthlyImpressions = pageviewsMillions * 1000000 * 3.5; // Avg 3.5 ad slots per pageview
  const blockedMonthlyImpressions = totalMonthlyImpressions * (adblockRate / 100);
  const recoveredMonthlyRevenue = (blockedMonthlyImpressions / 1000) * avgCpm * 0.85; // 85% recovered fill efficiency
  const recoveredAnnualRevenue = recoveredMonthlyRevenue * 12;
  const wrapperAnnualGrossMargin = recoveredAnnualRevenue * 0.20; // 20% typical wrapper tech rev-share

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissions = JSON.parse(localStorage.getItem('adsentinel_qa_requests') || '[]');
      submissions.push({
        ...formData,
        calculatedAnnualRecovery: Math.round(recoveredAnnualRevenue),
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('adsentinel_qa_requests', JSON.stringify(submissions));
    } catch (err) {
      // LocalStorage fallback
    }

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto relative text-theme">
      {/* Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-80 right-10 w-[450px] h-[300px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10"></div>

      {/* Hero Badge */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-5 shadow-sm">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Enterprise Prebid & Ad-Wrapper Edge Infrastructure</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          First-Party Edge Yield Recovery for{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Header-Bidding Wrappers
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-theme-muted max-w-3xl mx-auto leading-relaxed">
          Stop losing <span className="text-white font-semibold">25% to 45%+</span> of your network's desktop and gaming impressions to client-side ad blockers. Recover full-yield Prebid auctions at the origin edge without layout shifts, latency penalties, or EasyList exposure.
        </p>

        {/* Patent Verification Callout */}
        <div className="mt-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs sm:text-sm text-slate-300 backdrop-blur-md">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Protected under active issued <strong className="text-white">U.S. Patent 11,805,132 B2</strong> (Granted Oct 31, 2023)
          </span>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <span className="hidden sm:inline-block text-emerald-400 font-semibold">100% Origin-Based Execution</span>
        </div>
      </div>

      {/* Value Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="p-7 rounded-2xl bg-[var(--card-bg)]/80 border border-[var(--card-border)] hover:border-cyan-500/40 transition-all shadow-xl relative group">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Native Prebid.js Integration</h3>
          <p className="text-sm text-theme-muted leading-relaxed">
            Feeds recovered ad calls directly into your existing Prebid auction pipeline. No changes to publisher tag management, no new SDK bloat, and sub-15ms origin execution.
          </p>
        </div>

        <div className="p-7 rounded-2xl bg-[var(--card-bg)]/80 border border-[var(--card-border)] hover:border-emerald-500/40 transition-all shadow-xl relative group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Immune to Client Filters</h3>
          <p className="text-sm text-theme-muted leading-relaxed">
            Circumvents uBlock Origin, Brave Shields, and Safari Content Blockers via proprietary client-side tamper-proofing and first-party domain routing.
          </p>
        </div>

        <div className="p-7 rounded-2xl bg-[var(--card-bg)]/80 border border-[var(--card-border)] hover:border-teal-500/40 transition-all shadow-xl relative group">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5 group-hover:scale-110 transition-transform">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">5% Synthetic Control Holdout</h3>
          <p className="text-sm text-theme-muted leading-relaxed">
            Mathematical proof of 100% incremental yield. We hold back 5% of ad-blocked traffic as an un-monetized baseline, verified directly inside your Google Ad Manager (GAM) ledger.
          </p>
        </div>
      </div>

      {/* Proprietary Wrapper Index Impact Section */}
      <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-500/20 mb-20 shadow-2xl">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Benchmark Index Acceleration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Directly Elevating Your Proprietary Yield Metrics
          </h2>
          <p className="text-theme-muted leading-relaxed">
            Every major ad-wrapper tracks a proprietary efficiency metric. Because client-side blockers silence up to 45% of impression opportunities, your headline metrics remain artificially suppressed. AdSentinel™ eliminates the structural blind spot.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs uppercase font-bold tracking-wider text-cyan-400 mb-1">Playwire Network</div>
            <div className="text-2xl font-black text-white mb-2">PEI Lift: +20% to +35%</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lifts Publisher Efficiency Index from the stubborn ~0.55 floor up to 0.75+ by recovering unmonetized opportunities without adding ad clutter or latency.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-400 mb-1">Ezoic Publishers</div>
            <div className="text-2xl font-black text-white mb-2">EPMV Expansion</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Converts zero-revenue visits into monetized sessions, lifting aggregate Earnings Per Thousand Visitors (EPMV) across desktop and tech traffic.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs uppercase font-bold tracking-wider text-teal-400 mb-1">Mediavine & Raptive</div>
            <div className="text-2xl font-black text-white mb-2">Session RPM Defense</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eliminates zero-dollar desktop sessions on Safari and Chrome, restoring multi-page session monetization and Prebid bid density.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs uppercase font-bold tracking-wider text-amber-400 mb-1">Sovrn & Freestar</div>
            <div className="text-2xl font-black text-white mb-2">Signal & Velocity</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monetizes your most engaged, technical readers (who block ads) and eliminates script-timeout penalties that depress auction velocity.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Network Yield Recovery Calculator */}
      <div className="p-8 md:p-12 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] mb-20 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
            <span>ROI Model</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Calculate Your Network's Unclaimed Yield
          </h2>
          <p className="text-theme-muted leading-relaxed">
            Estimate how much incremental publisher revenue and wrapper tech margin is currently lost to client-side ad blockers across your network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Sliders */}
          <div className="lg:col-span-7 space-y-7">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-white">Monthly Network Pageviews</label>
                <span className="text-sm font-black text-cyan-400">{pageviewsMillions} Million / mo</span>
              </div>
              <input
                type="range"
                min="25"
                max="1000"
                step="25"
                value={pageviewsMillions}
                onChange={(e) => setPageviewsMillions(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>25M (Mid-Tier)</span>
                <span>250M (Top 10 Wrapper)</span>
                <span>1B+ (Global Network)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-white">Ad-Blocker Exposure Rate</label>
                <span className="text-sm font-black text-emerald-400">{adblockRate}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="55"
                step="1"
                value={adblockRate}
                onChange={(e) => setAdblockRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>15% (Mobile Lifestyle)</span>
                <span>32% (News & Desktop)</span>
                <span>50%+ (Gaming & Tech)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-white">Blended Programmatic eCPM</label>
                <span className="text-sm font-black text-teal-300">${avgCpm.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.00"
                max="6.00"
                step="0.10"
                value={avgCpm}
                onChange={(e) => setAvgCpm(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-300"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>$1.00 (Standard Display)</span>
                <span>$2.80 (Rich Media / Display)</span>
                <span>$6.00+ (High-Impact / Video)</span>
              </div>
            </div>
          </div>

          {/* Output Card */}
          <div className="lg:col-span-5 p-7 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 text-center shadow-xl">
            <div className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">
              Recoverable Annual Network Yield
            </div>
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text mb-4">
              ${(recoveredAnnualRevenue / 1000000).toFixed(2)}M<span className="text-xl text-slate-400 font-medium">/yr</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 mb-6 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Recovered Gross:</span>
                <span className="text-white font-bold">${Math.round(recoveredMonthlyRevenue).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Wrapper Tech Margin (+20% rev-share):</span>
                <span className="text-emerald-400 font-bold">+${Math.round(wrapperAnnualGrossMargin / 12).toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Setup & Integration Fee:</span>
                <span className="text-cyan-400 font-bold">$0.00 (Zero Out-of-Pocket)</span>
              </div>
            </div>

            <a
              href="#sandbox-qa"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              <span>Schedule 48-Hr Sandbox QA</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Engineering Staging & Sandbox Protocol */}
      <div className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
            <Server className="w-3.5 h-3.5" />
            <span>Deployment Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Zero-Risk Engineering Staging Protocol
          </h2>
          <p className="text-theme-muted leading-relaxed">
            We eliminate production risk entirely. Your engineering team validates payload integrity and latency in a private staging sandbox before a single live reader is touched.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] relative">
            <div className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-2">Phase 1: 48 Hours</div>
            <h3 className="text-lg font-bold text-white mb-2">Headless Staging QA</h3>
            <p className="text-sm text-theme-muted leading-relaxed mb-4">
              Gated via test query parameter (<code className="text-cyan-300">?adsentinel_test=1</code>) on 1 staging property. Your engineering team inspects Prebid payload delivery and verifies sub-15ms origin latency. Zero public traffic exposure.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full Engineering Sign-Off</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] relative">
            <div className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-2">Phase 2: 14 Days</div>
            <h3 className="text-lg font-bold text-white mb-2">Canary Pilot (2 Properties)</h3>
            <p className="text-sm text-theme-muted leading-relaxed mb-4">
              Deployed on 2 high-adblock properties with a strict 5% unmonetized control holdout. Incremental revenue is measured and proven directly inside your Google Ad Manager (GAM) ledger.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Mathematical Proof of Lift</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] relative">
            <div className="text-xs font-black text-teal-300 uppercase tracking-wider mb-2">Phase 3: Rollout</div>
            <h3 className="text-lg font-bold text-white mb-2">Network-Wide Activation</h3>
            <p className="text-sm text-theme-muted leading-relaxed mb-4">
              Automated rollout across publisher properties. $0 setup fee, $0 platform fee, and a simple 15% performance fee on verified recovered revenue only. Also bundles 404 Killer™ URL Sentinel complimentary.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Pure Incremental Margin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gated Sandbox QA & NDA Request Form */}
      <div id="sandbox-qa" className="p-8 md:p-12 rounded-3xl bg-slate-900/90 border border-cyan-500/30 max-w-3xl mx-auto shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mutual NDA Gated Access</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">
            Request 48-Hour Sandbox QA & Technical Briefing
          </h2>
          <p className="text-sm text-theme-muted">
            Due to our active patent and proprietary edge orchestration, full technical architecture and yield models are shared under standard 1-page mutual NDA.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Sandbox QA Request Received</h3>
            <p className="text-sm text-slate-300 mb-4">
              Thank you, {formData.name || 'Partner'}. A standard 1-page Mutual NDA and staging credentials will be delivered to <strong className="text-white">{formData.email}</strong> within 4 business hours.
            </p>
            <div className="text-xs text-slate-500">
              Direct Contact: Dale Johnson | djohnson@404killer.com | (435) 962-4444
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Executive / Engineering Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jayson Dubin / Frank A."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CEO, CTO, VP Engineering"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Wrapper / Ad Network Company *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Playwire, Freestar, Raptive"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Network Volume</label>
                <select
                  value={formData.monthlyPageviews}
                  onChange={(e) => setFormData({ ...formData, monthlyPageviews: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="Under 50M">Under 50M Pageviews/mo</option>
                  <option value="50M - 200M">50M - 200M Pageviews/mo</option>
                  <option value="200M - 500M">200M - 500M Pageviews/mo</option>
                  <option value="500M - 1B+">500M - 1B+ Pageviews/mo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Wrapper Stack</label>
                <select
                  value={formData.primaryWrapper}
                  onChange={(e) => setFormData({ ...formData, primaryWrapper: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="Prebid.js (Client-Side)">Prebid.js (Client-Side)</option>
                  <option value="Prebid Server / Hybrid">Prebid Server / Hybrid</option>
                  <option value="Amazon TAM / UAM">Amazon TAM / UAM</option>
                  <option value="Google Open Bidding">Google Open Bidding</option>
                  <option value="Proprietary Wrapper">Proprietary In-House Wrapper</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Staging / Pilot Requirements or Notes</label>
              <textarea
                rows={3}
                placeholder="Specific inventory types (e.g. gaming, tech, finance), current adblock exposure, or staging questions..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Generating Staging Request...</span>
              ) : (
                <>
                  <span>Request 48-Hour Staging Sandbox & Mutual NDA</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-slate-500 pt-2">
              All communications are strictly confidential. Governed by standard 1-page mutual NDA. DevRevIQ, LLC.
            </div>
          </form>
        )}
      </div>

      {/* Footer Signature Block */}
      <div className="mt-16 text-center text-xs text-theme-muted border-t border-[var(--card-border)] pt-8">
        <p className="text-slate-400 mb-1">
          <strong className="text-white">AdSentinel™</strong> & <strong className="text-white">404 Killer™</strong> are proprietary assets of <strong className="text-white">DevRevIQ, LLC</strong>.
        </p>
        <p className="text-slate-500">
          U.S. Patent 11,805,132 B2 | Mojipass® Registered Trademark | Direct: djohnson@404killer.com | (435) 962-4444
        </p>
      </div>
    </div>
  );
}
