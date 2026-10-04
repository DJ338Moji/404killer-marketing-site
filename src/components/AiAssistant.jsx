import React, { useState, useRef, useEffect } from 'react';
import {
  SparklesIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  TicketIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const DEPARTMENTS = [
  { id: 'SUPPORT', name: 'Technical & Auto-Healer Support', email: 'support@404killer.com', icon: '🛠️' },
  { id: 'ORDERS', name: 'Orders, Invoicing & Billing', email: 'orders@404killer.com', icon: '💳' },
  { id: 'QA', name: 'Email Pre-Flight QA (Klaviyo / ESP)', email: 'qa@404killer.com', icon: '⚡' },
  { id: 'PR', name: 'Agency Partner & Rev-Share Program', email: 'pr@404killer.com', icon: '🤝' },
];

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'new-ticket' | 'track'
  
  // Chat State
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm 404 Killer AI. Ask me anything, or let me know if you need to open a tracked support ticket or check the status of an existing issue."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    shopDomain: '',
    department: 'SUPPORT',
    subject: '',
    description: '',
    priority: 'NORMAL'
  });
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(null);

  // Ticket Lookup State
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('404killer_recent_tickets') || '[]');
      setRecentTickets(saved);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const saveTicketToLocal = (ticket) => {
    try {
      const existing = JSON.parse(localStorage.getItem('404killer_recent_tickets') || '[]');
      const filtered = existing.filter(t => t.ticketNumber !== ticket.ticketNumber);
      const updated = [ticket, ...filtered].slice(0, 5);
      localStorage.setItem('404killer_recent_tickets', JSON.stringify(updated));
      setRecentTickets(updated);
    } catch (e) {}
  };

  const getApiUrl = (endpoint) => {
    const isDev = window.location.hostname === 'localhost';
    const base = isDev ? 'http://localhost:3000' : 'https://app.404killer.com';
    return `${base}${endpoint}`;
  };

  // Chat message submission
  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = textToSend.trim();
    if (!overrideText) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      let answer = null;
      let ticketData = null;

      try {
        const response = await fetch(getApiUrl('/api/ai/chat'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: userMessage, history: messages.slice(-6) })
        });
        const data = await response.json();
        if (data?.success && data?.answer) {
          answer = data.answer;
          if (data.ticket) ticketData = data.ticket;
        }
      } catch (e) {
        // Network fallback
      }

      if (!answer) {
        const lower = userMessage.toLowerCase();
        if (lower.includes('price') || lower.includes('cost') || lower.includes('plan')) {
          answer = "404 Killer App offers three tiers:\n• Starter Shield ($8.95/mo or $60/yr) with 7-day free trial.\n• Pro Sentinel ($14.95/mo or $125/yr) with 7-day free trial.\n• Agency Sentinel ($149/mo or $1,599/yr) with instant provisioning and a 30-day money-back guarantee.";
        } else if (lower.includes('ticket') || lower.includes('support') || lower.includes('help')) {
          answer = "You can open a tracked support ticket anytime! Click the 'Open Ticket' tab above or provide your email and issue details, and our automated system will route it to our engineering team.";
        } else {
          answer = "404 Killer App operates 24/7 to protect your storefront revenue and salvage dead ad spend. Need dedicated help? Open a tracked ticket in the tab above!";
        }
      }

      if (ticketData) {
        saveTicketToLocal(ticketData);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Our support intelligence engine is standing by. Feel free to open a tracked ticket using the button above for guaranteed engineering response." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit new ticket
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.email || !ticketForm.subject || !ticketForm.description) return;

    setTicketSubmitting(true);
    setTicketSuccess(null);

    try {
      const response = await fetch(getApiUrl('/api/tickets'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketForm)
      });
      const data = await response.json();

      if (data?.success && data?.ticket) {
        setTicketSuccess(data.ticket);
        saveTicketToLocal(data.ticket);
        setTicketForm({
          name: '',
          email: '',
          shopDomain: '',
          department: 'SUPPORT',
          subject: '',
          description: '',
          priority: 'NORMAL'
        });
      } else {
        alert(data?.error || "Failed to submit ticket. Please email support@404killer.com directly.");
      }
    } catch (err) {
      alert("Network error submitting ticket. Please email support@404killer.com directly.");
    } finally {
      setTicketSubmitting(false);
    }
  };

  // Lookup ticket status
  const handleLookup = async (ticketNum) => {
    const query = ticketNum || lookupQuery;
    if (!query.trim()) return;

    setLookupLoading(true);
    setLookupError('');
    setLookupResult(null);

    try {
      const isEmail = query.includes('@');
      const param = isEmail ? `email=${encodeURIComponent(query.trim())}` : `ticketNumber=${encodeURIComponent(query.trim())}`;
      const response = await fetch(getApiUrl(`/api/tickets?${param}`));
      const data = await response.json();

      if (data?.success) {
        if (data.ticket) {
          setLookupResult([data.ticket]);
          saveTicketToLocal(data.ticket);
        } else if (data.tickets && data.tickets.length > 0) {
          setLookupResult(data.tickets);
        } else {
          setLookupError("No tickets found for that query.");
        }
      } else {
        setLookupError(data?.error || "Ticket not found.");
      }
    } catch (err) {
      setLookupError("Failed to connect to ticketing server. Please check your connection.");
    } finally {
      setLookupLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">Open & In Queue</span>;
      case 'INVESTIGATING':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">Investigating</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Resolved</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-500/20 text-slate-300 border border-slate-500/30">Closed</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] font-sans">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full shadow-[0_0_40px_-5px_rgba(16,185,129,0.5)] flex items-center justify-center transition-all hover:scale-110 animate-fade-in cursor-pointer"
        >
          <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0F172A] animate-pulse"></div>
        </button>
      )}

      {/* Main Support & Intelligence Modal */}
      {isOpen && (
        <div
          className="w-[390px] sm:w-[420px] h-[600px] bg-[#0F172A]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up"
          style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-950/60 to-slate-900 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                <SparklesIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-black text-sm leading-tight flex items-center gap-1.5">
                  404 Killer Support Desk
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                  AI Agent & Automated Ticketing
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 bg-black/40 border-b border-white/5 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'chat'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>AI Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('new-ticket')}
              className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'new-ticket'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TicketIcon className="w-3.5 h-3.5" />
              <span>Open Ticket</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'track'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MagnifyingGlassIcon className="w-3.5 h-3.5" />
              <span>Track Issue</span>
            </button>
          </div>

          {/* TAB 1: AI Chat Assistant */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Quick Action Prompt Chips */}
              <div className="px-4 py-2 bg-black/20 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar text-[10px]">
                <button
                  onClick={() => handleSend("What are the pricing plans and guarantees?")}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 whitespace-nowrap shrink-0 transition-colors"
                >
                  💳 Plans & Guarantee
                </button>
                <button
                  onClick={() => setActiveTab('new-ticket')}
                  className="px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 whitespace-nowrap shrink-0 transition-colors"
                >
                  🎫 Open Ticket
                </button>
                <button
                  onClick={() => handleSend("How does Email Pre-Flight QA at qa@404killer.com work?")}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 whitespace-nowrap shrink-0 transition-colors"
                >
                  ⚡ Email QA
                </button>
              </div>

              {/* Messages Container */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-semibold rounded-tr-none'
                          : 'bg-slate-900/90 text-slate-200 border border-white/10 rounded-tl-none ring-1 ring-white/5 shadow-inner'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-slate-900/90 p-3 rounded-2xl rounded-tl-none border border-white/10 flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3.5 border-t border-white/5 bg-black/40">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask AI or type ticket number (TK-404-...)"
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 text-xs"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
                  <span>Powered by Gemini & Ticketing Engine</span>
                  <button
                    onClick={() => setActiveTab('new-ticket')}
                    className="text-cyan-400 hover:underline font-bold"
                  >
                    Report an Issue &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Open New Ticket */}
          {activeTab === 'new-ticket' && (
            <div className="flex-1 overflow-y-auto p-5">
              {ticketSuccess ? (
                <div className="text-center py-6 space-y-4 animate-fade-in">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircleIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Ticket Created & Dispatched</span>
                    <h4 className="text-2xl font-black text-white mt-1">
                      {ticketSuccess.ticketNumber}
                    </h4>
                  </div>
                  <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 text-left text-xs space-y-2 text-slate-300">
                    <div className="flex justify-between pb-1 border-b border-white/5">
                      <span className="text-slate-500">Department:</span>
                      <strong className="text-cyan-400">{ticketSuccess.department} Desk</strong>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-white/5">
                      <span className="text-slate-500">Email:</span>
                      <span className="text-white font-mono">{ticketSuccess.email}</span>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-white/5">
                      <span className="text-slate-500">Status:</span>
                      <span className="text-amber-400 font-bold">{ticketSuccess.status}</span>
                    </div>
                    <div className="pt-1 text-[11px] text-slate-400 leading-relaxed">
                      ✉️ Routed to senior engineering desk at <strong>devreviq@gmail.com</strong>.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setLookupQuery(ticketSuccess.ticketNumber);
                        setActiveTab('track');
                        handleLookup(ticketSuccess.ticketNumber);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-colors"
                    >
                      Track This Ticket
                    </button>
                    <button
                      onClick={() => setTicketSuccess(null)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors border border-white/10"
                    >
                      New Ticket
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Specialized Department
                    </label>
                    <select
                      value={ticketForm.department}
                      onChange={(e) => setTicketForm({ ...ticketForm, department: e.target.value })}
                      className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept.id} value={dept.id} className="bg-slate-900 text-white">
                          {dept.icon} {dept.name} ({dept.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Your Email *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="you@store.com"
                        value={ticketForm.email}
                        onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                        className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Store Domain
                      </label>
                      <input
                        type="text"
                        placeholder="brand.com"
                        value={ticketForm.shopDomain}
                        onChange={(e) => setTicketForm({ ...ticketForm, shopDomain: e.target.value })}
                        className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Issue Subject *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g., 404 on summer collection ad campaign"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Description & Details *
                    </label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Include broken URLs, UTM parameters, or billing question..."
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                      className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={ticketSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    {ticketSubmitting ? 'Creating Tracked Ticket...' : 'Open Tracked Ticket &rarr;'}
                  </button>

                  <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                    Auto-forwarded to <strong>devreviq@gmail.com</strong>. Generates instant immutable ticket ID.
                  </p>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: Track Ticket Status */}
          {activeTab === 'track' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Search Bar */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-300">
                  Enter Ticket Number or Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
                    placeholder="e.g. TK-404-12345 or user@email.com"
                    className="flex-1 bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                  <button
                    onClick={() => handleLookup()}
                    disabled={lookupLoading || !lookupQuery.trim()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {lookupLoading ? '...' : 'Track'}
                  </button>
                </div>
              </div>

              {lookupError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                  {lookupError}
                </div>
              )}

              {/* Lookup Result Card */}
              {lookupResult && lookupResult.length > 0 && (
                <div className="space-y-3">
                  {lookupResult.map((t) => (
                    <div key={t.id || t.ticketNumber} className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 text-xs space-y-2.5 animate-fade-in shadow-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="font-mono font-black text-white text-sm">
                          {t.ticketNumber}
                        </span>
                        {getStatusBadge(t.status)}
                      </div>

                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">Subject</div>
                        <div className="text-white font-semibold text-xs mt-0.5">{t.subject}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Department Desk:</span>
                          <strong className="text-cyan-300">{t.department}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Created:</span>
                          <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-1">
                        <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5" />
                          <span>Engineering Status & Notes:</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed italic">
                          {t.resolutionNotes || "Ticket is open and under engineering review. Forwarded to senior lead at devreviq@gmail.com."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recent Local Tickets */}
              {(!lookupResult || lookupResult.length === 0) && recentTickets.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block mb-2">
                    Recently Created on This Device
                  </span>
                  <div className="space-y-2">
                    {recentTickets.map((t) => (
                      <button
                        key={t.ticketNumber}
                        onClick={() => {
                          setLookupQuery(t.ticketNumber);
                          handleLookup(t.ticketNumber);
                        }}
                        className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between text-xs cursor-pointer"
                      >
                        <div>
                          <span className="font-mono font-bold text-cyan-400 block">{t.ticketNumber}</span>
                          <span className="text-[11px] text-slate-400 truncate block max-w-[200px]">{t.subject}</span>
                        </div>
                        {getStatusBadge(t.status || 'OPEN')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
