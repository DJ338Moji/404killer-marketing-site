import React from 'react';
import Logo from '../components/Logo';

export default function Privacy({ theme }) {
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
          <h1 className="text-4xl md:text-5xl font-black text-theme mb-4 tracking-tighter">Privacy Policy</h1>
          <p className="text-theme-muted mb-12 font-medium">Last Updated: September 2026 • DevRevIQ, LLC</p>

          <section className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">1. Our Commitment to Store Data Integrity</h2>
              <p className="leading-relaxed">404 Killer App: Revenue Shield is operated by <strong>DevRevIQ, LLC</strong>. We build autonomous storefront protection and URL healing technology for Shopify merchants. We operate on the principle of minimal data collection: we access only the operational data necessary to detect broken URLs, salvage paid ad traffic, and configure automated 301 redirects.</p>
              <p className="leading-relaxed mt-4 text-theme-muted">We do not sell, rent, or monetize your store data, customer records, or catalog information to third parties.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">2. Data We Collect via Shopify</h2>
              <p className="mb-4 leading-relaxed">When a merchant installs 404 Killer App, we access the following scoped data via official Shopify APIs:</p>
              <ul className="list-disc pl-6 space-y-3 text-theme-muted">
                <li><strong className="text-theme">Store Metadata:</strong> Store name, primary domain, and merchant email for authentication and billing configuration.</li>
                <li><strong className="text-theme">URL & Navigation Data:</strong> Storefront URL paths, collections, and navigation menus to identify broken links and publish automated 301 redirect mutations.</li>
                <li><strong className="text-theme">Product & Inventory Telemetry:</strong> Product handles and inventory stock statuses required for our Out-Of-Stock (OOS) Ad Budget Sentinel to redirect sold-out SKUs to in-stock alternatives.</li>
                <li><strong className="text-theme">404 Error Telemetry:</strong> Anonymized broken URL request counts and incoming UTM campaign parameters to calculate salvaged ad spend in your dashboard.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">3. Data Usage & Security</h2>
              <p className="mb-4 leading-relaxed">All data is processed strictly to deliver app functionality:</p>
              <ul className="list-disc pl-6 space-y-3 text-theme-muted">
                <li>Detecting dead URLs and publishing automated 301 redirects via Shopify GraphQL.</li>
                <li>Rerouting paid Meta, Google, and TikTok UTM ad clicks to valid storefront destinations.</li>
                <li>Generating real-time ROI and rescued revenue metrics in your admin dashboard.</li>
              </ul>
              <p className="mt-4 leading-relaxed text-theme-muted">Data in transit is encrypted using modern TLS 1.3 encryption. Data at rest is encrypted using industry-standard AES-256 via our cloud hosting providers.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">4. Retention, Deletion & Shopify Webhooks</h2>
              <p className="mb-4 leading-relaxed text-theme-muted">We retain data only as long as your Shopify store has an active installation. When you uninstall 404 Killer App:</p>
              <ul className="list-disc pl-6 space-y-3 text-theme-muted">
                <li>Shopify automatically issues mandatory privacy webhooks (<code className="text-emerald-400">shop/redact</code>, <code className="text-emerald-400">customers/redact</code>, <code className="text-emerald-400">customers/data_request</code>).</li>
                <li>Store session credentials and webhook subscriptions are purged immediately.</li>
                <li>All automated 301 redirects created by the app remain safely stored inside your Shopify store navigation database.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">5. Contact & Privacy Requests</h2>
              <p className="leading-relaxed text-theme-muted">For questions regarding this privacy policy or to submit a data erasure request, contact our Data Governance Officer at <span className="text-emerald-400 font-bold">privacy@404killer.com</span> or <span className="text-emerald-400 font-bold">support@devreviq.com</span>.</p>
            </div>

            <div className="pt-12 border-t border-[var(--card-border)]">
              <p className="text-sm text-theme-muted">DevRevIQ, LLC • 404 Killer App: Revenue Shield • <span className="text-emerald-400 font-bold">privacy@404killer.com</span></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
