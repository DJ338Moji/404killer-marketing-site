import React from 'react';
import Logo from '../components/Logo';

export default function Terms({ theme }) {
  return (
    <div className="py-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <Logo textColor="text-theme" theme={theme} />
          <a href="/" className="text-sm font-semibold text-emerald-400 hover:underline">
            &larr; Back to Home
          </a>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          <h1 className="text-4xl md:text-5xl font-black text-theme mb-4 tracking-tighter">Terms of Service</h1>
          <p className="text-theme-muted mb-12 font-medium">Last Updated: September 2026 • DevRevIQ, LLC</p>

          <section className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">1. Agreement to Terms</h2>
              <p className="leading-relaxed text-theme-muted">By installing, accessing, or using <strong>404 Killer App: Revenue Shield</strong> (the "Service"), provided by <strong>DevRevIQ, LLC</strong>, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must immediately uninstall and cease all use of the Service.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">2. Subscription Plans & Billing</h2>
              <p className="mb-4 leading-relaxed text-theme-muted">404 Killer App is billed through Shopify's native Billing API:</p>
              <ul className="list-disc pl-6 space-y-3 text-theme-muted">
                <li><strong className="text-theme">Starter Shield:</strong> $8.95/month or $60.00/year ($5.00/mo effective). Includes automated 404 auto-healer and paid ad UTM sentinel.</li>
                <li><strong className="text-theme">Pro Revenue Sentinel:</strong> $14.95/month or $125.00/year ($10.41/mo effective). Includes real-time OOS ad rerouting, redirect chain compressor, and AEO schema generation.</li>
                <li><strong className="text-theme">Free Trial:</strong> Both plans feature a full 7-day free trial. You may cancel at any time during the trial with zero charge.</li>
                <li><strong className="text-theme">Cancellations:</strong> You may cancel or modify your subscription directly inside your Shopify store admin. Cancellation takes effect at the conclusion of your current billing cycle.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">3. Merchant Responsibilities</h2>
              <p className="leading-relaxed text-theme-muted">Merchants are responsible for reviewing automated 301 redirection rules configured by the app. 404 Killer App provides manual override and rule deletion tools directly within the Shopify admin dashboard.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">4. Limitation of Liability</h2>
              <p className="leading-relaxed text-theme-muted">TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEVREVIQ, LLC AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE. OUR MAXIMUM AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU FOR THE SERVICE IN THE PRECEDING TWELVE (12) MONTHS.</p>
            </div>

            <div className="pt-12 border-t border-[var(--card-border)]">
              <p className="text-sm text-theme-muted">DevRevIQ, LLC • 404 Killer App: Revenue Shield • Contact: <span className="text-emerald-400 font-bold">legal@404killer.com</span></p>
              <p className="text-xs text-theme-muted mt-4 opacity-50 italic">© 2026 DevRevIQ, LLC. All rights reserved. 404 Killer App and Revenue Shield are trademarks of DevRevIQ, LLC.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
