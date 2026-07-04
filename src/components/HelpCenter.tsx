import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, ArrowRight, ExternalLink, ShieldCheck, MessageSquare, Map 
} from 'lucide-react';

interface HelpCenterProps {
  onOpenForm: () => void;
}

export default function HelpCenter({ onOpenForm }: HelpCenterProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.phone.trim()) {
      alert('Please fill out your Name and Phone number.');
      return;
    }
    // Simulate support ticket creation
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: '', email: '', phone: '', message: '' });
      alert('Your support inquiry has been logged successfully! An advisor will reach you shortly.');
    }, 1000);
  };

  const mapAddress = "9J6H+8CC, Baba Dham Rd, Gayatri Nagar, Subhash Nagar, Bhilwara, Rajasthan 311001";
  const mapLink = `https://www.google.com/maps/search/?api=1&query=Shop+No+2nd,+35+Ext+Subhash+Nagar,+Near+Ajmer+Road,+Bhilwara,+Rajasthan+311001`;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-12 text-left">
      {/* Header section */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent-600 bg-slate-100 px-3 py-1.5 rounded-full inline-block">
          Student Liaison Office
        </span>
        <h2 className="font-display font-extrabold text-2xl md:text-4xl text-brand-700">
          Help & Support Center
        </h2>
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-2xl">
          Have questions about course eligibility, documents, or LMS portals? Reach our specialized help desk. Our advisors provide 100% transparent and objective support.
        </p>
      </div>

      {/* Grid: Contact Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Phone call */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-800">Call/WhatsApp Support</h4>
              <p className="text-[11px] text-slate-400 mt-1">Get immediate expert guidance over call or WhatsApp.</p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-50">
            <a 
              href="tel:+918239697999" 
              className="block font-bold text-xs text-brand-700 hover:text-accent-600 transition-colors"
            >
              +91 8239697999
            </a>
            <a 
              href="https://wa.me/918239697999?text=Hi%20GyaanPeeth,%20I%20need%20expert%20assistance%20for%20admissions!"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-emerald-500 font-bold hover:underline block mt-1"
            >
              Chat on WhatsApp ➜
            </a>
          </div>
        </div>

        {/* Card 2: Email */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-800">Email Address</h4>
              <p className="text-[11px] text-slate-400 mt-1">Drop us your academic queries or verification requests.</p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-50">
            <a 
              href="mailto:gyaanpeethinfo@gmail.com" 
              className="block font-bold text-xs text-brand-700 hover:text-accent-600 transition-colors break-all"
            >
              gyaanpeethinfo@gmail.com
            </a>
            <span className="text-[10px] text-slate-400 block mt-1">Response within 24 hours</span>
          </div>
        </div>

        {/* Card 3: Office Hours */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-800">Operating Hours</h4>
              <p className="text-[11px] text-slate-400 mt-1">Visit or call us during our core business timings.</p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-50 text-xs">
            <div className="font-bold text-brand-700">Mon–Sat, 9am–6pm</div>
            <span className="text-[10px] text-amber-600 font-medium block mt-1">Closed on Sundays & National Holidays</span>
          </div>
        </div>

        {/* Card 4: Office Location */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-800">Headquarters Address</h4>
              <p className="text-[11px] text-slate-400 mt-1">Shop No 2nd, 35 Ext Subhash Nagar, Bhilwara.</p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-50">
            <a 
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[11px] text-brand-700 hover:text-accent-600 transition-colors"
            >
              View Google Map <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">Plus Code: 9J6H+8CC</span>
          </div>
        </div>
      </div>

      {/* Main Section: Address Details & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Address & Maps details */}
        <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-60 h-60 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-accent-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full inline-block">
              Corporate Location
            </span>
            <h3 className="font-display font-bold text-xl md:text-2xl">Visit Our Registered Offices</h3>
            
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block text-white">Registered Address:</span>
                  <p className="leading-relaxed">
                    Shop No 2nd, 35 Ext Subhash Nagar, Near Ajmer Road, Bhilwara, Rajasthan 311001
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Map className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block text-white">Google Maps Pin Code Location:</span>
                  <p className="font-mono text-slate-400 leading-normal">
                    {mapAddress}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block text-white">Advisory panel verification</span>
                  <p>
                    All acclamations, admissions checklists, and distance education mappings provided here are fully verified by our central Bhilwara advisory bureau.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-accent-500 hover:bg-accent-600 text-brand-950 font-bold rounded-xl text-xs transition-colors inline-flex items-center justify-center gap-1.5 shadow-md shadow-accent-500/10"
              >
                <MapPin className="w-4 h-4" />
                Open Directions in Google Maps
              </a>
              <button
                onClick={onOpenForm}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors inline-flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <MessageSquare className="w-4 h-4" />
                Schedule In-Person Counseling
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Submit Quick Inquiry Form */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-base text-slate-800">Quick Support Ticket</h3>
            <p className="text-[11px] text-slate-400">Can't call? Leave your details below and our team will get in touch with you.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Your Name *</label>
              <input 
                type="text" 
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-500 focus:bg-white transition-all text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Phone Number *</label>
                <input 
                  type="tel" 
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-500 focus:bg-white transition-all text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Email Address</label>
                <input 
                  type="email" 
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="e.g. rahul@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-500 focus:bg-white transition-all text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">How can we help you? *</label>
              <textarea 
                rows={3}
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Write your issue, question, or university preferences..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-500 focus:bg-white transition-all text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              Submit Support Request
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
