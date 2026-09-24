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
import RoiCalculator from './components/RoiCalculator';

const AiAssistant = lazy(() => import('./components/AiAssistant'));
const MerchantVideoWalkthrough = lazy(() => import('./components/MerchantVideoWalkthrough'));

function usePostMountAnalytics() {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-1GZME3VSPB';
    script.async = true;
    document.head.appendChild(script);
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
            <strong className="text-theme">404 Killer: Revenue Shield</strong> automatically detects and heals 404 broken URLs, protects paid Meta & TikTok ad traffic, and optimizes your store for AI search engines in under 60 seconds.
          </p>

          {/* Price Anchor Callout */}
          <div className="inline-block bg-white/5 border border-white/10 rounded-2xl px-6 py-2.5 backdrop-blur-md">
            <span className="text-xs md:text-sm font-semibold text-theme-muted">
              🚀 Founder Launch Special:{' '}
              <span className="line-through opacity-60 text-rose-400">$19.95/mo</span>{' '}
              <strong className="text-emerald-400 text-base font-black">$8.95/mo</strong> or{' '}
              <strong className="text-cyan-400 text-base font-black">$60/yr</strong>{' '}
              <span className="text-emerald-400/90 font-bold">(Locked For Life)</span>
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="https://app.404killer.com"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 rounded-full font-black text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Free 7-Day Trial <ArrowRightIcon className="w-5 h-5 stroke-[2.5]" />
            </a>
            <button
              type="button"
              onClick={() => setShowMerchantVideo(true)}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-theme rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 text-emerald-400 cursor-pointer shadow-lg hover:border-emerald-500/30"
            >
              <span>▶</span> Watch 90s Walkthrough
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

      {/* 3 Core Revenue Shield Pillars */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">
              Core Revenue Protections
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-theme tracking-tight mb-4">
              Three Automated Shields. Zero Leaked Revenue.
            </h2>
            <p className="text-theme-muted text-lg max-w-2xl mx-auto">
              Shopify stores lose thousands every year to technical decay. Revenue Shield handles it automatically in the background.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shield 1: 404 Auto-Healer */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm hover:border-emerald-500/40 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                <ShieldCheckIcon className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-theme">Autonomous 404 Healer</h3>
              <p className="text-theme-muted mb-6 leading-relaxed text-sm">
                Crawls your store daily. When a shopper lands on a deleted product, expired sale URL, or broken link, it instantly calculates the closest active category match and applies a 301 redirect.
              </p>
              <ul className="space-y-2.5 text-xs text-theme-muted mb-6">
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400" /> Zero manual spreadsheets or CSV imports
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400" /> Protects Google SEO search rankings
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400" /> Sub-15ms edge redirect speed
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
                Monitors incoming traffic with campaign tags (Meta, TikTok, Google UTMs, influencer links). If a product sells out or handle changes, shoppers are redirected to active alternatives with tracking preserved.
              </p>
              <ul className="space-y-2.5 text-xs text-theme-muted mb-6">
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-cyan-400" /> Never burn paid ad spend on 404 pages
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-cyan-400" /> Preserves UTM attribution tags
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-cyan-400" /> Protects influencer campaign ROAS
                </li>
              </ul>
            </div>

            {/* Shield 3: AEO & AI Search Schema */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm hover:border-purple-500/40 transition-all group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                <SparklesIcon className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-theme">1-Click AI Search Schema</h3>
              <p className="text-theme-muted mb-6 leading-relaxed text-sm">
                Injects Google AI Overview, Perplexity, and ChatGPT structured JSON-LD (<code className="text-emerald-400 text-xs">Product</code>, <code className="text-emerald-400 text-xs">FAQPage</code>, <code className="text-emerald-400 text-xs">MedicalWebPage</code>) so conversational AI search engines cite your store.
              </p>
              <ul className="space-y-2.5 text-xs text-theme-muted mb-6">
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-purple-400" /> Formatted for Google AI Overviews
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-purple-400" /> Automatic seasonal FAQ generation
                </li>
                <li className="flex items-center gap-2 text-theme font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-purple-400" /> Free rich-snippets indexing boost
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
                href="https://app.404killer.com"
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm transition-all inline-flex items-center gap-2"
              >
                Lock In Founder Access <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-theme tracking-tight mb-4">
              Simple, Predictable Founder Pricing.
            </h2>
            <p className="text-theme-muted text-lg max-w-xl mx-auto">
              Priced at less than the cost of a single recovered order. Lock in early adopter pricing before rates increase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Monthly Plan */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 flex flex-col justify-between backdrop-blur-sm hover:border-emerald-500/30 transition-all">
              <div>
                <div className="text-xs uppercase font-bold text-theme-muted tracking-wider mb-2">Monthly Founder Tier</div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl md:text-5xl font-black text-theme">$8.95</span>
                  <span className="text-theme-muted text-sm font-semibold">/ month</span>
                  <span className="line-through text-sm text-theme-muted ml-2 opacity-60">$19.95</span>
                </div>
                <p className="text-sm text-theme-muted mb-6">
                  Perfect for fast-growing Shopify stores wanting zero-leak protection without annual commitments.
                </p>
                <ul className="space-y-3 text-xs text-theme-muted mb-8">
                  <li className="flex items-center gap-2 text-theme"><CheckBadgeIcon className="w-4 h-4 text-emerald-400" /> Daily automated 404 URL crawl & healing</li>
                  <li className="flex items-center gap-2 text-theme"><CheckBadgeIcon className="w-4 h-4 text-emerald-400" /> Meta & TikTok ad spend link protector</li>
                  <li className="flex items-center gap-2 text-theme"><CheckBadgeIcon className="w-4 h-4 text-emerald-400" /> Automated AEO & Google AI Overview schema</li>
                  <li className="flex items-center gap-2 text-theme"><CheckBadgeIcon className="w-4 h-4 text-emerald-400" /> 7-day free trial, cancel in 1 click</li>
                </ul>
              </div>
              <a
                href="https://app.404killer.com"
                className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-theme font-bold text-center transition-all block"
              >
                Start 7-Day Free Trial
              </a>
            </div>

            {/* Annual Pass */}
            <div className="bg-gradient-to-b from-emerald-950/40 via-[var(--card-bg)] to-[var(--card-bg)] border-2 border-emerald-500/50 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-md relative shadow-2xl">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                Best Value • Save 44%
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-2">Annual Founder Pass</div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl md:text-5xl font-black text-theme">$60.00</span>
                  <span className="text-theme-muted text-sm font-semibold">/ year ($5.00/mo)</span>
                  <span className="line-through text-sm text-theme-muted ml-2 opacity-60">$199.00</span>
                </div>
                <p className="text-sm text-theme-muted mb-6">
                  Guaranteed 365 days of revenue protection with grandfathered pricing locked in for life.
                </p>
                <ul className="space-y-3 text-xs text-theme-muted mb-8">
                  <li className="flex items-center gap-2 text-theme"><CheckBadgeIcon className="w-4 h-4 text-emerald-400" /> Everything in Monthly, plus:</li>
                  <li className="flex items-center gap-2 text-theme"><CheckBadgeIcon className="w-4 h-4 text-emerald-400" /> Priority Co-Marketing Partner Matching</li>
                  <li className="flex items-center gap-2 text-theme"><CheckBadgeIcon className="w-4 h-4 text-emerald-400" /> Corrupted media & 0-byte asset scanner</li>
                  <li className="flex items-center gap-2 text-theme"><CheckBadgeIcon className="w-4 h-4 text-emerald-400" /> Grandfathered $5/mo rate forever</li>
                </ul>
              </div>
              <a
                href="https://app.404killer.com"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-center transition-all block shadow-lg"
              >
                Get Annual Pass ($60/yr)
              </a>
            </div>
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
          &larr; Back to Mojipass Home
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <Link to="/" onClick={() => { if (window.location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <Logo className="h-8 md:h-12 lg:h-14" textColor="text-theme" theme={theme} />
          </Link>
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-theme-muted shrink-0">
            <a href="#features" className="hover:text-theme transition-colors">Features</a>
            <a href="#roi-calculator" className="hover:text-theme transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-theme transition-colors">Pricing</a>
            <Link to="/resources" className="hover:text-theme transition-colors">Guides & Docs</Link>
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
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              <span>▶</span> Watch Video
            </button>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://app.404killer.com"
              className="px-5 md:px-7 py-2 md:py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 rounded-full text-xs md:text-sm font-black transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer"
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
        <p className="mb-4 text-theme-muted">© 2026 404 Killer: Revenue Shield. Never Lose Another Sale to a Dead Link.</p>
        <div className="flex justify-center gap-6">
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
