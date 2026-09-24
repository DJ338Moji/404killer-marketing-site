import React from 'react';
import Logo from '../components/Logo';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Privacy() {
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
          <h1 className="text-4xl md:text-5xl font-black text-theme mb-4 tracking-tighter">Privacy Policy</h1>
          <p className="text-theme-muted mb-12 font-medium">Last Updated: June 29, 2026</p>

          <section className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">1. The Mojipass® Commitment</h2>
              <p className="leading-relaxed">Mojipass® is built on the foundation of transparency and performance. We value the privacy of our Brands, Merchants, and Partners. This policy outlines how we handle data across our ecosystem, including the Shopify App and our various management portals.</p>
              <p className="leading-relaxed mt-4 text-theme-muted">We collect the minimum data required to operate the network. We do not sell personal data to third-party data brokers.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">2. Data We Collect via Shopify</h2>
              <p className="mb-4 leading-relaxed">When a Merchant installs the Mojipass® Shopify App, we access data required to power the "Zero-Friction" reward engine:</p>
              <ul className="list-disc pl-6 space-y-3 text-theme-muted">
                <li><strong className="text-theme">Customer Order Telemetry:</strong> We process checkout events to properly attribute sponsored trials and calculate partner commissions.</li>
                <li><strong className="text-theme">Store Metadata:</strong> We store store name, primary email, and domain to facilitate your Merchant identity on our network.</li>
                <li><strong className="text-theme">Product Data:</strong> We read product IDs to ensure "Synergy Matching" between your inventory and sponsoring Brand rewards.</li>
              </ul>
              <p className="mt-4 leading-relaxed text-theme-muted">We tell Merchants what we process and why through this policy, in-app disclosures, and our Shopify App listing before and during use.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">3. Data Usage & Security</h2>
              <p className="mb-4 leading-relaxed">We use personal data only for the purposes described in this policy. We do not sell data to third-party brokers. Permitted uses include:</p>
              <ul className="list-disc pl-6 space-y-3 text-theme-muted">
                <li>Calculating real-time analytics for Sponsoring Brands.</li>
                <li>Generating verified attribution ledgers for Creators and Partners.</li>
                <li>Optimizing the Bayesian Reward Engine to maximize shopper happiness.</li>
                <li>Operating, securing, and improving the Mojipass® platform.</li>
              </ul>
              <p className="mt-4 leading-relaxed text-theme-muted">Data is encrypted in transit using TLS 1.2 or higher. Data at rest is encrypted using industry-standard encryption (including AES-256) via our cloud infrastructure providers.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">4. Data Retention & Deletion</h2>
              <p className="mb-4 leading-relaxed text-theme-muted">We keep personal data only as long as necessary for the purposes above, then delete or anonymize it. Retention periods by category:</p>
              <ul className="list-disc pl-6 space-y-3 text-theme-muted">
                <li><strong className="text-theme">Active Shopify merchant data:</strong> Retained while the Mojipass® app is installed and you remain an active merchant on the platform.</li>
                <li><strong className="text-theme">Post-uninstall merchant data:</strong> Deleted or anonymized within <strong className="text-theme">30 days</strong> of app uninstall, except where a longer period is required for legal, tax, or fraud-prevention obligations.</li>
                <li><strong className="text-theme">Customer attribution data:</strong> Retained for up to <strong className="text-theme">24 months</strong> to support commission ledgers and dispute resolution, then aggregated or deleted. Shopify <code className="text-emerald-400">customers/redact</code> requests are honored promptly—typically within <strong className="text-theme">30 days</strong>.</li>
                <li><strong className="text-theme">Brand & Partner portal accounts:</strong> Retained while your account is active. After a verified deletion request, account data is removed within <strong className="text-theme">90 days</strong>, except records we must retain for legal or accounting purposes.</li>
                <li><strong className="text-theme">Server & security logs:</strong> Retained for up to <strong className="text-theme">90 days</strong> for troubleshooting and security monitoring, then deleted.</li>
              </ul>
              <p className="mt-4 leading-relaxed text-theme-muted">Uninstalling the Shopify App triggers Shopify&apos;s mandatory privacy webhooks (<code className="text-emerald-400">shop/redact</code>, <code className="text-emerald-400">customers/redact</code>, <code className="text-emerald-400">customers/data_request</code>). We respond to those requests and honor merchant-initiated audits or purge requests at <span className="text-emerald-400 font-bold">privacy@mojipass.com</span>.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">5. Data Processing Agreement (Merchants & Shopify)</h2>
              <p className="mb-4 leading-relaxed">When you install the Mojipass® Shopify App, you act as the <strong className="text-theme">data controller</strong> for your customers&apos; personal data. Mojipass® acts as a <strong className="text-theme">data processor</strong> on your behalf, processing personal data only according to your instructions, this Privacy Policy, and applicable law.</p>
              <p className="mb-4 leading-relaxed text-theme-muted">By installing or using the Mojipass® Shopify App, you agree to the following processing terms:</p>
              <ul className="list-disc pl-6 space-y-3 text-theme-muted">
                <li><strong className="text-theme">Subject matter & duration:</strong> Processing is limited to operating sponsored campaigns, attribution, analytics, and related app functionality for the duration of your subscription or until data is deleted under Section 4.</li>
                <li><strong className="text-theme">Nature & purpose:</strong> We process only the minimum personal data needed to deliver the services you configure in the app.</li>
                <li><strong className="text-theme">Types of data & data subjects:</strong> Merchant staff account data; store metadata; product catalog identifiers; and limited customer order/attribution telemetry as permitted by your Shopify permissions and privacy settings.</li>
                <li><strong className="text-theme">Your obligations:</strong> You are responsible for providing any required notices and obtaining any required consents from your customers under applicable privacy laws.</li>
                <li><strong className="text-theme">Our obligations:</strong> We implement appropriate technical and organizational safeguards; process data only on documented instructions; assist with data subject requests where applicable; and delete or return personal data when processing ends, subject to legal retention requirements.</li>
                <li><strong className="text-theme">Sub-processors:</strong> We use vetted infrastructure providers (including Google Firebase/Firestore, cloud hosting such as Railway, and Shopify&apos;s platform APIs) that are contractually required to protect personal data. A current sub-processor list is available on request.</li>
                <li><strong className="text-theme">International transfers:</strong> Where data is processed outside your jurisdiction, we rely on appropriate safeguards such as standard contractual clauses or equivalent mechanisms where required by law.</li>
                <li><strong className="text-theme">Security incidents:</strong> We will notify affected Merchants without undue delay after becoming aware of a personal data breach affecting Merchant customer data processed under this agreement, where notification is required by law.</li>
              </ul>
              <p className="mt-4 leading-relaxed text-theme-muted">Brands and Partners accessing Mojipass® portals agree to parallel processing terms for account and campaign data they submit to the network. For a countersigned DPA or sub-processor details, contact <span className="text-emerald-400 font-bold">privacy@mojipass.com</span>.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">6. Your Rights & Contact</h2>
              <p className="leading-relaxed text-theme-muted">Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal data, and to opt out of certain uses where applicable. Mojipass® does not sell personal data; where opt-out rights apply to &quot;sale&quot; or &quot;sharing&quot; under U.S. state privacy laws, they are not applicable to our core services because we do not engage in those activities.</p>
              <p className="mt-4 leading-relaxed text-theme-muted">Our automated matching and analytics do not produce legal or similarly significant effects on individuals (such as credit, employment, or housing decisions). For privacy requests, contact our Data Privacy Officer at <span className="text-emerald-400 font-bold">privacy@mojipass.com</span>.</p>
            </div>

            <div className="pt-12 border-t border-[var(--card-border)]">
              <p className="text-sm text-theme-muted">For privacy-related inquiries, DPA requests, or data deletion: <span className="text-emerald-400 font-bold">privacy@mojipass.com</span></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
