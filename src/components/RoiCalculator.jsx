import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';

export default function RoiCalculator() {
  const [aov, setAov] = useState(65);
  const [monthlyTraffic, setMonthlyTraffic] = useState(5000);
  const [planType, setPlanType] = useState('monthly'); // 'monthly' ($8.95) or 'annual' ($60/yr = $5/mo)

  // Calculations based on Shopify merchant benchmarks
  // Typically 1.5% - 3% of visitors encounter out-of-stock items, changed handles, or dead ad links
  const deadLinkVisitors = Math.round(monthlyTraffic * 0.022);
  // Average ecommerce conversion rate is ~2.2%
  const recoveredOrders = Math.max(1, Math.round(deadLinkVisitors * 0.024));
  const monthlyRevenueSaved = recoveredOrders * aov;
  const cost = planType === 'monthly' ? 8.95 : 5.00;
  const netSaved = monthlyRevenueSaved - cost;
  const roi = Math.round((netSaved / cost) * 100);

  return (
    <section id="roi-calculator" className="py-20 px-6 relative z-10">
      <div className="max-w-5xl mx-auto bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Interactive ROI Simulator</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-theme tracking-tight mb-4">
            How Much Revenue Is Leaking From Your Store?
          </h2>
          <p className="text-theme-muted text-base leading-relaxed">
            See how recovering just a handful of broken links, deleted SKUs, and expired promo codes pays for Mojipass hundreds of times over.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-theme">Average Order Value (AOV)</label>
                <span className="text-lg font-black text-emerald-400">${aov}</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="5"
                value={aov}
                onChange={(e) => setAov(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-xs text-theme-muted mt-1">
                <span>$20</span>
                <span>$100</span>
                <span>$200+</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-theme">Monthly Store Visitors</label>
                <span className="text-lg font-black text-cyan-400">{monthlyTraffic.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={monthlyTraffic}
                onChange={(e) => setMonthlyTraffic(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-xs text-theme-muted mt-1">
                <span>1,000</span>
                <span>25,000</span>
                <span>50,000+</span>
              </div>
            </div>

            {/* Plan Selector */}
            <div className="pt-2">
              <label className="text-xs uppercase tracking-wider font-bold text-theme-muted block mb-2">Pricing Term</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlanType('monthly')}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all text-center cursor-pointer ${
                    planType === 'monthly'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-white/5 border-white/10 text-theme-muted hover:border-white/20'
                  }`}
                >
                  Monthly ($8.95/mo)
                </button>
                <button
                  type="button"
                  onClick={() => setPlanType('annual')}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all text-center cursor-pointer relative ${
                    planType === 'annual'
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-white/5 border-white/10 text-theme-muted hover:border-white/20'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">Save 44%</span>
                  Annual ($60/yr • $5/mo)
                </button>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-950/80 border border-emerald-500/30 rounded-2xl p-6 md:p-8 text-center relative overflow-hidden shadow-xl">
            <div className="text-xs uppercase tracking-widest font-black text-emerald-400/80 mb-1">Estimated Revenue Protected</div>
            <div className="text-4xl md:text-5xl font-black text-theme mb-2 tracking-tight">
              ${monthlyRevenueSaved.toLocaleString()}<span className="text-sm font-medium text-theme-muted">/mo</span>
            </div>

            <div className="text-xs text-theme-muted mb-6">
              ~{recoveredOrders} recovered orders from ~{deadLinkVisitors} dead URL clicks
            </div>

            <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/10 mb-6 text-left">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-theme-muted font-bold">App Investment</div>
                <div className="text-base font-black text-theme">${cost.toFixed(2)}/mo</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-theme-muted font-bold">Projected Net ROI</div>
                <div className="text-base font-black text-emerald-400">+{roi}%</div>
              </div>
            </div>

            <a
              href="https://app.mojipass.com"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Start 7-Day Free Trial <ArrowRight className="w-4 h-4" />
            </a>
            <div className="text-[11px] text-theme-muted mt-2">No commitment. Cancel in 1 click anytime.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
