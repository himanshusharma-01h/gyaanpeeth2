import React, { useState } from 'react';
import { University, Course } from '../types';
import { 
  Send, ShieldCheck, CheckCircle, MessageSquare, Sparkles, 
  HelpCircle, Calendar, GraduationCap, ChevronRight 
} from 'lucide-react';

interface AdmissionFormProps {
  universities: University[];
  courses: Course[];
  prefilledUni?: string;
  prefilledCourse?: string;
  claimedScholarship?: number | null;
  onSubmitSuccess: () => void;
}

export default function AdmissionForm({
  universities,
  courses,
  prefilledUni = '',
  prefilledCourse = '',
  claimedScholarship = null,
  onSubmitSuccess
}: AdmissionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    qualification: 'Graduation',
    universityInterested: prefilledUni,
    courseInterested: prefilledCourse,
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txnId, setTxnId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    const payload = {
      ...formData,
      scholarshipClaimed: claimedScholarship ? `${claimedScholarship}%` : undefined
    };

    try {
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Admissions API issue');
      }

      setTxnId(data.data?.id || `ADM-${Math.floor(100000 + Math.random() * 900000)}`);
      setSuccess(true);
      onSubmitSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Admissions system error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admission-form-wrapper" className="max-w-4xl mx-auto px-4 md:px-8 py-10 text-left">
      
      {!success ? (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Form Info */}
          <div className="lg:col-span-4 brand-gradient p-6 md:p-8 text-white flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full inline-block">
                Portal Security Verified
              </span>
              <h2 className="font-display font-extrabold text-xl md:text-2xl text-white">
                Start Your Admissions Journey Today
              </h2>
              <p className="text-slate-300 text-xs leading-relaxed">
                Fill out the secure application query. A senior panel advisor will review your educational qualification background and verify eligibility.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-accent-500 shrink-0" />
                <span>Authorized DEB-UGC Liaison</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-accent-500 shrink-0" />
                <span>Admission Decision in 24 Hours</span>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-accent-500 shrink-0" />
                <span>Zero Interest EMI Assurances</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 p-6 md:p-8 space-y-4 text-xs text-slate-700">
            
            <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-sm text-slate-800">Direct Academic Query</h3>
                <p className="text-[10px] text-slate-400">All fields are secured under standard client privacy regulations</p>
              </div>
              {claimedScholarship && (
                <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold px-2.5 py-1 rounded-full text-[10px] animate-pulse flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-emerald-500/10 text-emerald-500" />
                  {claimedScholarship}% Scholarship Applied
                </span>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-500 font-semibold rounded-xl">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-500 mb-1">Full Student Name *</label>
                <input
                  id="admission-name-input"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Siddharth"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Email Address *</label>
                <input
                  id="admission-email-input"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. student@unipath.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-500 mb-1">Phone Number *</label>
                <input
                  id="admission-phone-input"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">City / Location</label>
                <input
                  id="admission-location-input"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-500 mb-1">Interested University</label>
                <select
                  id="admission-uni-select"
                  value={formData.universityInterested}
                  onChange={(e) => setFormData({ ...formData, universityInterested: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-slate-800"
                >
                  <option value="">-- Direct Open Entry / Counsel Me --</option>
                  {universities.map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Interested Degree Stream</label>
                <select
                  id="admission-course-select"
                  value={formData.courseInterested}
                  onChange={(e) => setFormData({ ...formData, courseInterested: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-slate-800"
                >
                  <option value="">-- Speak with Specialist --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Educational Qualification</label>
              <div className="grid grid-cols-3 gap-2">
                {['12th Pass', 'Graduation', 'Postgraduation'].map((qual) => (
                  <button
                    key={qual}
                    id={`qual-btn-${qual}`}
                    type="button"
                    onClick={() => setFormData({ ...formData, qualification: qual })}
                    className={`px-3 py-2.5 rounded-xl border text-center font-medium transition-all ${
                      formData.qualification === qual
                        ? 'border-brand-500 bg-brand-50/50 text-brand-700 font-bold shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-white'
                    }`}
                  >
                    {qual}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Query Message (Optional)</label>
              <textarea
                id="admission-message-input"
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention specific preferences (fees structures, EMI installment plans, etc.)"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>

            <button
              id="submit-admission-enquiry-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting query...' : 'Submit Admission Enquiry'}
            </button>

          </form>

        </div>
      ) : (
        <div id="admission-success-card" className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl max-w-xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-50 rounded-full text-emerald-500 mb-2 border border-emerald-100">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-100/50 px-3 py-1 rounded-full border border-emerald-200">
              Admission Submission Successful
            </span>
            <h3 className="font-display font-extrabold text-xl md:text-2xl text-slate-800 pt-2">
              Dossier Generated Successfully!
            </h3>
            <p className="text-slate-400 text-xs">
              Thank you, {formData.name}. Your educational file has been transmitted to our primary admissions desk.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Transaction ID</span>
              <span className="font-bold text-slate-700 font-mono">{txnId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Interest Program</span>
              <span className="font-bold text-slate-700">{formData.courseInterested || 'General Counselling'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Advisory Window</span>
              <span className="font-bold text-emerald-600">Within 2 Hours</span>
            </div>
          </div>

          <div className="space-y-2">
            <a
              id="success-whatsapp-cta"
              href={`https://wa.me/919876543210?text=Hi!%20My%20Admissions%20ID%20is%20${txnId}.%2520I%20just%20submitted%20my%20form%20for%20${formData.courseInterested || 'Counselling'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              Accelerate Admissions on WhatsApp
            </a>

            <button
              id="success-back-to-home"
              onClick={() => {
                setSuccess(false);
                setFormData({
                  name: '', email: '', phone: '', location: '', qualification: 'Graduation',
                  universityInterested: '', courseInterested: '', message: ''
                });
              }}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold transition-colors block mx-auto pt-1"
            >
              Submit another query
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
