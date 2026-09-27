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
  TrendingUp,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Activity,
  Layers
} from 'lucide-react';

const CHAPTERS = [
  {
    id: 1,
    title: 'The Silent Ad Spend Burn',
    subtitle: 'How 404s Bleed Paid ROAS & Conversions',
    startTime: 0,
    endTime: 20.0,
    duration: 20.0,
    audioSrc: '/audio/chapter_1.mp3',
    badge: 'The Problem',
    color: 'from-red-500 to-rose-600',
    accentColor: '#f43f5e',
    script: "Shopify merchants lose thousands of dollars every month when paid Meta, Google, and TikTok ads land on sold-out products, deleted collections, or 404 dead ends. When high-intent shoppers hit a broken page, ninety-four percent bounce instantly. Your paid ad budget is burned, and the customer is lost to a competitor."
  },
  {
    id: 2,
    title: 'Autonomous 50ms Auto-Healer',
    subtitle: 'Instant 301 Smart Category Matching',
    startTime: 20.0,
    endTime: 42.6,
    duration: 22.6,
    audioSrc: '/audio/chapter_2.mp3',
    badge: 'Real-Time Interception',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
    script: "404 Killer App runs silently in the background. The exact millisecond an incoming visitor or ad click encounters a broken URL, our autonomous sentinel intercepts the request in under fifty milliseconds. Instead of an ugly 404 error, they are seamlessly 301-redirected to the matching collection or closest in-stock replacement SKU."
  },
  {
    id: 3,
    title: 'Paid Ad & Out-of-Stock Guard',
    subtitle: 'UTM Protection & Zero Campaign Downtime',
    startTime: 42.6,
    endTime: 61.9,
    duration: 19.3,
    audioSrc: '/audio/chapter_3.mp3',
    badge: 'Ad ROAS Defense',
    color: 'from-blue-500 to-cyan-600',
    accentColor: '#06b6d4',
    script: "Never pause a winning ad campaign again. When a viral product sells out, our Out-Of-Stock Sentinel detects the zero-inventory state and automatically reroutes ad traffic to your top in-stock alternative. Your Meta and TikTok UTM attribution remains unbroken, and your ad spend continues generating revenue."
  },
  {
    id: 4,
    title: 'Live ROI Dashboard & AI Schema',
    subtitle: 'Rescued Revenue & Google AI Indexing',
    startTime: 61.9,
    endTime: 81.4,
    duration: 19.5,
    audioSrc: '/audio/chapter_4.mp3',
    badge: 'Measurable Value',
    color: 'from-purple-500 to-emerald-500',
    accentColor: '#a855f7',
    script: "Track every rescued dollar, salvaged ad click, and flattened redirect loop right inside your Shopify admin dashboard. Plus, with one-click Answer Engine Optimization schema, your store is indexed directly by Google AI Overviews, Perplexity, and ChatGPT. That is 404 Killer App: complete revenue protection."
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
  const audioRef = useRef(null);

  const totalDuration = 81.4; // Exact duration of OpenAI Onyx audio track
  const currentChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  // Play / Pause synchronization
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      const p = audioRef.current.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Autoplay may be restricted until user interacts with the page
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Mute synchronization
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Playback rate synchronization
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const time = audioRef.current.currentTime;
    setCurrentTime(time);
    const idx = CHAPTERS.findIndex(c => time >= c.startTime && time < c.endTime);
    if (idx !== -1 && idx !== activeChapterIndex) {
      setActiveChapterIndex(idx);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveChapterIndex(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    const idx = CHAPTERS.findIndex(c => time >= c.startTime && time < c.endTime);
    if (idx !== -1) setActiveChapterIndex(idx);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const p = audioRef.current.play();
        if (p && typeof p.then === 'function') {
          p.then(() => setIsPlaying(true)).catch(() => {});
        } else {
          setIsPlaying(true);
        }
      }
    } else {
      setIsPlaying(!isPlaying);
    }
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
      {/* OpenAI High-Definition Audio Narration (Voice: Onyx) */}
      <audio
        ref={audioRef}
        src="/audio/walkthrough_full.mp3"
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />

      {/* Top Window Bar */}
      <div className="bg-[#0b1329] px-6 py-3 border-b border-white/10 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="ml-3 text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            404 Killer App · Revenue Shield Interactive Tour
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Interactive Product Tour
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

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-[#020617] via-[#091428] to-[#040915] overflow-hidden flex flex-col justify-between p-6 sm:p-8">
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
        </div>

        {/* Scene Content */}
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
                <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  {currentChapter.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5">
                  {currentChapter.subtitle}
                </p>
              </div>

              {/* Live Status Pill */}
              <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-2xl backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Sentinel Demo
                </span>
              </div>
            </div>

            {/* Dynamic Stage per Chapter */}
            <div className="my-auto py-3">
              {/* Scene 1: The Paid Ad Burn */}
              {activeChapterIndex === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  <div className="p-4 sm:p-5 rounded-2xl bg-red-950/20 border border-red-500/30 backdrop-blur-sm">
                    <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>Without 404 Killer App</span>
                    </div>
                    <ul className="text-xs space-y-2 text-slate-300">
                      <li>❌ Paid ad clicks land on deleted / sold-out SKUs</li>
                      <li>❌ Shoppers hit generic 404 "Page Not Found"</li>
                      <li>❌ 94% bounce rate — ad budget burned forever</li>
                    </ul>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 backdrop-blur-sm shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>With 404 Killer App</span>
                    </div>
                    <ul className="text-xs space-y-2 text-slate-200 font-medium">
                      <li>✅ Autonomous interception in &lt; 50 milliseconds</li>
                      <li>✅ Instant 301 redirect to matching in-stock category</li>
                      <li>✅ 100% of paid ad traffic and checkout intent saved</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Scene 2: 50ms Autonomous Auto-Healer */}
              {activeChapterIndex === 1 && (
                <div className="max-w-2xl mx-auto bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <span className="text-xs font-mono text-slate-400">Incoming Traffic Intercept</span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Latency: 38ms
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center justify-between">
                      <div className="font-mono text-red-300 truncate mr-2">
                        GET /products/vintage-oversized-crewneck-black
                      </div>
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold shrink-0">404 DEAD LINK</span>
                    </div>

                    <div className="flex justify-center my-1 text-emerald-400">
                      <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0" />
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                      <div className="font-mono text-emerald-300 truncate mr-2">
                        HTTP 301 &rarr; /collections/unisex-crewnecks
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold shrink-0">AUTO-HEALED</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Scene 3: Paid Ad & OOS Sentinel */}
              {activeChapterIndex === 2 && (
                <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Meta & TikTok UTMs</span>
                    <div className="text-xl font-black text-cyan-400 mt-1 flex items-center justify-center gap-1">
                      <Zap className="w-4 h-4 text-cyan-400" /> Active Guard
                    </div>
                    <span className="text-[10px] text-slate-400">Campaigns Unpaused</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <span className="text-xs text-emerald-300 uppercase font-semibold">Out-of-Stock SKU</span>
                    <div className="text-xl font-black text-emerald-400 mt-1">Auto-Rerouted</div>
                    <span className="text-[10px] text-slate-300">To Best In-Stock Match</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Ad Spend Saved</span>
                    <div className="text-xl font-black text-white mt-1">$1,850+</div>
                    <span className="text-[10px] text-emerald-400 font-bold">100% ROAS Preserved</span>
                  </div>
                </div>
              )}

              {/* Scene 4: Live ROI & AI Schema */}
              {activeChapterIndex === 3 && (
                <div className="max-w-2xl mx-auto grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[11px] sm:text-xs text-slate-400 uppercase font-semibold">Rescued Revenue</span>
                    <div className="text-lg sm:text-2xl font-black text-white mt-1">+$6,420</div>
                    <span className="text-[10px] text-emerald-400 font-bold">↑ 24.3% Conversion Lift</span>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <span className="text-[11px] sm:text-xs text-emerald-300 uppercase font-semibold">404s Healed</span>
                    <div className="text-lg sm:text-2xl font-black text-emerald-400 mt-1">1,284</div>
                    <span className="text-[10px] text-slate-300">Automated 301s</span>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[11px] sm:text-xs text-slate-400 uppercase font-semibold">AEO AI Schema</span>
                    <div className="text-lg sm:text-2xl font-black text-cyan-400 mt-1">Active</div>
                    <span className="text-[10px] text-blue-400 font-bold">Google AI & Perplexity</span>
                  </div>
                </div>
              )}
            </div>

            {/* Captions Bar */}
            {showCaptions && (
              <div className="bg-black/75 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center max-w-3xl mx-auto shadow-lg">
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
                  "{currentChapter.script}"
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Video Player Bottom Controls */}
        <div className="relative z-20 mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
          {/* Progress Scrubber */}
          <div
            className="w-full h-2 bg-white/15 rounded-full overflow-hidden cursor-pointer relative group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              handleSeek(clickPos * totalDuration);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full transition-all duration-300 relative"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md scale-0 group-hover:scale-100 transition-transform"></div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
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
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    activeChapterIndex === i
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {i + 1}. {c.title.split(' ')[0]} {c.title.split(' ')[1]}
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
          <h4 className="text-white font-bold text-sm sm:text-base">Ready to stop losing sales and ad dollars to dead 404 links?</h4>
          <p className="text-slate-400 text-xs">Install 404 Killer App on Shopify and protect your store revenue in under 60 seconds.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="https://app.404killer.com"
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-emerald-500/25 text-center flex items-center justify-center gap-2"
          >
            <span>Start 7-Day Free Trial</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
