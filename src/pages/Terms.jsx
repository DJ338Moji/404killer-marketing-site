import React from 'react';
import Logo from '../components/Logo';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Terms() {
  const theme = document.documentElement.getAttribute('data-theme');

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-theme font-sans p-8 md:p-16 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <Logo textColor="text-theme" theme={theme} />
          <a href="/" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Home
          </a>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          <h1 className="text-4xl md:text-5xl font-black text-theme mb-4 tracking-tighter">Terms of Service</h1>
          <p className="text-theme-muted mb-12 font-medium">Agreement Date: March 31, 2026</p>

          <section className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">1. Agreement to Terms</h2>
              <p className="leading-relaxed text-theme-muted">By accessing or using any part of the Mojipass® ecosystem (the "Service"), including our portals and Shopify integration, you agree to be bound by these Terms of Service. If you do not agree, you must immediately cease all use of the Service.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">2. The Purely Performance® Model</h2>
              <p className="mb-4 leading-relaxed">Mojipass® operates as a purely performance-based retail network. We do not charge subscription fees. Our revenue is derived from successfully attributed trial conversions and partner synergy matches.</p>
              <ul className="list-disc pl-6 space-y-3 text-theme-muted">
                <li><strong className="text-theme">Sponsoring Brands:</strong> Commit to 100% fixed CPA (Cost-Per-Acquisition) budgets. Campaigns can be paused or scaled instantly.</li>
                <li><strong className="text-theme">Shopify Merchants:</strong> Agree to present sponsored "Unlockable Rewards" at checkout. Mojipass® is not responsible for the physical fulfillment of these rewards.</li>
                <li><strong className="text-theme">Network Partners:</strong> Agree to promote Mojipass® enabled storefronts using approved "Smart Pass" links.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">3. Content and Conduct</h2>
              <p className="leading-relaxed text-theme-muted">Partners and Brands are responsible for the accuracy of their creative assets and offer descriptions. Mojipass® reserves the right to suspend any account engaging in fraudulent attribution or "Giddy Quotient" manipulation.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">4. Limitation of Liability</h2>
              <p className="leading-relaxed text-theme-muted">TO THE MAXIMUM EXTENT PERMITTED BY LAW, MOJIPASS® SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE NETWORK. WE MAKE NO GUARANTEES REGARDING THE SPECIFIC CONVERSION RATES OR SALES VOLUMES PRODUCED BY OUR INTELLIGENCE ENGINE.</p>
            </div>

            <div className="pt-12 border-t border-[var(--card-border)]">
              <p className="text-sm text-theme-muted">For industrial-legal inquiries, contact <span className="text-emerald-400 font-bold">legal@mojipass.com</span></p>
              <p className="text-xs text-theme-muted mt-4 opacity-50 italic">© 2026 Mojipass® Ecosystem. All rights reserved. "Purely Performance" is a pending trademark of Mojipass®.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
