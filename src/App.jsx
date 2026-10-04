import React, { lazy, Suspense } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BuildingStorefrontIcon,
  MegaphoneIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowRightIcon,
  ChartBarIcon,
  BoltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { ShieldCheckIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import Logo from './components/Logo';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';
import Resources from './pages/Resources';
import Audit from './pages/Audit';
import Agencies from './pages/Agencies';
import RoiCalculator from './components/RoiCalculator';

const AiAssistant = lazy(() => import('./components/AiAssistant'));
import MerchantVideoWalkthrough from './components/MerchantVideoWalkthrough';

function usePostMountAnalytics() {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-1GZME3VSPB';
    script.async = true;
    document.head.appendChild(script);
  }, []);
}

export function getAppUrl(path = '') {
  let partner = '';
  if (typeof window !== 'undefined') {
    try {
      partner = localStorage.getItem('404killer_partner_ref') || '';
      if (!partner) {
        const match = document.cookie.match(/404killer_partner_ref=([^;]+)/);
        if (match) partner = decodeURIComponent(match[1]);
      }
    } catch (e) {}
  }
  const base = 'https://app.404killer.com' + path;
  if (partner) {
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}ref=${encodeURIComponent(partner)}`;
  }
  return base;
}

function usePartnerReferralTracking() {
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || params.get('partner') || params.get('via');
      if (ref) {
        localStorage.setItem('404killer_partner_ref', ref.trim());
        document.cookie = `404killer_partner_ref=${encodeURIComponent(ref.trim())};path=/;max-age=5184000;SameSite=Lax`;
      }
    } catch (e) {}
  }, []);
}

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const openPortal = (subdomain) => {
  const isDev = window.location.hostname === 'localhost';
  let port = 5173;
  if (subdomain === 'brand') port = 5174;
  if (subdomain === 'partner') port = 5175;
  if (subdomain === 'app') port = 5176;

  window.location.href = isDev
    ? `http://localhost:${port}`
    : `https://app.404killer.com`;
};

function Home() {
  const [showMerchantVideo, setShowMerchantVideo] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('video') || params.get('walkthrough') || params.get('playground')) {
      setShowMerchantVideo(true);
    }

    const handleOpenEvent = () => setShowMerchantVideo(true);
    window.addEventListener('open-walkthrough', handleOpenEvent);
    return () => window.removeEventListener('open-walkthrough', handleOpenEvent);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="pt-36 md:pt-44 pb-20 px-6 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm shadow-xl text-xs md:text-sm font-bold text-emerald-400 mb-2">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
            <span>Never Lose Another Sale to a Dead Link • 7-Day Free Trial</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] drop-shadow-2xl">
            <span className="block text-theme">STOP LOSING SALES & AD DOLLARS TO</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 py-1">
              DEAD 404 LINKS
            </span>
            <span className="block text-theme">ON SHOPIFY.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-theme-muted max-w-3xl mx-auto leading-relaxed font-medium">
            <strong className="text-theme">404 Killer App: Revenue Shield</strong> automatically detects and heals 404 broken URLs, protects paid Meta & TikTok ad traffic, and optimizes your store for AI search engines in under 60 seconds.
          </p>

          {/* Price Anchor Callout */}
          <div className="inline-block bg-white/5 border border-white/10 rounded-2xl px-6 py-2.5 backdrop-blur-md">
            <span className="text-xs md:text-sm font-semibold text-theme-muted">
              🛡️ Starter Shield from <strong className="text-emerald-400 text-base font-black">$8.95/mo</strong> • Pro Revenue Sentinel at <strong className="text-cyan-400 text-base font-black">$14.95/mo</strong> • 7-Day Free Trial
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={getAppUrl()}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 rounded-full font-black text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Free 7-Day Trial <ArrowRightIcon className="w-5 h-5 stroke-[2.5]" />
            </a>
            <Link
              to="/audit"
              className="w-full sm:w-auto px-7 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:border-emerald-400"
            >
              ⚡ Run Free Store Audit
            </Link>
            <button
              type="button"
              onClick={() => setShowMerchantVideo(true)}
              className="w-full sm:w-auto px-7 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-theme rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 text-emerald-400 cursor-pointer shadow-lg hover:border-emerald-500/30"
            >
              <span>▶</span> Watch Video
            </button>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3 text-theme-muted text-xs font-bold uppercase tracking-wider">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            1-Click Shopify App Install • Zero Code Changes Required • Cancel Anytime
          </div>
        </div>
      </section>

      {/* Live Social Proof Benchmark Bar */}
      <div className="border-y border-white/5 bg-white/5 backdrop-blur-sm py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-black text-emerald-400">93 URLs</div>
            <div className="text-xs text-theme-muted uppercase tracking-wider font-semibold mt-1">Audited Daily on RenuIQ.com</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-cyan-400">0 Active 404s</div>
            <div className="text-xs text-theme-muted uppercase tracking-wider font-semibold mt-1">100% Auto-Healed 301s</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-purple-400">AI AEO Schema</div>
            <div className="text-xs text-theme-muted uppercase tracking-wider font-semibold mt-1">Live for Google Overviews</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-emerald-400">$0 Wasted</div>
            <div className="text-xs text-theme-muted uppercase tracking-wider font-semibold mt-1">Ad Spend Protected</div>
          </div>
        </div>
      </div>

      {/* Core Revenue Shield Pillars */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">
              Autonomous Storefront Sentinel
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-theme tracking-tight mb-4">
              Six Automated Shields. Zero Leaked Revenue.
            </h2>
            <p className="text-theme-muted text-lg max-w-2xl mx-auto">
              Shopify stores lose thousands every month to broken URLs, out-of-stock ad bounces, and redirect loops. 404 Killer handles it all autonomously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Shield 1: 404 Auto-Healer */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm hover:border-emerald-500/40 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                <ShieldCheckIcon className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-theme">Autonomous 404 Healer</h3>
              <p className="text-theme-muted mb-6 leading-relaxed text-sm">
                Crawls your storefront 24/7. When a shopper hits a deleted product, expired promo link, or 404 URL, it instantly applies a sub-15ms 301 redirect to the closest category match.
              </p>
              <ul className="space-y-2.5 text-xs text-theme-muted">
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400" /> Zero manual CSV imports or spreadsheets
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400" /> Protects Google SEO keyword rankings
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400" /> Instant edge-level redirect resolution
                </li>
              </ul>
            </div>

            {/* Shield 2: Ad Campaign Protector */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm hover:border-cyan-500/40 transition-all group">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20">
                <BoltIcon className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-theme">Paid Ad Spend Sentinel</h3>
              <p className="text-theme-muted mb-6 leading-relaxed text-sm">
                Intercepts inbound ad traffic from Meta, TikTok, and Google Ads. If a promoted product URL changes or breaks, shoppers are routed to matching active products with full UTM attribution intact.
              </p>
              <ul className="space-y-2.5 text-xs text-theme-muted">
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-cyan-400" /> Never burn paid ad clicks on 404 errors
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-cyan-400" /> Preserves full UTM campaign tracking
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-cyan-400" /> Safeguards ROAS and conversion rates
                </li>
              </ul>
            </div>

            {/* Shield 3: Out-of-Stock Ad Salvage (PRO) */}
            <div className="bg-[var(--card-bg)] border border-emerald-500/30 p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm hover:border-emerald-500/60 transition-all group shadow-lg">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-4 border border-emerald-500/30">
                Pro Sentinel
              </div>
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20">
                <BuildingStorefrontIcon className="w-7 h-7 text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-theme">Out-of-Stock Ad Guard</h3>
              <p className="text-theme-muted mb-6 leading-relaxed text-sm">
                When paid ad traffic lands on sold-out SKUs (<code className="text-emerald-400 text-xs">inventory &le; 0</code>), automatically displays high-converting in-stock recommendations and back-in-stock capture.
              </p>
              <ul className="space-y-2.5 text-xs text-theme-muted">
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-rose-400" /> Rescues shoppers from dead-end sold out pages
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-rose-400" /> Recommends similar in-stock catalog items
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-rose-400" /> Recovers \$2.50–\$5.00 CPC cost per click
                </li>
              </ul>
            </div>

            {/* Shield 4: Redirect Chain & Loop Compressor (PRO) */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm hover:border-cyan-500/40 transition-all group">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-wider mb-4 border border-cyan-500/30">
                Pro Sentinel
              </div>
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                <ArrowRightIcon className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-theme">Loop & Chain Compressor</h3>
              <p className="text-theme-muted mb-6 leading-relaxed text-sm">
                Detects multi-hop 301 chains (A &rarr; B &rarr; C) and resolves them into direct 1-step redirects. Automatically breaks circular redirect loops that crash mobile browsers.
              </p>
              <ul className="space-y-2.5 text-xs text-theme-muted">
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-blue-400" /> Eliminates "Too Many Redirects" errors
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-blue-400" /> Prevents Google SEO crawl-budget penalties
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-blue-400" /> Compresses slow multi-hop lag down to zero
                </li>
              </ul>
            </div>

            {/* Shield 5: Zombie Script & Media Sentinel (PRO) */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm hover:border-amber-500/40 transition-all group">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider mb-4 border border-amber-500/30">
                Pro Sentinel
              </div>
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                <ChartBarIcon className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-theme">Zombie Script & Media Guard</h3>
              <p className="text-theme-muted mb-6 leading-relaxed text-sm">
                Audits your storefront theme for broken CDN media, 0-byte images, and orphaned JavaScript left behind by uninstalled apps that cause 500 errors and stall page loads.
              </p>
              <ul className="space-y-2.5 text-xs text-theme-muted">
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-amber-400" /> Catches 404 broken product image thumbnails
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-amber-400" /> Identifies ghost tracking scripts slowing DOM
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-amber-400" /> Boosts Google Core Web Vitals speed score
                </li>
              </ul>
            </div>

            {/* Shield 6: AEO & AI Search Schema */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm hover:border-purple-500/40 transition-all group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                <SparklesIcon className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-theme">1-Click AI Search Schema</h3>
              <p className="text-theme-muted mb-6 leading-relaxed text-sm">
                Injects Google AI Overview, Perplexity, and ChatGPT structured JSON-LD schemas (<code className="text-emerald-400 text-xs">Product</code>, <code className="text-emerald-400 text-xs">FAQPage</code>, <code className="text-emerald-400 text-xs">BreadcrumbList</code>) so conversational AI engines cite your store.
              </p>
              <ul className="space-y-2.5 text-xs text-theme-muted">
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-purple-400" /> Formatted for Google AI Overviews
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-purple-400" /> Automatic seasonal FAQ schema generation
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-purple-400" /> Unlocks rich product snippet rankings
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <RoiCalculator />

      {/* The Trojan Horse: Coming Soon Co-Marketing Banner */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/30 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                🚀 Coming Soon • Subscriber Exclusive
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-theme tracking-tight">
                The 404 Killer Cross-Store Network (Beta Waitlist)
              </h3>
              <p className="text-theme-muted text-sm md:text-base leading-relaxed">
                What happens when a customer lands on an out-of-stock item? Instead of a dead end, 404 Killer subscribers will get priority access to our <strong>Zero-Ad-Spend Co-Marketing Network</strong>: monetize dead inventory by cross-recommending verified partner brand products for <strong>15–20% affiliate commissions</strong>.
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
                <span>✓ Zero inventory risk</span>
                <span>✓ Automated commission payouts</span>
                <span>✓ Verified Shopify brands only</span>
              </div>
            </div>

            <div className="shrink-0 text-center lg:text-right">
              <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">Priority Beta Access</div>
              <div className="text-sm font-semibold text-theme-muted mb-4">Included free for all 404 Killer subscribers</div>
              <a
                href={getAppUrl()}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm transition-all inline-flex items-center gap-2"
              >
                Lock In Founder Access <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (3 Tiers) */}
      <section id="pricing" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-3">
              Transparent Founder Pricing
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-theme tracking-tight mb-4">
              Three Powerful Tiers. Total Revenue Protection.
            </h2>
            <p className="text-theme-muted text-lg max-w-2xl mx-auto">
              Rescuing just one single customer from a dead link or out-of-stock bounce pays for months of your subscription.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
            {/* Tier 1: Starter Shield */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 flex flex-col justify-between backdrop-blur-sm hover:border-emerald-500/30 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Starter Shield</div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-theme">7-Day Free Trial</span>
                </div>
                <h3 className="text-2xl font-black text-theme mb-3">Essential 404 Auto-Healer</h3>
                <p className="text-sm text-theme-muted mb-6">
                  Perfect for growing stores wanting automated broken URL healing and paid ad UTM protection without complexity.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-theme">$8.95</span>
                    <span className="text-theme-muted text-sm font-semibold">/ month</span>
                  </div>
                  <div className="text-theme-muted text-xs mt-1">or <strong className="text-emerald-400">$60/year</strong> ($5/mo)</div>
                </div>

                <ul className="space-y-3.5 text-xs text-theme-muted mb-8">
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Autonomous 24/7 404 broken URL crawl & healing</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Meta, Google & TikTok ad spend UTM link protector</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Instant 301 redirects to closest active categories</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-emerald-400 shrink-0" /> 1-Click AEO & Google AI Overview structured data</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Daily link health check digests</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-emerald-400 shrink-0" /> 7-Day Free Trial • 1-Click Install</li>
                </ul>
              </div>
              <a
                href={getAppUrl()}
                className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-theme font-bold text-center transition-all block text-sm"
              >
                Start Free Trial ($8.95/mo)
              </a>
            </div>

            {/* Tier 2: Pro Revenue Sentinel */}
            <div className="bg-gradient-to-b from-emerald-950/40 via-[var(--card-bg)] to-[var(--card-bg)] border-2 border-emerald-500/60 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-md relative shadow-2xl">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                ⭐ Most Popular
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Pro Revenue Sentinel</div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Save $54 on Annual</span>
                </div>
                <h3 className="text-2xl font-black text-theme mb-3">Storefront Sentinel</h3>
                <p className="text-sm text-theme-muted mb-6">
                  Complete site reliability, out-of-stock ad salvage, and redirect loop compression for scaling brands.
                </p>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-theme">$14.95</span>
                    <span className="text-theme-muted text-sm font-semibold">/ month</span>
                  </div>
                  <div className="text-theme-muted text-xs mt-1">or <strong className="text-cyan-400">$125.00/year</strong> ($10.41/mo)</div>
                </div>

                <ul className="space-y-3.5 text-xs text-theme-muted mb-8">
                  <li className="flex items-center gap-2 text-theme font-semibold"><CheckBadgeIcon className="w-4 h-4 text-cyan-400 shrink-0" /> <strong>Everything in Starter, PLUS:</strong></li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Out-of-Stock (OOS) Ad Guard:</strong> Reroute sold-out clicks to active items</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Loop & Chain Compressor:</strong> Fix infinite 301 loops</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Broken Media Guard:</strong> Scans for missing CDN photos</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Zombie Script Hunter:</strong> Cleans up leftover uninstalled app code</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Storewide Deep Crawler:</strong> Hourly audit of menus & footers</li>
                </ul>
              </div>
              <a
                href={getAppUrl()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-center transition-all block shadow-lg text-sm"
              >
                Start Pro Trial ($14.95/mo)
              </a>
            </div>

            {/* Tier 3: Agency & Brand Sentinel Portal */}
            <div className="bg-gradient-to-b from-cyan-950/40 via-[var(--card-bg)] to-[var(--card-bg)] border-2 border-cyan-500/60 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-md relative shadow-2xl">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                🛡️ Agency & Multi-Brand
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Sentinel Portal</div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">10% Off Annual</span>
                </div>
                <h3 className="text-2xl font-black text-theme mb-3">Email & Ad Link Portal</h3>
                <p className="text-sm text-theme-muted mb-6">
                  Built for Agencies & High-Volume Brands. Pre-flight email QA, ad sentinels, immutable client ROI reports & CSV exports.
                </p>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-theme">$149.00</span>
                    <span className="text-theme-muted text-sm font-semibold">/ month</span>
                  </div>
                  <div className="text-theme-muted text-xs mt-1">or <strong className="text-cyan-400">$1,599/year</strong> ($133.25/mo) • Instant Activation</div>
                  <div className="mt-2.5 pt-2 border-t border-cyan-500/20 flex flex-col gap-1">
                    <span className="text-[11px] text-cyan-300 font-bold">Includes up to 5 brands/stores • +$25/mo per add-on brand</span>
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                      <span>🛡️</span> 30-Day Risk-Free Money-Back Guarantee
                    </span>
                  </div>
                </div>

                <ul className="space-y-3.5 text-xs text-theme-muted mb-8">
                  <li className="flex items-center gap-2 text-theme font-semibold"><CheckBadgeIcon className="w-4 h-4 text-cyan-400 shrink-0" /> <strong>Up to 5 Brands Included</strong> (+$25/mo per extra brand)</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-cyan-400 shrink-0" /> <strong>Email Pre-Flight QA:</strong> Klaviyo / ESP test send auditor</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-cyan-400 shrink-0" /> <strong>Ad Landing Page Sentinel:</strong> Polling of Meta, Google & TikTok URLs</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-cyan-400 shrink-0" /> <strong>Multi-Store Agency Portal:</strong> Single dashboard for all clients</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-cyan-400 shrink-0" /> <strong>Immutable Client Reports:</strong> Permanent, tamper-proof proof-of-work</li>
                  <li className="flex items-center gap-2 text-theme font-medium"><CheckBadgeIcon className="w-4 h-4 text-cyan-400 shrink-0" /> <strong>1-Click CSV Exporter:</strong> Client-side raw telemetry downloads</li>
                </ul>
              </div>
              <div>
                <a
                  href={getAppUrl()}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:brightness-110 text-slate-950 font-black text-center transition-all block shadow-lg text-sm"
                >
                  Activate Agency Sentinel ($149/mo)
                </a>
                <div className="text-center text-[11px] text-theme-muted mt-2 font-medium">
                  Instant Provisioning • 30-Day Risk-Free Guarantee
                </div>
              </div>
            </div>
          </div>

          {/* Legal Acceptance Notice */}
          <div className="mt-12 text-center max-w-3xl mx-auto px-4">
            <p className="text-xs text-theme-muted leading-relaxed">
              By activating 404 Killer App, you agree to our{' '}
              <Link to="/terms" className="text-emerald-400 underline font-semibold hover:text-emerald-300">
                Master Customer Agreement & Terms of Service
              </Link>{' '}
              and our{' '}
              <Link to="/privacy" className="text-emerald-400 underline font-semibold hover:text-emerald-300">
                Strict Privacy Guarantee
              </Link>
              . Specific customer and merchant data is strictly confidential and <strong>never shared or sold</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Video Walkthrough Modal */}
      {showMerchantVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowMerchantVideo(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-5xl">
            <Suspense fallback={<div className="p-12 text-center text-white font-bold">Loading Video Walkthrough...</div>}>
              <MerchantVideoWalkthrough onClose={() => setShowMerchantVideo(false)} />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
}

function WalkthroughPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="text-sm font-semibold text-emerald-400 hover:underline flex items-center gap-2">
          &larr; Back to 404 Killer App Home
        </Link>
      </div>
      <div className="rounded-3xl overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl p-6">
        <Suspense fallback={<div className="p-12 text-center text-white font-bold">Loading Video Walkthrough...</div>}>
          <MerchantVideoWalkthrough onClose={() => navigate('/')} />
        </Suspense>
      </div>
    </div>
  );
}

function App() {
  usePostMountAnalytics();
  usePartnerReferralTracking();
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [theme, setTheme] = React.useState(document.documentElement.getAttribute('data-theme') || '');

  const toggleTheme = () => {
    const newTheme = theme === 'enterprise' ? '' : 'enterprise';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-theme selection:bg-emerald-500 selection:text-white font-sans overflow-x-hidden flex flex-col transition-colors duration-500">
      {/* Navigation */}
      <nav
        className="fixed w-full z-50 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--card-border)]"
        style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)', willChange: 'transform' }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
          <Link 
            to="/" 
            className="shrink-0 flex items-center mr-4 lg:mr-8"
            onClick={() => { if (window.location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <Logo className="h-8 md:h-12" textColor="text-theme" theme={theme} />
          </Link>
          <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 text-xs lg:text-sm font-medium text-theme-muted shrink-0">
            <Link 
              to="/audit" 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('reset-audit-scan'));
              }}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer"
            >
              <span>⚡</span> Free Store Audit
            </Link>
            <a href="#features" className="hover:text-theme transition-colors whitespace-nowrap">Features</a>
            <a href="#roi-calculator" className="hover:text-theme transition-colors whitespace-nowrap hidden lg:inline-block">ROI Calculator</a>
            <a href="#pricing" className="hover:text-theme transition-colors whitespace-nowrap">Pricing</a>
            <Link to="/agencies" className="hover:text-theme transition-colors font-medium whitespace-nowrap hidden xl:inline-block">Agencies (25% Cut)</Link>
            <Link to="/resources" className="hover:text-theme transition-colors whitespace-nowrap hidden 2xl:inline-block">Guides & Docs</Link>
            <button
              type="button"
              onClick={() => {
                if (window.location.pathname !== '/') {
                  window.location.href = '/walkthrough';
                } else {
                  const event = new CustomEvent('open-walkthrough');
                  window.dispatchEvent(event);
                }
              }}
              className="text-emerald-400 hover:text-emerald-300 transition-colors hidden xl:flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider cursor-pointer whitespace-nowrap"
            >
              <span>▶</span> Watch Video
            </button>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
            <a
              href={getAppUrl()}
              className="px-5 md:px-7 py-2 md:py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 rounded-full text-xs md:text-sm font-black transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer whitespace-nowrap"
            >
              Start Free Trial &rarr;
            </a>
          </div>
        </div>
      </nav>

      {/* Main Routing Content */}
      <main className="flex-grow pt-20">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/walkthrough" element={<WalkthroughPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer
        className="border-t border-[var(--card-border)] py-12 text-center text-theme-muted text-sm mt-12 bg-[var(--card-bg)]/50 backdrop-blur-sm"
        style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}
      >
        <div className="flex justify-center mb-6 opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
          <Link to="/">
            <Logo className="h-10" showText={false} theme={theme} />
          </Link>
        </div>
        <p className="mb-4 text-theme-muted">© 2026 404 Killer App: Revenue Shield. Never Lose Another Sale to a Dead Link.</p>
        <div className="flex justify-center gap-6 flex-wrap">
          <Link to="/audit" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold">⚡ Free Store Audit</Link>
          <Link to="/agencies" className="text-theme-muted hover:text-theme transition-colors font-semibold">Agency Partners (25%)</Link>
          <Link to="/support" className="text-theme-muted hover:text-theme transition-colors font-bold">Support</Link>
          <Link to="/privacy" className="text-theme-muted hover:text-theme transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-theme-muted hover:text-theme transition-colors">Terms of Service</Link>
          <Link to="/resources" className="text-theme-muted hover:text-theme transition-colors">Downloadable Guides</Link>
        </div>
      </footer>

      <Suspense fallback={null}>
        <AiAssistant />
      </Suspense>
    </div>
  );
}

export default App;
