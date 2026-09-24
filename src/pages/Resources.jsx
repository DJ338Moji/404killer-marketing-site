import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, MessageSquare } from 'lucide-react';

const TutorialGrid = lazy(() => import('../components/TutorialGrid'));

export default function Resources() {
  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-24 px-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <GraduationCap className="w-3 h-3" />
            <span>Mojipass® Academy</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Resources & <span className="text-emerald-400">Tutorials</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to master the reward-driven marketplace. From quick start guides for influencers to deep-dives for global brands.
          </p>
        </div>

        <Suspense fallback={null}>
          <TutorialGrid />
        </Suspense>

        {/* Support Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center gap-6"
          >
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">API Documentation</h3>
              <p className="text-slate-400 mb-6 font-medium">Build custom integrations with the Mojipass® headless engine.</p>
              <a 
                href="https://docs.mojipass.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block text-emerald-400 font-bold hover:text-emerald-300 transition-colors uppercase text-sm tracking-widest px-6 py-3 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/10"
              >
                Read Docs
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center gap-6"
          >
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <MessageSquare className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Community Hub</h3>
              <p className="text-slate-400 mb-6 font-medium">Join 500+ partners and brands sharing success blueprints.</p>
              <a 
                href="https://discord.gg/mojipass" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block text-emerald-400 font-bold hover:text-emerald-300 transition-colors uppercase text-sm tracking-widest px-6 py-3 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/10"
              >
                Join Discord
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
