import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  University, Course, Blog, Review, AdmissionInquiry 
} from './types';
import Layout from './components/Layout';
import Hero from './components/Hero';
import CompareTool from './components/CompareTool';
import ScholarshipCalc from './components/ScholarshipCalc';
import AdminDashboard from './components/AdminDashboard';
import UniversityDetail from './pages/UniversityDetail';
import CourseDetail from './pages/CourseDetail';
import AdmissionForm from './pages/AdmissionForm';
import BlogPortal from './pages/BlogPortal';
import PremiumCourseExplorer from './components/PremiumCourseExplorer';
import PremiumUniversityExplorer from './components/PremiumUniversityExplorer';
import HelpCenter from './components/HelpCenter';
import { 
  Star, MapPin, Award, CheckCircle, TrendingUp, HelpCircle, 
  ArrowRight, ShieldCheck, ChevronDown, Check, Sparkles, Filter, Search 
} from 'lucide-react';
import { subscribeUniversities } from './lib/universitiesService';

export default function App() {
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // States fetched from Express backend API
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [homepageContent, setHomepageContent] = useState({
    announcement: '🔥 Admissions Open for Autumn 2026: Claim up to 50% tuition scholarship now!',
    tagline: 'Discover, Compare, and Enroll in India\'s Elite Online Degrees',
    subTagline: 'Make data-backed decisions. Compare DEB-UGC approved online MBA, MCA, BCA, and B.Tech options side-by-side with verified placement stats.'
  });

  // Comparison state
  const [selectedToCompare, setSelectedToCompare] = useState<string[]>([]);

  // Admissions prefill states
  const [prefilledUniName, setPrefilledUniName] = useState('');
  const [prefilledCourseName, setPrefilledCourseName] = useState('');
  const [claimedScholarshipPercent, setClaimedScholarshipPercent] = useState<number | null>(null);

  // University listing filters
  const [uniFilterType, setUniFilterType] = useState('All');
  const [uniSearchQuery, setUniSearchQuery] = useState('');

  // Course listing category selection
  const [courseCategoryFilter, setCourseCategoryFilter] = useState('All');

  // FAQ accordion state
  const [homeFaqIndex, setHomeFaqIndex] = useState<number | null>(null);

  // Fetch all states from server
  const loadDatabase = async () => {
    try {
      const cRes = await fetch('/api/courses');
      if (cRes.ok) setCourses(await cRes.json());

      const bRes = await fetch('/api/blogs');
      if (bRes.ok) setBlogs(await bRes.json());

      const rRes = await fetch('/api/reviews');
      if (rRes.ok) setReviews(await rRes.json());

      const hRes = await fetch('/api/homepage-content');
      if (hRes.ok) setHomepageContent(await hRes.json());
    } catch (err) {
      console.error('Error fetching database. Falling back to local states.', err);
    }
  };

  useEffect(() => {
    loadDatabase();

    // Subscribe to real-time updates of universities in Firestore
    const unsubscribe = subscribeUniversities((data) => {
      setUniversities(data);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSelectUniversity = (id: string) => {
    setSelectedUniId(id);
    setActiveView('university-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (id: string) => {
    setSelectedCourseId(id);
    setActiveView('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddReview = async (newRev: { userName: string; rating: number; comment: string }) => {
    if (!selectedUniId) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId: selectedUniId,
          ...newRev
        })
      });
      if (res.ok) {
        loadDatabase(); // Refresh ratings and lists
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Compare List actions
  const handleAddToCompare = (id: string) => {
    if (selectedToCompare.includes(id)) return;
    if (selectedToCompare.length >= 3) {
      alert('You can compare up to 3 universities at once.');
      return;
    }
    setSelectedToCompare(prev => [...prev, id]);
  };

  const handleRemoveFromCompare = (id: string) => {
    setSelectedToCompare(prev => prev.filter(item => item !== id));
  };

  // Scholarship Claim action
  const handleClaimScholarship = (percent: number) => {
    setClaimedScholarshipPercent(percent);
    setPrefilledUniName('');
    setPrefilledCourseName('');
    setActiveView('admission-query');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyNow = (uniName: string) => {
    setPrefilledUniName(uniName);
    setPrefilledCourseName('');
    setActiveView('admission-query');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyCourse = (courseName: string) => {
    setPrefilledUniName('');
    setPrefilledCourseName(courseName);
    setActiveView('admission-query');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredUnis = universities.filter(u => {
    const matchesType = uniFilterType === 'All' || u.type === uniFilterType;
    const matchesSearch = u.name.toLowerCase().includes(uniSearchQuery.toLowerCase()) || 
                          u.shortDesc.toLowerCase().includes(uniSearchQuery.toLowerCase()) ||
                          u.location.toLowerCase().includes(uniSearchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filteredCourses = courseCategoryFilter === 'All'
    ? courses
    : courses.filter(c => c.category === courseCategoryFilter);

  const currentUni = universities.find(u => u.id === selectedUniId);
  const currentCourse = courses.find(c => c.id === selectedCourseId);

  const homeFaqs = [
    { q: "Is an online degree from a UGC-DEB approved university valid?", a: "Yes, absolutely! According to the University Grants Commission (UGC) regulations, online degrees earned from UGC-DEB recognized universities are fully equivalent to regular offline degrees for central/state government employment, corporate roles, and pursuing higher academic goals globally." },
    { q: "How do semester examinations work in accredited online courses?", a: "Examinations are conducted via fully proctored, high-security online examination portals. Students can book exam slots and attempt their papers from their personal computers with webcams and continuous internet access, eliminating any physical travel." },
    { q: "Can I pay my tuition fee in monthly installment plans?", a: "Yes, UniPath collaborates directly with leading education finance partners to offer Zero-Interest, Zero-Markup EMI payment plans for up to 12 months, making premium online degrees highly affordable and accessible." },
    { q: "Does UniPath charge counselling fees from students?", a: "No! UniPath is a 100% free educational discovery and counseling aggregate portal. We operate as an authorized direct-channel admissions liaison with universities, offering objective guidance and authentic comparisons without any premium markups." }
  ];

  return (
    <Layout
      universities={universities}
      courses={courses}
      activeView={activeView}
      onNavigate={(view) => {
        setActiveView(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      onSelectUniversity={handleSelectUniversity}
      onSelectCourse={handleSelectCourse}
      announcement={homepageContent.announcement}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {/* HOME VIEW */}
          {activeView === 'home' && (
            <div className="space-y-12">
              <Hero
                homepageContent={homepageContent}
                onCategorySelect={(cat) => {
                  setCourseCategoryFilter(cat);
                  setActiveView('courses');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigate={(view) => {
                  setActiveView(view);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onQuickCompare={() => {
                  if (universities.length >= 2) {
                    setSelectedToCompare([universities[0].id, universities[1].id]);
                  }
                  setActiveView('universities');
                  // Scroll to compare block
                  setTimeout(() => {
                    document.getElementById('compare-tool-container')?.scrollIntoView({ behavior: 'smooth' });
                  }, 200);
                }}
              />

              {/* Compare section teaser (Interactive matrix inline) */}
              <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
                <CompareTool
                  universities={universities}
                  selectedToCompare={selectedToCompare}
                  onRemove={handleRemoveFromCompare}
                  onAdd={(id) => setSelectedToCompare(prev => [...prev, id])}
                  onClear={() => setSelectedToCompare([])}
                />
              </div>

              {/* Premium Course Explorer Section */}
              <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-4">
                <div className="text-left space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-accent-600 bg-slate-100 px-2.5 py-1 rounded-full inline-block">Dynamic Stream Discovery</span>
                  <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brand-700">Explore Degrees by Domain</h2>
                </div>
                <PremiumCourseExplorer 
                  onCompareCourse={handleApplyCourse}
                  onExploreDetail={(courseId) => {
                    const matchingCourse = courses.find(c => c.id === courseId || c.category.toLowerCase() === courseId.toLowerCase() || courseId.includes(c.id));
                    if (matchingCourse) {
                      handleSelectCourse(matchingCourse.id);
                    } else {
                      const fallbackCourse = courses.find(c => c.category === 'MBA' || c.id === 'mba');
                      if (fallbackCourse) {
                        handleSelectCourse(fallbackCourse.id);
                      }
                    }
                  }}
                />
              </div>

              {/* Premium University Explorer Section */}
              <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
                <PremiumUniversityExplorer 
                  onSelectUniversity={handleSelectUniversity}
                  onOpenCounsellingForm={() => {
                    setPrefilledUniName('');
                    setPrefilledCourseName('');
                    setActiveView('admission-form');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenCompare={() => {
                    if (universities.length >= 2) {
                      setSelectedToCompare([universities[0].id, universities[1].id]);
                    }
                    setTimeout(() => {
                      document.getElementById('compare-tool-container')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                />
              </div>

              {/* Scholarship Estimator Section (Interactive Card widget) */}
              <div className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-6 space-y-6 text-left">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-accent-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full inline-block">
                      Tuition Assistance Scheme
                    </span>
                    <h2 className="font-display font-extrabold text-2xl md:text-4xl text-white tracking-tight leading-tight">
                      Find Out Your Alumnus Scholarship eligibility instantly
                    </h2>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">
                      UniPath organizes structural discounts with colleges for qualified students. Fill out your previous academic scores and category details to unlock real-time tuition scholarships.
                    </p>

                    <div className="space-y-3 pt-4 border-t border-white/5 text-xs">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Up to 50% tuition waiver programs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Instant claiming with direct form pre-seeding</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <ScholarshipCalc onClaim={handleClaimScholarship} />
                  </div>
                </div>
              </div>

              {/* General Portal FAQs */}
              <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-6 text-left">
                <div className="text-center space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-accent-600">FAQ Hub</span>
                  <h2 className="font-display font-extrabold text-2xl text-brand-700">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-3 pt-2">
                  {homeFaqs.map((faq, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-sm">
                      <button
                        id={`home-faq-toggle-${idx}`}
                        type="button"
                        onClick={() => setHomeFaqIndex(homeFaqIndex === idx ? null : idx)}
                        className="w-full text-left p-5 flex items-center justify-between font-display font-semibold text-xs md:text-sm text-slate-800"
                      >
                        {faq.q}
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${homeFaqIndex === idx ? 'rotate-180' : ''}`} />
                      </button>
                      {homeFaqIndex === idx && (
                        <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed pt-1.5 border-t border-slate-50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* UNIVERSITIES LISTING VIEW */}
          {activeView === 'universities' && (
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 text-left">
              <div>
                <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brand-700">UGC-DEB Accredited Universities</h2>
                <p className="text-xs text-slate-500 pt-0.5">Compare, discover and select accredited programs with verified ratings and corporate statistics.</p>
              </div>

              {/* Compare matrix (collapsible) */}
              <CompareTool
                universities={universities}
                selectedToCompare={selectedToCompare}
                onRemove={handleRemoveFromCompare}
                onAdd={(id) => setSelectedToCompare(prev => [...prev, id])}
                onClear={() => setSelectedToCompare([])}
              />

              <PremiumUniversityExplorer 
                onSelectUniversity={handleSelectUniversity}
                onOpenCounsellingForm={() => {
                  setPrefilledUniName('');
                  setPrefilledCourseName('');
                  setActiveView('admission-form');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenCompare={() => {
                  if (universities.length >= 2) {
                    setSelectedToCompare([universities[0].id, universities[1].id]);
                  }
                  const element = document.getElementById('compare-tool-container');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
            </div>
          )}

          {/* COURSES LISTING VIEW */}
          {activeView === 'courses' && (
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 text-left animate-fadeIn">
              <div className="space-y-1">
                <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brand-700">Online Programs & Syllabi</h2>
                <p className="text-xs text-slate-500 pt-0.5">Explore comprehensive online degree courses with vetted job prospects and top academic providers on GyaanPeeth.</p>
              </div>

              <PremiumCourseExplorer 
                onCompareCourse={handleApplyCourse}
                onExploreDetail={(courseId) => {
                  const matchingCourse = courses.find(c => c.id === courseId || c.category.toLowerCase() === courseId.toLowerCase() || courseId.includes(c.id));
                  if (matchingCourse) {
                    handleSelectCourse(matchingCourse.id);
                  } else {
                    const fallbackCourse = courses.find(c => c.category === 'MBA' || c.id === 'mba');
                    if (fallbackCourse) {
                      handleSelectCourse(fallbackCourse.id);
                    }
                  }
                }}
              />
            </div>
          )}

          {/* SCHOLARSHIP PORTAL VIEW */}
          {activeView === 'scholarships' && (
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10 text-left">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="text-[10px] uppercase font-bold tracking-widest text-accent-600">Alumnus Assistant Portal</span>
                <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brand-700">Online Scholarship Eligibilities</h2>
                <p className="text-xs text-slate-500">Calculate eligibility levels and pre-seed tuition scholarships to secure verified tuition waivers dynamically.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <ScholarshipCalc onClaim={handleClaimScholarship} />
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-brand-700 text-white rounded-3xl p-6 border border-brand-600 shadow-xl space-y-4">
                    <h3 className="font-display font-bold text-sm text-white">How Scholarships Work</h3>
                    <ul className="space-y-3 text-xs text-slate-300">
                      <li className="flex gap-2 items-start">
                        <CheckCircle className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                        <span><strong>Step 1:</strong> Input previous academic grades and categories in our secure slider calculator.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                        <span><strong>Step 2:</strong> Instant eligibility checks. Scholarship awards are dynamically generated up to 50%.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                        <span><strong>Step 3:</strong> Claiming your scholarship immediately seeds your Admission application.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 text-xs text-emerald-800">
                    <span className="font-semibold block text-emerald-700 mb-1">Scholarship Guarantee</span>
                    <p className="text-[11px] text-emerald-600/80 leading-relaxed">
                      Approved percentages represent structural discount agreements with universities. Validity is guaranteed for Autumn 2026 enrollments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEWS / BLOG VIEW */}
          {activeView === 'blogs' && (
            <BlogPortal blogs={blogs} />
          )}

          {/* HELP CENTER VIEW */}
          {activeView === 'help' && (
            <HelpCenter onOpenForm={() => {
              setPrefilledUniName('');
              setPrefilledCourseName('');
              setActiveView('admission-query');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          )}

          {/* ADMISSION FORM VIEW */}
          {activeView === 'admission-query' && (
            <AdmissionForm
              universities={universities}
              courses={courses}
              prefilledUni={prefilledUniName}
              prefilledCourse={prefilledCourseName}
              claimedScholarship={claimedScholarshipPercent}
              onSubmitSuccess={() => {
                setClaimedScholarshipPercent(null);
                loadDatabase(); // Reload inquiries inside admin console
              }}
            />
          )}

          {/* ADMIN CONSOLE VIEW */}
          {activeView === 'admin' && (
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
              <AdminDashboard onRefreshAllData={loadDatabase} />
            </div>
          )}

          {/* UNIVERSITY DETAILS VIEW */}
          {activeView === 'university-detail' && currentUni && (
            <UniversityDetail
              university={currentUni}
              reviews={reviews}
              onAddReview={handleAddReview}
              onNavigate={(view) => {
                setActiveView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddToCompare={handleAddToCompare}
              onApplyNow={handleApplyNow}
            />
          )}

          {/* COURSE DETAILS VIEW */}
          {activeView === 'course-detail' && currentCourse && (
            <CourseDetail
              course={currentCourse}
              universities={universities}
              onSelectUniversity={handleSelectUniversity}
              onApplyCourse={handleApplyCourse}
            />
          )}

        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

