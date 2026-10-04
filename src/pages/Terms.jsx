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
          <h1 className="text-4xl md:text-5xl font-black text-theme mb-4 tracking-tighter">Master Customer Agreement & Terms of Service</h1>
          <p className="text-theme-muted mb-12 font-medium">Last Updated: October 2026 • DevRevIQ, LLC (Arizona ID: 25126660)</p>

          <section className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">1. Agreement to Terms & Binding Acceptance</h2>
              <p className="leading-relaxed text-theme-muted">
                This Master Customer Agreement ("Agreement") is entered into between <strong>DevRevIQ, LLC</strong> ("Company", "we", "us", or "our") and the merchant, brand, agency, or individual ("Customer", "you", or "your") installing, accessing, or utilizing the <strong>404 Killer App: Revenue Shield</strong> application, API, marketing sentinel, agency portal, or related services (collectively, the "Service").
              </p>
              <p className="mt-3 leading-relaxed text-theme-muted">
                <strong>Mandatory Acceptance:</strong> By clicking "Install", "Activate Shield", "Start Free Trial", or otherwise accessing the Service, you represent that you have read, understand, and agree to be legally bound by this Agreement. If you are accepting on behalf of an agency or organization, you warrant that you possess full legal authority to bind that entity.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">2. Subscription Plans, Billing & Trials</h2>
              <p className="mb-4 leading-relaxed text-theme-muted">
                The Service is billed securely through Shopify's native Billing API or authorized merchant payment processors under the following tiers:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-theme-muted">
                <li><strong className="text-theme">Starter Shield:</strong> $8.95/month or $60.00/year ($5.00/mo effective). Includes automated 404 auto-healing, paid ad UTM sentinel, and daily digest summaries.</li>
                <li><strong className="text-theme">Pro Revenue Sentinel:</strong> $14.95/month or $125.00/year ($10.41/mo effective). Includes real-time Out-of-Stock (OOS) ad budget protection, loop compressor, media guard, and AEO schema generation.</li>
                <li><strong className="text-theme">Agency & Brand Sentinel Portal:</strong> $149.00/month or $1,599.00/year ($133.25/mo effective). Includes up to 5 client brands or stores. Additional client brands beyond 5 are billed at an incremental +$25.00/month (or +$240.00/year) each. Includes multi-store management, email pre-flight link scanner (Klaviyo / ESP preview QA), ad campaign poller, 1-click CSV data export, and immutable audit-grade client reports.</li>
                <li><strong className="text-theme">Free Trial & 30-Day Risk-Free Guarantee:</strong> Starter Shield and Pro Revenue Sentinel plans include an initial 7-day free trial. The Agency & Brand Sentinel Portal is provisioned with immediate activation and is backed by our 30-Day Risk-Free Money-Back Guarantee. If an Agency subscriber is unsatisfied within 30 days of initial provisioning, DevRevIQ will issue a 100% refund.</li>
                <li><strong className="text-theme">Cancellations:</strong> You may cancel or modify your subscription directly inside your Shopify store admin or account settings. Cancellation takes effect at the end of your current paid billing period.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">3. Customer Data Ownership & Strict Privacy Guarantee</h2>
              <p className="leading-relaxed text-theme-muted">
                <strong className="text-emerald-400 font-bold">Our Ironclad Privacy Pledge:</strong> DevRevIQ, LLC will <strong>NEVER</strong> sell, rent, monetize, disclose, or publicly share specific Customer Data, individually identifiable store figures, customer names, email addresses, order histories, unreleased catalog handles, or proprietary business information to any third party.
              </p>
              <p className="mt-3 leading-relaxed text-theme-muted">
                Customer retains exclusive ownership, right, title, and interest in and to all data provided by Customer or collected from Customer's storefront ("Customer Data"). DevRevIQ accesses Customer Data strictly as necessary to execute automated redirection, crawl link destinations, verify campaign integrity, and provide the Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">4. De-Identified Telemetry & Anecdotal Use Rights</h2>
              <p className="leading-relaxed text-theme-muted">
                Customer hereby grants DevRevIQ, LLC a perpetual, non-exclusive, royalty-free license to collect, compile, analyze, and use operational telemetry that has been <strong>strictly aggregated, anonymized, and de-identified</strong> (including, without limitation, aggregate counts of 404 errors detected, average redirection latency, link healing success rates, and generalized calculations of preserved revenue).
              </p>
              <p className="mt-3 leading-relaxed text-theme-muted">
                <strong>Anecdotal & Benchmarking Usage:</strong> DevRevIQ may utilize this de-identified telemetry to train optimization algorithms, publish industry benchmark reports, and reference <em>anecdotal proof-of-value metrics</em> in marketing materials, case studies, and sales collateral (for example: <em>"An e-commerce brand protected $38,000 in revenue across four Klaviyo campaigns after 404 Killer intercepted broken links"</em>). Such usage shall <strong>never</strong> identify Customer by name or disclose confidential merchant figures without Customer's prior express written consent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">5. Immutable Audit Records & Proof-of-Performance</h2>
              <p className="leading-relaxed text-theme-muted">
                Historical link health reports, email pre-flight verifications, and agency performance digests generated within the Service constitute <strong>permanent, audit-grade historical records</strong>.
              </p>
              <p className="mt-3 leading-relaxed text-theme-muted">
                <strong>Tamper-Proof Guarantee:</strong> To preserve contractual integrity and undeniable proof of performance for both agencies and their brand clients, generated client reports are cryptographically locked upon creation and <strong>cannot be retroactively altered, backdated, or deleted</strong> by either party.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">6. Merchant & Agency Responsibilities</h2>
              <p className="leading-relaxed text-theme-muted">
                Customers are responsible for maintaining valid administrative credentials, reviewing automated 301 redirection rules configured by the Service, and ensuring that any destination URLs, campaigns, or domains submitted for scanning are authorized under applicable law and platform guidelines (including Shopify and ESP Acceptable Use Policies).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">7. Disclaimer of Warranties & Limitation of Liability</h2>
              <p className="leading-relaxed text-theme-muted">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, DEVREVIQ, LLC DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED. IN NO EVENT SHALL DEVREVIQ, LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.
              </p>
              <p className="mt-3 leading-relaxed text-theme-muted">
                OUR MAXIMUM TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT OR THE SERVICE SHALL NOT EXCEED THE TOTAL FEES ACTUALLY PAID BY YOU TO DEVREVIQ, LLC UNDER THIS AGREEMENT DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE CLAIM.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">8. Governing Law & Dispute Resolution</h2>
              <p className="leading-relaxed text-theme-muted">
                This Agreement shall be governed by and construed in accordance with the laws of the State of Arizona, United States, without regard to its conflict of law principles. Any dispute arising out of or relating to this Agreement shall be resolved exclusively in the state or federal courts located in Maricopa County, Arizona.
              </p>
            </div>

            <div className="pt-12 border-t border-[var(--card-border)]">
              <p className="text-sm text-theme-muted">DevRevIQ, LLC • 404 Killer App: Revenue Shield • Legal Inquiries: <span className="text-emerald-400 font-bold">legal@404killer.com</span></p>
              <p className="text-xs text-theme-muted mt-4 opacity-50 italic">© 2026 DevRevIQ, LLC. All rights reserved. 404 Killer App and Revenue Shield are trademarks of DevRevIQ, LLC.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
