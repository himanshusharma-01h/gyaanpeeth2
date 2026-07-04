import React, { useState } from 'react';
import { University, Review } from '../types';
import { 
  Star, MapPin, Award, BookOpen, Users, DollarSign, Briefcase, 
  HelpCircle, MessageSquare, ChevronDown, Check, Send, Sparkles 
} from 'lucide-react';

interface UniversityDetailProps {
  university: University;
  reviews: Review[];
  onAddReview: (review: { userName: string; rating: number; comment: string }) => void;
  onNavigate: (view: string) => void;
  onAddToCompare: (id: string) => void;
  onApplyNow: (uniName: string) => void;
}

export default function UniversityDetail({
  university,
  reviews,
  onAddReview,
  onNavigate,
  onAddToCompare,
  onApplyNow
}: UniversityDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'fees' | 'placements' | 'faculty' | 'reviews' | 'faqs'>('overview');
  
  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // FAQ open/close index
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    onAddReview({
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const uniReviews = reviews.filter(r => r.universityId === university.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'fees', label: 'Programs & Fees', icon: DollarSign },
    { id: 'placements', label: 'Placements', icon: Briefcase },
    { id: 'faculty', label: 'Faculty Profiles', icon: Users },
    { id: 'reviews', label: 'Student Reviews', icon: MessageSquare },
    { id: 'faqs', label: 'Admissions FAQ', icon: HelpCircle }
  ];

  return (
    <div id="university-detail-canvas" className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      
      {/* Banner & Cover card */}
      <div className="relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-md">
        <img 
          src={university.coverImage} 
          alt={university.name} 
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Content overlapping banner */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex gap-4 items-center">
            <img 
              src={university.logo} 
              alt={university.name} 
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover bg-white p-1 shrink-0 border-2 border-white/20"
            />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent-500">{university.type} University</span>
              <h1 className="font-display font-bold text-xl md:text-3xl text-white">{university.name}</h1>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
                <MapPin className="w-4 h-4 text-accent-500" />
                {university.location}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              id="uni-detail-compare-btn"
              onClick={() => onAddToCompare(university.id)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors"
            >
              Add to Compare
            </button>
            <button
              id="uni-detail-apply-btn"
              onClick={() => onApplyNow(university.name)}
              className="px-5 py-2 bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md glow-hover"
            >
              Apply / Query Admissions
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Main content & Sidebar details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Detail tabs & panels */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-6">
          
          {/* Tab buttons */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-50 pb-4">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`detail-tab-toggle-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-brand-700 text-white font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-50 hover:bg-slate-100/50 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-display font-bold text-base text-brand-700">About the Institution</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{university.longDesc}</p>
              </div>

              {/* Accreditations display */}
              <div className="space-y-3">
                <h3 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-wider">Certifications & Accreditations</h3>
                <div className="flex flex-wrap gap-2">
                  {(university.accreditedBy || []).map((acc, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-brand-50/50 border border-brand-100 rounded-xl px-3 py-1.5 text-xs text-brand-700 font-bold shadow-inner">
                      <Award className="w-4 h-4 text-accent-500 fill-accent-500/10" />
                      {acc}
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="space-y-3">
                <h3 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-wider">Campus Showcase</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(university.gallery || []).map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt="Campus" 
                      className="rounded-2xl h-24 md:h-32 w-full object-cover border border-slate-100 hover:scale-102 transition-transform"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROGRAMS & FEES */}
          {activeTab === 'fees' && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-base text-brand-700">Offered Programs & Fees</h3>
              <p className="text-xs text-slate-500 mb-4">All courses listed are authorized by the Distance Education Bureau (DEB).</p>

              <div className="space-y-3">
                {(university.coursesOffered || []).map((course, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-slate-200 transition-colors">
                    <div>
                      <h4 className="font-display font-semibold text-sm text-slate-800">{course.courseName}</h4>
                      <p className="text-[11px] text-slate-400">Duration: {course.duration} • Eligibility: {course.eligibility}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase text-right">Tuition Fee</span>
                        <span className="block font-display font-extrabold text-sm text-brand-700">{course.fee}</span>
                      </div>
                      <button
                        id={`program-enquire-${course.courseId}`}
                        onClick={() => onApplyNow(university.name)}
                        className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-[10px] font-bold"
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PLACEMENTS */}
          {activeTab === 'placements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl text-center">
                  <span className="text-4xl font-display font-extrabold text-emerald-600">{university.placementSalaryAvg}</span>
                  <p className="text-[11px] text-slate-500 font-semibold pt-1">Average CTC Package Offered</p>
                </div>
                <div className="bg-brand-50/50 border border-brand-100 p-4 rounded-2xl text-center">
                  <span className="text-4xl font-display font-extrabold text-brand-600">{university.placementPercentage}%</span>
                  <p className="text-[11px] text-slate-500 font-semibold pt-1">Successful Employment Placement Rate</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-wider">Top Recruiting Partners</h3>
                <div className="flex flex-wrap gap-2">
                  {(university.topRecruiters || []).map((rec, i) => (
                    <span key={i} className="bg-slate-100 border border-slate-200/50 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
                      {rec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FACULTY */}
          {activeTab === 'faculty' && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-base text-brand-700">Experienced Faculty Advisory Panel</h3>
              <p className="text-xs text-slate-500">Learn from seasoned professors, academic designers, and veteran corporate practitioners.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(university.faculty || []).map((member, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-4 items-center">
                    <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-800">{member.name}</h4>
                      <p className="text-[11px] text-slate-400">{member.designation} • {member.qualification}</p>
                      <span className="text-[10px] text-accent-600 font-bold">Exp: {member.experience}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: STUDENT REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h3 className="font-display font-bold text-base text-brand-700">Verified Student Reviews</h3>

              {/* Existing reviews */}
              <div className="space-y-3">
                {uniReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No reviews published yet for this institution. Be the first to leave one!</p>
                ) : (
                  uniReviews.map(rev => (
                    <div key={rev.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 text-xs">{rev.userName}</span>
                          <span className="bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wide">
                            Verified Alumnus
                          </span>
                        </div>
                        <div className="flex text-amber-400 shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 italic">"{rev.comment}"</p>
                      <span className="text-[10px] text-slate-400 block pt-1.5">{rev.date}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Leave a review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4">
                <h4 className="font-display font-bold text-xs text-slate-700 flex items-center gap-1">
                  <MessageSquare className="w-4.5 h-4.5 text-accent-500" />
                  Leave a Verified Alumnus Review
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">Your Full Name</label>
                    <input
                      id="review-form-name"
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Siddharth Roy"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Your Rating</label>
                    <select
                      id="review-form-rating"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                      <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                      <option value="3">⭐⭐⭐ 3 Stars</option>
                      <option value="2">⭐⭐ 2 Stars</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-500 mb-1">Feedback Comment</label>
                  <textarea
                    id="review-form-comment"
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Write honest reviews about learning management, proctored online exams, study materials and placement supports..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                {reviewSubmitted && (
                  <div className="p-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    Review published! It is visible across UniPath now.
                  </div>
                )}

                <button
                  id="submit-review-form-btn"
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Publish Verified Review
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-base text-brand-700">University Admissions & LMS FAQs</h3>

              <div className="space-y-2">
                {(university.faqs || []).map((faq, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50">
                    <button
                      id={`faq-accordion-toggle-${idx}`}
                      type="button"
                      onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                      className="w-full text-left p-4 flex items-center justify-between font-display font-semibold text-xs text-brand-700"
                    >
                      {faq.question}
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${faqOpenIndex === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {faqOpenIndex === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-100/30">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Quick admission info cards & highlights */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick stats panel */}
          <div className="bg-brand-700 text-white rounded-3xl p-6 border border-brand-600 shadow-xl space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent-500">Institution Badges</span>
              <h3 className="font-display font-bold text-lg text-white pt-1">{university.name}</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-brand-600/50 pb-2">
                <span className="text-slate-300">University Rank</span>
                <span className="font-bold text-accent-500">{university.rank}</span>
              </div>
              <div className="flex justify-between border-b border-brand-600/50 pb-2">
                <span className="text-slate-300">UGC-DEB Status</span>
                <span className="font-bold text-emerald-400">Approved</span>
              </div>
              <div className="flex justify-between border-b border-brand-600/50 pb-2">
                <span className="text-slate-300">Established Year</span>
                <span className="font-bold">{university.establishedYear}</span>
              </div>
              <div className="flex justify-between border-b border-brand-600/50 pb-2">
                <span className="text-slate-300">Examination Mode</span>
                <span className="font-bold">Fully Online Proctored</span>
              </div>
            </div>

            <div className="p-3 bg-brand-600/40 rounded-2xl flex items-start gap-2.5 text-[11px] text-slate-200 leading-relaxed border border-brand-500/20">
              <Sparkles className="w-4.5 h-4.5 text-accent-500 shrink-0 mt-0.5" />
              <span>
                Need 1-on-1 advice? Speak with our certified educational consultant to schedule an elite documentation validation call.
              </span>
            </div>

            <button
              id="sidebar-admission-form-btn"
              onClick={() => onApplyNow(university.name)}
              className="w-full bg-accent-500 hover:bg-accent-600 text-slate-950 font-extrabold text-xs py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-1.5 glow-hover"
            >
              Start Free Online Enquiry
            </button>
          </div>

          {/* Secure Guarantee */}
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 text-left text-xs space-y-2 text-emerald-800">
            <span className="font-semibold block text-emerald-700">100% Secure Admissions</span>
            <p className="text-[11px] text-emerald-600/80 leading-relaxed">
              We coordinate directly with university admissions divisions. Zero premium markups, zero hidden processing charges.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
