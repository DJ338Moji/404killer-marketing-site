import React from 'react';

export default function Logo({ className = "h-10 md:h-12", showText = true, textColor = "text-white" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-[0_0_25px_rgba(16,185,129,0.35)] shrink-0">
        <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-950 fill-current" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v6h-2V7zm0 8h2v2h-2v-2z" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none font-black text-xl md:text-2xl tracking-tighter">
            <span className="text-white">404</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">KILLER</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-emerald-400/90 leading-tight mt-0.5">
            Revenue Shield
          </span>
        </div>
      )}
    </div>
  );
}
