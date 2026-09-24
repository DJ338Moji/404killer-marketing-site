import React, { useState } from 'react';
import { 
  EnvelopeIcon, 
  ChatBubbleBottomCenterTextIcon, 
  QuestionMarkCircleIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Support() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // In a real app, you'd send this to your backend
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[var(--card-bg)] border border-[var(--card-border)] p-12 rounded-3xl text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <CheckCircleIcon className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-theme">Message Sent!</h2>
          <p className="text-theme-muted leading-relaxed">
            We've received your request. Our support intelligence team will get back to you at <b>support@mojipass.com</b> within 24 hours.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="px-8 py-3 bg-[var(--color-brand)] text-theme rounded-xl font-bold hover:brightness-110 transition-all"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm font-black text-emerald-400 uppercase tracking-widest mb-4">
            <SparklesIcon className="w-4 h-4" />
            <span>Support Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-theme leading-[1.0]">
            HOW CAN WE <span className="text-emerald-400">HELP</span> YOU?
          </h1>
          <p className="text-xl text-theme-muted max-w-2xl mx-auto leading-relaxed">
            Whether you're a brand, merchant, or partner—we're here to ensure your experience in the network is frictionless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl backdrop-blur-sm">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                <EnvelopeIcon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-bold text-theme mb-1">Direct Email</h3>
              <p className="text-sm text-theme-muted mb-3 italic">support@mojipass.com</p>
              <p className="text-xs text-theme-muted leading-relaxed">For fast-track support related to your account or active campaigns.</p>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl backdrop-blur-sm">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
                <QuestionMarkCircleIcon className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-theme mb-1">Knowledge Base</h3>
              <p className="text-xs text-theme-muted leading-relaxed">Technical documentation and API guides are available in our developer portal.</p>
            </div>
          </div>

          {/* Support Form */}
          <div className="md:col-span-2 bg-[var(--card-bg)] border border-[var(--card-border)] p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-theme-muted uppercase tracking-widest ml-1">Your Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter full name"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-theme placeholder:text-theme-muted focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-theme-muted uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="name@company.com"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-theme placeholder:text-theme-muted focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-theme-muted uppercase tracking-widest ml-1">Subject</label>
                <select className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-theme focus:outline-none focus:border-emerald-500/50 transition-all font-medium appearance-none">
                  <option className="bg-[#0b0c10]">Merchant Integration Support</option>
                  <option className="bg-[#0b0c10]">Brand Campaign Inquiry</option>
                  <option className="bg-[#0b0c10]">Partner/Creator Payouts</option>
                  <option className="bg-[#0b0c10]">Technical Bug Report</option>
                  <option className="bg-[#0b0c10]">Other Request</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-theme-muted uppercase tracking-widest ml-1">How can we help?</label>
                <textarea 
                  required
                  rows="5"
                  placeholder="Describe your request in detail..."
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-theme placeholder:text-theme-muted focus:outline-none focus:border-emerald-500/50 transition-all font-medium resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-theme font-black text-lg shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}`}
              >
                {loading ? 'Processing...' : (
                  <>
                    Send Message <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-theme-muted uppercase font-black tracking-widest opacity-50">
                Secure SSL Encrypted Transmission
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
