import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle,
  Store,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Layers,
  Zap
} from 'lucide-react';

const CHAPTERS = [
  {
    id: 1,
    title: 'Why Mojipass?',
    subtitle: 'Zero Ad-Spend Customer Acquisition',
    startTime: 0,
    endTime: 25,
    duration: 25,
    badge: 'The Value Proposition',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
    script: "G'day Shopify merchants! Are rising Meta ad costs and iOS privacy updates eating your margins? Traditional paid ads force you to pay before making a single dime. Mojipass completely flips this model. Instead of paying Meta for cold clicks, Mojipass connects you with complementary, non-competing Shopify brands for zero-CAC co-marketing. You cross-promote on checkout and post-purchase thank-you pages, only paying when a verified customer completes a purchase. It's pure profit synergy."
  },
  {
    id: 2,
    title: '1-Click App Install',
    subtitle: 'Shopify Admin Integration',
    startTime: 25,
    endTime: 50,
    duration: 25,
    badge: 'Frictionless Setup',
    color: 'from-blue-500 to-indigo-600',
    accentColor: '#3b82f6',
    script: "Getting started takes less than 60 seconds. Simply find Mojipass in the Shopify App Store and click 'Install'. Our native OAuth automatically authenticates your store. There are zero complex liquid theme edits, no scripts that slow down your storefront, and no developer required. Your products and collections sync automatically in the background."
  },
  {
    id: 3,
    title: 'AI Synergy Matching',
    subtitle: 'Catalog Sync & Non-Competing Pairings',
    startTime: 50,
    endTime: 75,
    duration: 25,
    badge: 'Automated Co-Op',
    color: 'from-purple-500 to-pink-600',
    accentColor: '#a855f7',
    script: "Once synced, our AI Discovery Engine audits your product categories and automatically matches your store with ideal partner brands. If you sell clean barrier-repair skincare, Mojipass pairs you with complementary organic body care or clean SPF brands—never direct competitors. You set your preferred referral incentive, and your automated co-marketing campaign goes live instantly."
  },
  {
    id: 4,
    title: 'Orders & Commissions',
    subtitle: 'Live Attribution & Real-Time Growth',
    startTime: 75,
    endTime: 105,
    duration: 30,
    badge: 'Predictable Revenue',
    color: 'from-amber-500 to-orange-600',
    accentColor: '#f59e0b',
    script: "Now the magic happens. When high-intent shoppers complete orders with partner stores, your curated synergy offer appears directly on their order confirmation page. When they redeem your offer, the sale is tracked in real-time on your Mojipass dashboard. You acquire new high-LTV customers on autopilot, while earning reciprocal commissions whenever your own customers explore partner offers. Welcome to the zero-friction commerce network!"
  }
];

export default function MerchantVideoWalkthrough({ onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showCaptions, setShowCaptions] = useState(true);
  const containerRef = useRef(null);

  const totalDuration = 105; // 1:45
  const currentChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  // Timer simulation loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.5 * speed;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Sync active chapter with current time
  useEffect(() => {
    const idx = CHAPTERS.findIndex(
      (c) => currentTime >= c.startTime && currentTime < c.endTime
    );
    if (idx !== -1 && idx !== activeChapterIndex) {
      setActiveChapterIndex(idx);
    }
  }, [currentTime, activeChapterIndex]);

  // Web Speech API Voiceover option
  useEffect(() => {
    if (!isPlaying || isMuted) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentChapter.script);
      utterance.rate = 1.05 * speed;
      utterance.pitch = 1.0;
      
      // Try to select an Australian or high-quality English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang === 'en-AU' || v.name.includes('Australia') || v.name.includes('Natural') || v.lang === 'en-US');
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [activeChapterIndex, isPlaying, isMuted, speed]);

  const handleSeek = (time) => {
    setCurrentTime(time);
    const idx = CHAPTERS.findIndex(c => time >= c.startTime && time < c.endTime);
    if (idx !== -1) setActiveChapterIndex(idx);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden bg-[#070d1e] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 max-w-none rounded-none' : ''
      }`}
    >
      {/* Top Browser Bar / Window Frame */}
      <div className="bg-[#0b1329] px-6 py-3 border-b border-white/10 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="ml-3 text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Shopify Merchant Explainer · Mojipass Core System
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Official Tutorial
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-sm font-bold ml-2 px-2 py-0.5 rounded-md hover:bg-white/10"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Video Viewport (16:9 simulated screen) */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-[#020617] via-[#091428] to-[#040915] overflow-hidden flex flex-col justify-between p-6 sm:p-10">
        {/* Animated Background Ambience */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
        </div>

        {/* Video Scene Content Switcher */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChapterIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex-1 flex flex-col justify-between"
          >
            {/* Scene Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">
                  Chapter {currentChapter.id} of 4: {currentChapter.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {currentChapter.title}
                </h3>
                <p className="text-slate-400 text-sm font-medium mt-0.5">
                  {currentChapter.subtitle}
                </p>
              </div>

              {/* Live Status Pill */}
              <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-2xl backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Interactive Demo
                </span>
              </div>
            </div>

            {/* Dynamic Interactive Stage per Chapter */}
            <div className="my-auto py-4">
              {activeChapterIndex === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
                  <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20 backdrop-blur-sm">
                    <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
                      <span>⚠️</span> The Old Way (Paid Ads)
                    </div>
                    <ul className="text-xs space-y-2 text-slate-300">
                      <li>❌ Pay upfront for impressions &amp; clicks</li>
                      <li>❌ High customer acquisition costs (CAC)</li>
                      <li>❌ iOS tracking blindness &amp; ad fatigue</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 backdrop-blur-sm shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                      <span>✨</span> The Mojipass Way (Co-Marketing)
                    </div>
                    <ul className="text-xs space-y-2 text-slate-200 font-medium">
                      <li>✅ Pay $0 upfront — pay only on real sales</li>
                      <li>✅ Co-market with complementary Shopify stores</li>
                      <li>✅ High conversion from warm post-purchase buyers</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeChapterIndex === 1 && (
                <div className="max-w-2xl mx-auto bg-slate-900/80 border border-white/15 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white text-base font-bold">Shopify App Store · 1-Click Install</h4>
                      <p className="text-slate-400 text-xs">Automated OAuth token handshake &amp; secure session</p>
                    </div>
                    <button className="ml-auto px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20">
                      Installed
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-300">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="font-bold text-emerald-400 block text-sm">0 Lines</span>
                      Code Required
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="font-bold text-blue-400 block text-sm">100% Native</span>
                      Shopify APIs
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="font-bold text-purple-400 block text-sm">&lt; 60s</span>
                      Setup Time
                    </div>
                  </div>
                </div>
              )}

              {activeChapterIndex === 2 && (
                <div className="max-w-2xl mx-auto bg-slate-900/80 border border-purple-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> AI Synergy Matching Algorithm
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Match Score: 96%
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 mb-3">
                    <div className="text-xs text-left">
                      <div className="font-bold text-white">Your Store: RenuIQ</div>
                      <div className="text-slate-400 text-[11px]">Skin Barrier Restorative Care</div>
                    </div>
                    <div className="text-emerald-400 font-black text-sm">⚡ SYNERGY ⚡</div>
                    <div className="text-xs text-right">
                      <div className="font-bold text-white">Partner: Curated Clean Beauty</div>
                      <div className="text-slate-400 text-[11px]">Non-competing SPF &amp; Body Care</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 text-center">
                    Shoppers who buy skin barrier repair creams are 4.8x more likely to accept clean sunscreen synergy vouchers.
                  </p>
                </div>
              )}

              {activeChapterIndex === 3 && (
                <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Attributed Sales</span>
                    <div className="text-2xl font-black text-white mt-1">+$4,820</div>
                    <span className="text-[10px] text-emerald-400 font-bold">↑ 18.4% AOV Lift</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <span className="text-xs text-emerald-300 uppercase font-semibold">Customer CAC</span>
                    <div className="text-2xl font-black text-emerald-400 mt-1">$0.00</div>
                    <span className="text-[10px] text-slate-300">Pure Performance</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Referral Earned</span>
                    <div className="text-2xl font-black text-white mt-1">15.0%</div>
                    <span className="text-[10px] text-blue-400 font-bold">Auto-Deposited</span>
                  </div>
                </div>
              )}
            </div>

            {/* Captions / Subtitles bar */}
            {showCaptions && (
              <div className="bg-black/70 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center max-w-3xl mx-auto shadow-lg">
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
                  "{currentChapter.script}"
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Video Player Bottom Control Bar */}
        <div className="relative z-20 mt-4 pt-3 border-t border-white/10 flex flex-col gap-2.5">
          {/* Progress Bar / Scrubber */}
          <div
            className="w-full h-2 bg-white/15 rounded-full overflow-hidden cursor-pointer relative group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              handleSeek(clickPos * totalDuration);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 rounded-full transition-all duration-300 relative"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md scale-0 group-hover:scale-100 transition-transform"></div>
            </div>
          </div>

          {/* Controls & Timecode */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:brightness-110 shadow-lg shadow-emerald-500/20"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => handleSeek(0)}
                className="text-slate-400 hover:text-white p-1"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1 ${isMuted ? 'text-red-400' : 'text-slate-400 hover:text-white'}`}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="font-mono text-[11px] text-slate-400">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>

            {/* Chapters navigation */}
            <div className="hidden md:flex items-center gap-1.5">
              {CHAPTERS.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => handleSeek(c.startTime)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    activeChapterIndex === i
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {i + 1}. {c.title}
                </button>
              ))}
            </div>

            {/* Right Tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                  showCaptions
                    ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                    : 'border-white/10 text-slate-400'
                }`}
              >
                CC
              </button>

              <button
                onClick={() => setSpeed(speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : 1)}
                className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 hover:bg-white/10 border border-white/10"
              >
                {speed}x
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-slate-400 hover:text-white p-1"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Call-to-Action Footer */}
      <div className="bg-[#0b1329] p-5 sm:p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-white font-bold text-sm sm:text-base">Ready to co-market with zero upfront ad spend?</h4>
          <p className="text-slate-400 text-xs">Join our network of curated Shopify stores and acquire warm customers today.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="https://apps.shopify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20 text-center flex items-center justify-center gap-2"
          >
            <span>Install Shopify App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="/assets/guides/merchant_onboarding_guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-3 bg-white/5 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center"
          >
            Playbook (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}
