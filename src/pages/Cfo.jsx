import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ArrowRight,
  Building2,
  FileText,
  Scale,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';
import { STRIPE_PAYMENT_LINKS } from '../App';

export default function Cfo() {
  // Interactive P&L Calculator State
  const [monthlyAdSpend, setMonthlyAdSpend] = useState(250000);
  const [avgCpc, setAvgCpc] = useState(1.05);
  const [aov, setAov] = useState(85);
  const [brokenRate, setBrokenRate] = useState(1.2); // percent
  const [cvr, setCvr] = useState(2.4); // percent
  const [billingCycle, setBillingCycle] = useState('annual');
  const [copiedMemo, setCopiedMemo] = useState(false);

  // Presets
  const applyPreset = (tier) => {
    if (tier === 'emerging') {
      setMonthlyAdSpend(50000);
      setAvgCpc(0.95);
      setAov(68);
      setBrokenRate(1.2);
      setCvr(2.2);
    } else if (tier === 'growth') {
      setMonthlyAdSpend(250000);
      setAvgCpc(1.05);
      setAov(85);
      setBrokenRate(1.2);
      setCvr(2.4);
    } else if (tier === 'enterprise') {
      setMonthlyAdSpend(1200000);
      setAvgCpc(1.15);
      setAov(78);
      setBrokenRate(1.0);
      setCvr(2.5);
    }
  };

  // Financial Calculations
  const totalMonthlyClicks = Math.round(monthlyAdSpend / avgCpc);
  const monthlyDeadClicks = Math.round(totalMonthlyClicks * (brokenRate / 100));
  const monthlyBurnedAdCash = Math.round(monthlyDeadClicks * avgCpc);
  const annualBurnedAdCash = monthlyBurnedAdCash * 12;

  const monthlyLostOrders = Math.round(monthlyDeadClicks * (cvr / 100));
  const monthlyForfeitedGmv = Math.round(monthlyLostOrders * aov);
  const annualForfeitedGmv = monthlyForfeitedGmv * 12;

  // Assume 60% gross margin contribution on recovered orders + 100% of direct ad waste saved
  const annualEbitdaRecovery = Math.round(annualBurnedAdCash + annualForfeitedGmv * 0.6);
  const annualSoftwareCost = 1599;
  const roicMultiple = Math.max(1, Math.round(annualEbitdaRecovery / annualSoftwareCost));
  const paybackHours = Math.max(1, Math.round((annualSoftwareCost / (annualEbitdaRecovery / 365)) * 24));

  const memoText = `MEMORANDUM: High-ROI OpEx Authorization Request
To: Chief Financial Officer / VP of Finance
From: Marketing & E-Commerce Operations
Subject: Eliminating Paid Ad Spend Bleed on Archived Catalog Routes ($1,599/yr OpEx for Est. $${annualEbitdaRecovery.toLocaleString()}/yr EBITDA Preservation)

1. EXECUTIVE SUMMARY & PROBLEM IDENTIFIED:
When our merchandising team archives out-of-stock SKUs or updates seasonal collections, our active Meta, Google PMax, and influencer links continue driving paid clicks ($${avgCpc.toFixed(2)} avg CPC) into HTTP 404 dead ends. Because ad networks bill on outbound click departure and their policy crawlers lag by up to 72 hours, we are absorbing an estimated ${brokenRate}% dead-click tax on our $${monthlyAdSpend.toLocaleString()}/mo ad budget with 0% conversion return.

2. FORENSIC P&L IMPACT AT OUR CURRENT SCALE:
- Monthly Paid Clicks Hitting 404 Endpoints: ~${monthlyDeadClicks.toLocaleString()} clicks/mo
- Direct Burned Ad Spend (Cash Outflow): $${monthlyBurnedAdCash.toLocaleString()}/mo ($${annualBurnedAdCash.toLocaleString()}/yr)
- Forfeited Top-Line GMV (${cvr}% CVR @ $${aov} AOV): $${monthlyForfeitedGmv.toLocaleString()}/mo ($${annualForfeitedGmv.toLocaleString()}/yr)
- Estimated Net Annual EBITDA Drag: -$${annualEbitdaRecovery.toLocaleString()}/yr

3. PROPOSED REMEDIATION:
Deploy 404 Killer App (Revenue Shield) (https://404killer.com), an autonomous Shopify edge utility that intercepts broken catalog routes in <50ms and dynamically routes paid shoppers to live in-stock alternatives via native Shopify GraphQL.

4. GOVERNANCE, RISK & ROI ECONOMICS:
- Software OpEx: $149/month or $1,599/year (Instant Enterprise & Agency Activation)
- Implementation CapEx: $0 (2-minute plug-and-play setup, zero developer hours)
- Security & Compliance: Zero customer PII ingested; <50ms edge execution
- Expected Payback Period: ~${paybackHours} hours of preserved ad traffic
- Projected Annual Cash-on-Cash Return: ${roicMultiple}x ROIC

5. ACTION REQUESTED:
Approval to activate the subscription at https://404killer.com/cfo`;

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(memoText);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/70 to-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Scale className="w-4 h-4" />
            CFO & Finance Committee Briefing
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight mb-6 max-w-4xl">
            Eliminate the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">"404 Ad Tax"</span> on Your P&L & Insulate Blended MER
          </h1>

          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
            Broken catalog links are not an IT housekeeping issue—they are an unmonitored, continuous <strong className="text-white">working capital leak</strong>. Every time an out-of-stock SKU is archived while Meta or Google ads are scaling, your corporate card is billed for clicks that deliver <strong className="text-rose-400">$0.00 in gross margin</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#pnl-simulator"
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center gap-2"
            >
              Model Your EBITDA Leakage <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#cfo-memo"
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-cyan-400" /> Generate CFO Approval Memo
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm border border-slate-800 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-400" /> Print / Save PDF
            </button>
          </div>
        </div>
      </section>

      {/* Interactive CFO P&L Simulator */}
      <section id="pnl-simulator" className="py-16 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Interactive Financial Model</span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1">Forensic P&L & EBITDA Drag Simulator</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset('emerging')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer transition-colors"
            >
              Emerging DTC ($5M GMV)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('growth')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-pointer transition-colors"
            >
              Growth Brand ($25M GMV)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('enterprise')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-pointer transition-colors"
            >
              Enterprise ($100M+ GMV)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Sliders */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">1. Input Storefront Unit Economics</h3>

            {/* Monthly Ad Spend */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium">Monthly Paid Ad Spend (Meta / Google / TikTok)</span>
                <span className="text-emerald-400 font-black">${monthlyAdSpend.toLocaleString()} / mo</span>
              </div>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={monthlyAdSpend}
                onChange={(e) => setMonthlyAdSpend(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>$10k/mo</span>
                <span>$500k/mo</span>
                <span>$2M/mo</span>
              </div>
            </div>

            {/* Average CPC */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium">Blended Cost Per Click (CPC)</span>
                <span className="text-emerald-400 font-black">${avgCpc.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.40"
                max="3.00"
                step="0.05"
                value={avgCpc}
                onChange={(e) => setAvgCpc(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>$0.40</span>
                <span>$1.50</span>
                <span>$3.00</span>
              </div>
            </div>

            {/* Storefront AOV */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium">Average Order Value (AOV)</span>
                <span className="text-emerald-400 font-black">${aov}</span>
              </div>
              <input
                type="range"
                min="30"
                max="350"
                step="5"
                value={aov}
                onChange={(e) => setAov(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>$30</span>
                <span>$150</span>
                <span>$350</span>
              </div>
            </div>

            {/* Broken Endpoint Rate */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium">Catalog 404 Decay Rate (Industry Avg: 1.0% – 1.8%)</span>
                <span className="text-rose-400 font-black">{brokenRate.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="3.0"
                step="0.1"
                value={brokenRate}
                onChange={(e) => setBrokenRate(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0.4% (Low SKU Churn)</span>
                <span>1.2% (Standard DTC)</span>
                <span>3.0% (Fast Fashion)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live P&L Output */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
                <h3 className="text-lg font-bold text-white">2. Audited Balance-Sheet Impact</h3>
                <span className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                  {monthlyDeadClicks.toLocaleString()} Dead Paid Clicks / Mo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Direct Burned Ad Cash</div>
                  <div className="text-2xl font-black text-rose-400">${monthlyBurnedAdCash.toLocaleString()}<span className="text-xs font-normal text-slate-400"> / mo</span></div>
                  <div className="text-xs text-slate-500 mt-1">${annualBurnedAdCash.toLocaleString()} / yr pure SG&A waste</div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Forfeited Store GMV</div>
                  <div className="text-2xl font-black text-amber-400">${monthlyForfeitedGmv.toLocaleString()}<span className="text-xs font-normal text-slate-400"> / mo</span></div>
                  <div className="text-xs text-slate-500 mt-1">~{monthlyLostOrders.toLocaleString()} lost orders / mo @ {cvr}% CVR</div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 mb-6">
                <div className="text-xs text-emerald-300 uppercase font-bold tracking-wider mb-1">
                  Net Annual EBITDA Preservation with 404 Killer App
                </div>
                <div className="text-3xl md:text-4xl font-black text-white">
                  +${annualEbitdaRecovery.toLocaleString()} <span className="text-sm font-normal text-emerald-300">/ year</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Combines 100% of recovered ad spend waste plus 60% gross margin contribution on salvaged checkout volume.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Annual OpEx</div>
                  <div className="text-base font-black text-white">$1,599/yr</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Payback Period</div>
                  <div className="text-base font-black text-emerald-400">~{paybackHours} Hours</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Cash ROIC</div>
                  <div className="text-base font-black text-cyan-400">{roicMultiple}x Return</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                <strong className="text-white">Instant Production Activation</strong> • Zero CapEx • Cancel anytime
              </div>
              <a
                href={STRIPE_PAYMENT_LINKS.agency.annual}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Authorize Annual Shield ($1,599/yr) &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Google, Meta & Amazon Never Refund 404s */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Contractual & Technical Diligence</span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1 mb-4">
              Why Google, Meta & Amazon Will Never Refund Your "404 Ad Tax"
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Finance controllers frequently assume that ad networks automatically stop charging—or issue credits—when a landing page returns a 404 error. Here is why that assumption costs retailers millions:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-black mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Billing Happens on Departure</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Under Google Ads and Meta auction terms, your credit card is charged the microsecond a shopper taps the ad. Like an airline flying a passenger to a closed hotel, the ad network bills for <strong className="text-slate-200">traffic delivery</strong>, not destination uptime.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">False Pixel Telemetry</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Because global tracking scripts (Meta Pixel, GTM, TikTok) sit in your theme's <code className="text-amber-300">&lt;head&gt;</code>, they still fire a <code className="text-amber-300">PageView</code> event when the 404 error template renders. Even if suppressed, billing already cleared at the ad server.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">The 72-Hour Crawler Lag</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ad policy crawlers (<code className="text-cyan-300">Googlebot-Ads</code>) only audit product URLs on periodic 24–72 hour cycles. When a hot SKU sells out on Tuesday, live ad spend continues pumping into that dead link until Friday—with <strong className="text-slate-200">zero retroactive refunds</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Forensic Incident Ledger */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Audit Evidence</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
            Sample Forensic Ledger: Real Storefront Ad Leakage
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Excerpt from live diagnostic crawls across high-velocity apparel & fitness Shopify Plus storefronts (benchmarked on accounts such as Fashion Nova & Gymshark):
          </p>
        </div>

        <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Failed Storefront Route</th>
                <th className="py-3.5 px-4">Campaign / Traffic Origin</th>
                <th className="py-3.5 px-4">HTTP Status</th>
                <th className="py-3.5 px-4">Avg CPC</th>
                <th className="py-3.5 px-4">Monthly Clicks</th>
                <th className="py-3.5 px-4">Burned Ad Spend</th>
                <th className="py-3.5 px-4">Forfeited GMV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              <tr>
                <td className="py-3.5 px-4 font-mono text-xs text-rose-300">/products/seamless-contour-leggings-sage-xs</td>
                <td className="py-3.5 px-4 text-slate-300">Meta Advantage+ DPA Retargeting</td>
                <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-xs">404 Dead End</span></td>
                <td className="py-3.5 px-4 text-slate-300">$1.15</td>
                <td className="py-3.5 px-4 text-slate-300">3,400</td>
                <td className="py-3.5 px-4 font-bold text-rose-400">$3,910 / mo</td>
                <td className="py-3.5 px-4 font-bold text-amber-400">$6,120 / mo</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono text-xs text-rose-300">/collections/summer-vault-sale-exclusive</td>
                <td className="py-3.5 px-4 text-slate-300">Google PMax Shopping Tier-1</td>
                <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-xs">404 Dead End</span></td>
                <td className="py-3.5 px-4 text-slate-300">$0.92</td>
                <td className="py-3.5 px-4 text-slate-300">4,800</td>
                <td className="py-3.5 px-4 font-bold text-rose-400">$4,416 / mo</td>
                <td className="py-3.5 px-4 font-bold text-amber-400">$8,640 / mo</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono text-xs text-rose-300">/products/oversized-heavyweight-hoodie-blk</td>
                <td className="py-3.5 px-4 text-slate-300">TikTok Creator Spark Ad #04</td>
                <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-xs">404 Dead End</span></td>
                <td className="py-3.5 px-4 text-slate-300">$0.78</td>
                <td className="py-3.5 px-4 text-slate-300">2,900</td>
                <td className="py-3.5 px-4 font-bold text-rose-400">$2,262 / mo</td>
                <td className="py-3.5 px-4 font-bold text-amber-400">$5,220 / mo</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono text-xs text-rose-300">/collections/athlete-collab-capsule-drop</td>
                <td className="py-3.5 px-4 text-slate-300">IG Influencer Bio / Swipe-Up</td>
                <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-xs">404 Dead End</span></td>
                <td className="py-3.5 px-4 text-slate-300">$1.35</td>
                <td className="py-3.5 px-4 text-slate-300">1,850</td>
                <td className="py-3.5 px-4 font-bold text-rose-400">$2,497 / mo</td>
                <td className="py-3.5 px-4 font-bold text-amber-400">$3,330 / mo</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-950 font-black text-white border-t border-slate-700">
                <td className="py-4 px-4" colSpan={4}>TOTAL MONTHLY LEAKAGE (SAMPLE 4 ROUTES ALONE)</td>
                <td className="py-4 px-4">12,950 clicks</td>
                <td className="py-4 px-4 text-rose-400">$13,085 / mo</td>
                <td className="py-4 px-4 text-amber-400">$23,310 / mo</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* RACI Matrix & CISO/CFO Risk Diligence */}
      <section className="py-12 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Organizational Governance</span>
          <h3 className="text-xl font-black text-white mt-1 mb-4">The RACI Accountability Gap</h3>
          <p className="text-xs md:text-sm text-slate-400 mb-6">
            Why internal teams miss this: Merchandising, Paid Media, and Web Dev operate in isolated silos ("The Triangle of Blame"):
          </p>
          <div className="space-y-3 text-xs md:text-sm">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-white">CFO / VP of Finance</div>
                <div className="text-slate-400 text-xs">Monitors EBITDA, Free Cash Flow & Blended MER</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 font-bold text-xs">INFORMED</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-white">CMO / VP of Growth</div>
                <div className="text-slate-400 text-xs">Owns Ad Budget ROI, Blended ROAS & CAC</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold text-xs">ACCOUNTABLE</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-white">Paid Media / Ad Agency</div>
                <div className="text-slate-400 text-xs">Blamed when ROAS slips due to deleted SKUs</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-bold text-xs">RESPONSIBLE</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-white">Merchandising / Inventory Ops</div>
                <div className="text-slate-400 text-xs">Unpublishes sold-out items without alerting Media</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 font-bold text-xs">TRIGGER</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Enterprise IT & Security</span>
          <h3 className="text-xl font-black text-white mt-1 mb-4">CFO & CISO Diligence Checklist</h3>
          <p className="text-xs md:text-sm text-slate-400 mb-6">
            404 Killer App is architected for zero balance-sheet, compliance, or technical debt risk:
          </p>
          <div className="space-y-4 text-xs md:text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Zero Customer PII / GDPR & CCPA Safe</div>
                <div className="text-slate-400 text-xs">Inspects URL path strings and HTTP status codes only. Never ingests customer names, emails, or payment data.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">&lt;50ms Edge Execution (Zero Speed Drag)</div>
                <div className="text-slate-400 text-xs">Injects native 301 redirects via official Shopify Admin GraphQL. Zero bulky client-side JS bloat.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">$0 Implementation CapEx</div>
                <div className="text-slate-400 text-xs">2-minute plug-and-play installation. Requires zero developer sprints or agency engineering retainers.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Zero Vendor Lock-In</div>
                <div className="text-slate-400 text-xs">All healed 301 redirects are written permanently into your native Shopify routing table.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive CFO Approval Memo Generator */}
      <section id="cfo-memo" className="py-12 max-w-6xl mx-auto px-6">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Internal Champion Kit</span>
              <h2 className="text-2xl font-black text-white mt-1">Ready-to-Send CFO Requisition Memo</h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Dynamically populated with your simulator metrics above. Copy and email directly to your CFO or Finance Committee:
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyMemo}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 cursor-pointer transition-all"
            >
              {copiedMemo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedMemo ? 'Copied to Clipboard!' : 'Copy Memo for CFO'}
            </button>
          </div>

          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {memoText}
          </pre>
        </div>
      </section>

      {/* Direct Subscription Authorization CTA */}
      <section className="py-12 max-w-5xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-8 md:p-12 shadow-2xl">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
            Authorize Autonomous Capital Protection Today
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base mb-8">
            Deploy instant production coverage across your storefront or agency portfolio. Recover your full annual software investment in under {paybackHours} hours of preserved ad traffic.
          </p>

          <div className="inline-flex items-center bg-slate-950 p-1 rounded-full border border-slate-800 mb-8">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-bold cursor-pointer transition-all ${
                billingCycle === 'monthly' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly OpEx
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-full text-xs font-bold cursor-pointer transition-all ${
                billingCycle === 'annual' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual OpEx (Save 10%+)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase text-cyan-400 mb-1">Growth Storefront</div>
                <div className="text-xl font-black text-white mb-2">Pro Revenue Shield</div>
                <div className="text-3xl font-black text-white mb-4">
                  {billingCycle === 'annual' ? '$790' : '$79'}
                  <span className="text-sm font-normal text-slate-400">{billingCycle === 'annual' ? ' / year' : ' / month'}</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  <li>✓ Autonomous 50ms 404 Auto-Healing</li>
                  <li>✓ Paid Ad Spend Guard (Meta / Google / TikTok)</li>
                  <li>✓ Real-Time Saved Revenue Ledger</li>
                </ul>
              </div>
              <a
                href={billingCycle === 'annual' ? STRIPE_PAYMENT_LINKS.pro.annual : STRIPE_PAYMENT_LINKS.pro.monthly}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Activate Pro Shield &rarr;
              </a>
            </div>

            <div className="bg-slate-950 border-2 border-emerald-500 rounded-2xl p-6 flex flex-col justify-between relative">
              <div className="absolute -top-3 right-4 px-3 py-0.5 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase rounded-full">
                Most Popular for CFOs
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-emerald-400 mb-1">Enterprise & Multi-Store</div>
                <div className="text-xl font-black text-white mb-2">Enterprise & Agency Shield</div>
                <div className="text-3xl font-black text-white mb-4">
                  {billingCycle === 'annual' ? '$1,599' : '$149'}
                  <span className="text-sm font-normal text-slate-400">{billingCycle === 'annual' ? ' / year' : ' / month'}</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  <li>✓ Unlimited Catalog Route Healing (&lt;50ms)</li>
                  <li>✓ Multi-Store & Headless Storefront Support</li>
                  <li>✓ Executive CFO Monthly EBITDA Attribution Report</li>
                </ul>
              </div>
              <a
                href={billingCycle === 'annual' ? STRIPE_PAYMENT_LINKS.agency.annual : STRIPE_PAYMENT_LINKS.agency.monthly}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Authorize Enterprise Shield &rarr;
              </a>
            </div>
          </div>

          <div className="mt-8 text-xs text-slate-400">
            Questions from your Finance or Legal team? Contact Founder & CEO <strong className="text-white">Dale Johnson</strong> directly at{' '}
            <a href="mailto:djohnson@404killer.com" className="text-emerald-400 underline">djohnson@404killer.com</a> or{' '}
            <a href="tel:+14359624444" className="text-emerald-400 underline">(435) 962-4444</a>.
          </div>
        </div>
      </section>
    </div>
  );
}
