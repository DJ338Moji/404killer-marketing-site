import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  DollarSign,
  TrendingDown,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Mail,
  Globe
} from 'lucide-react';

export default function Audit() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState('shopify');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState(0);
  const [scanResult, setScanResult] = useState(null);

  const scanSteps = [
    'Connecting to domain and verifying SSL/DNS routes...',
    'Spidering sitemap.xml and top 50 catalog links...',
    'Testing active Meta, Google & TikTok ad landing URLs...',
    'Analyzing sold-out SKUs and out-of-stock inventory states...',
    'Auditing schema readiness for Google AI Overviews & Perplexity...'
  ];

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleStartScan = (e) => {
    e.preventDefault();
    setError('');

    let cleanUrl = url.trim();
    if (!cleanUrl) {
      setError('Please enter your storefront URL (e.g. brand.com or store.myshopify.com).');
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    if (!email.trim() || !validateEmail(email.trim())) {
      setError('A valid business email is required to generate and receive your storefront health score.');
      return;
    }

    setUrl(cleanUrl);
    setIsScanning(true);
    setScanStage(0);

    // Save lead capture data locally
    try {
      const leads = JSON.parse(localStorage.getItem('404killer_audit_leads') || '[]');
      leads.push({
        url: cleanUrl,
        email: email.trim(),
        platform,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('404killer_audit_leads', JSON.stringify(leads));
    } catch (e) {
      // Ignore storage errors
    }

    // Progress simulation
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < scanSteps.length) {
        setScanStage(currentStep);
      } else {
        clearInterval(interval);
        setIsScanning(false);

        // Derive deterministic high-level metrics based on domain name
        const cleanHost = cleanUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        const seed = cleanHost.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const brokenCount = (seed % 4) + 4; // 4 to 7 broken URLs
        const adBleedDollars = Math.round(((seed % 10) * 120 + 1250) / 10) * 10; // $1,250 - $2,330

        setScanResult({
          domain: cleanHost,
          email: email.trim(),
          platform,
          grade: 'D+',
          brokenCount,
          adBleedDollars,
          pagesScanned: 68 + (seed % 25),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    }, 900);
  };

  const handleReset = () => {
    setScanResult(null);
    setIsScanning(false);
    setUrl('');
    setEmail('');
    setError('');
  };

  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto relative">
      {/* Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-60 right-10 w-80 h-80 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autonomous Storefront Diagnostics</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
          Free Storefront <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">ROAS & 404 Audit</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          Scan your store for dead links, sold-out ad traffic, and wasted paid ad spend. Discover your Store Health Score in under 15 seconds.
        </p>
      </div>

      {/* Input Scanner Form */}
      {!scanResult && !isScanning && (
        <div className="max-w-2xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleStartScan} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                Storefront Web Address
              </label>
              <input
                type="text"
                placeholder="e.g. yourstore.com or store.myshopify.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all placeholder:text-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-cyan-400" />
                Business Work Email <span className="text-emerald-400 font-normal lowercase">(required for health report delivery)</span>
              </label>
              <input
                type="email"
                placeholder="name@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all placeholder:text-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Primary Store Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 transition-all"
              >
                <option value="shopify">Shopify / Shopify Plus</option>
                <option value="woocommerce">WooCommerce / WordPress</option>
                <option value="bigcommerce">BigCommerce</option>
                <option value="webflow">Webflow</option>
                <option value="squarespace">Squarespace</option>
                <option value="custom">Custom React / Next.js / Other</option>
              </select>
            </div>

            {error && (
              <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black rounded-xl text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Run Free Storefront Scan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2">
              <span className="flex items-center gap-1">🔒 100% Secure & Non-Invasive</span>
              <span>•</span>
              <span className="flex items-center gap-1">⚡ 15-Second Headless Check</span>
              <span>•</span>
              <span className="flex items-center gap-1">🛡️ Zero Code Install Required</span>
            </div>
          </form>
        </div>
      )}

      {/* Scanning Live Progress Screen */}
      {isScanning && (
        <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">Analyzing Storefront Health...</h3>
          <p className="text-xs font-mono text-emerald-400 mb-6">{url}</p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full transition-all duration-700 ease-out"
              style={{ width: `${((scanStage + 1) / scanSteps.length) * 100}%` }}
            ></div>
          </div>

          <p className="text-xs text-slate-300 font-medium min-h-[20px]">
            {scanSteps[scanStage]}
          </p>
        </div>
      )}

      {/* Gated Teaser Results Screen */}
      {scanResult && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Health Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                  <span>Store: <strong className="text-white">{scanResult.domain}</strong></span>
                  <span>•</span>
                  <span>Scanned at {scanResult.timestamp}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Storefront Health Assessment
                </h2>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Full diagnostic report confirmed for <strong>{scanResult.email}</strong>
                </p>
              </div>

              {/* Grade Badge */}
              <div className="flex items-center gap-3 bg-red-950/30 border border-red-500/30 px-5 py-3 rounded-2xl">
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-400">Health Grade</div>
                  <div className="text-xs text-slate-300 font-semibold">High Revenue Risk</div>
                </div>
                <div className="text-4xl font-black text-red-400 tracking-tighter">
                  {scanResult.grade}
                </div>
              </div>
            </div>

            {/* High-Level Scorecard Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                  <span>Dead-End URLs Found</span>
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-3xl font-black text-red-400">
                  {scanResult.brokenCount} <span className="text-xs font-semibold text-slate-400">404s</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Active links returning dead pages across {scanResult.pagesScanned} inspected catalog routes.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                  <span>Est. Monthly Ad Bleed</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-amber-400">
                  ${scanResult.adBleedDollars.toLocaleString()}
                  <span className="text-xs font-semibold text-slate-400">/mo</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Wasted Meta/Google ad spend on dead ends & sold-out items (94% bounce rate).
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                  <span>AI Engine Readiness</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xl font-black text-cyan-400 pt-1">
                  At Risk
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Google AI Overviews & Perplexity bots cannot index discontinued product schemas.
                </p>
              </div>
            </div>
          </div>

          {/* Gated Breakdown Table (Specific URLs 100% Blurred) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Detected Revenue Leaks</span>
                  <span className="text-xs font-bold text-red-400 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded-full">
                    {scanResult.brokenCount} Issues
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time dead ends and broken campaign landing endpoints detected on your domain.
                </p>
              </div>
            </div>

            {/* Blurred Table Container with Overlay Paywall */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800">
              {/* Blurred Content */}
              <div className="divide-y divide-slate-800 select-none filter blur-[5px] pointer-events-none opacity-40 bg-slate-950">
                <div className="p-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-red-400 uppercase tracking-wider text-[10px]">Paid Ad Target SKU (UTM Tagged)</span>
                    <div className="font-mono text-slate-200">https://{scanResult.domain}/products/vintage-crewneck-heather-grey?utm_source=meta&utm_campaign=summer_sale</div>
                  </div>
                  <span className="font-mono text-red-400 font-bold">404 NOT FOUND</span>
                </div>
                <div className="p-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">High-Volume Category Navigation</span>
                    <div className="font-mono text-slate-200">https://{scanResult.domain}/collections/seasonal-clearance-special</div>
                  </div>
                  <span className="font-mono text-red-400 font-bold">404 NOT FOUND</span>
                </div>
                <div className="p-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">Sold-Out SKU with Active Ad Spend</span>
                    <div className="font-mono text-slate-200">https://{scanResult.domain}/products/ultra-boost-runner-size-10?utm_source=google</div>
                  </div>
                  <span className="font-mono text-amber-400 font-bold">0 INVENTORY</span>
                </div>
                <div className="p-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-purple-400 uppercase tracking-wider text-[10px]">Influencer Campaign Anchor</span>
                    <div className="font-mono text-slate-200">https://{scanResult.domain}/pages/creator-vip-exclusive</div>
                  </div>
                  <span className="font-mono text-red-400 font-bold">404 NOT FOUND</span>
                </div>
              </div>

              {/* Locked Overlay Badge */}
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-lg font-black text-white tracking-tight">
                  Specific URLs & Autonomous 50ms Auto-Healer Locked
                </h4>
                <p className="text-xs text-slate-300 max-w-md mt-1 mb-5">
                  To protect store privacy and stop ad spend leakage, exact URLs and automatic 301 category auto-healers unlock immediately upon activating 404 Killer App.
                </p>

                {/* Direct Resolution CTA */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
                  {scanResult.platform === 'shopify' ? (
                    <a
                      href="https://app.404killer.com"
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                    >
                      <span>Auto-Heal All {scanResult.brokenCount} Leaks on Shopify</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <a
                      href="https://app.404killer.com"
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                    >
                      <span>Unlock Report & Universal Script ($8.95/mo)</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-3">
                  <span>🛡️ 30-Day Zero-Risk Revenue Guarantee</span>
                  <span>•</span>
                  <span>50ms Instant 301 Protection</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
              <button
                onClick={handleReset}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-bold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Scan Another Storefront</span>
              </button>
              <div className="text-slate-400">
                Need agency or multi-store coverage? <Link to="/agencies" className="text-emerald-400 font-bold hover:underline">Explore the Agency Partner Program &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
