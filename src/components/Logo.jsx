import React from 'react';

export default function Logo({ className = "h-10 md:h-12", showText = true, textColor = "text-white" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img 
        src="/app-icon.png" 
        alt="404 Killer App" 
        className="w-9 h-9 md:w-11 md:h-11 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.35)] shrink-0 object-contain" 
      />

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none font-black text-xl md:text-2xl tracking-tighter">
            <span className="text-white">404</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">KILLER</span>
            <span className="text-cyan-400">APP</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-emerald-400/90 leading-tight mt-0.5">
            Revenue Shield
          </span>
        </div>
      )}
    </div>
  );
}
