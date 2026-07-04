import React, { useState, useEffect } from 'react';
import { University, Course, Blog, AdmissionInquiry, Review } from '../types';
import { 
  Plus, Edit, Trash, BookOpen, GraduationCap, Users, MessageSquare, 
  FileText, Home, Check, RefreshCw, X, AlertCircle, Save, Upload, Sparkles,
  Lock, Unlock, Eye, EyeOff, LogOut
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { 
  subscribeUniversities, 
  addUniversity, 
  updateUniversity, 
  removeUniversity, 
  seedUniversitiesIfEmpty 
} from '../lib/universitiesService';
import { FirestoreUniversity } from '../data/universitiesData';

interface AdminDashboardProps {
  onRefreshAllData: () => void;
}

export default function AdminDashboard({ onRefreshAllData }: AdminDashboardProps) {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('gyaanpeeth_admin_authenticated') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (usernameInput.trim() === 'akhilsomani@gyaanpeeth' && passwordInput === 'gyaanpeeth@123') {
      setIsAuthenticated(true);
      localStorage.setItem('gyaanpeeth_admin_authenticated', 'true');
    } else {
      setAuthError('Invalid administrator credentials. Please check and try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('gyaanpeeth_admin_authenticated');
    setUsernameInput('');
    setPasswordInput('');
  };

  const [activeTab, setActiveTab] = useState<'universities' | 'courses' | 'admissions' | 'reviews' | 'blogs' | 'homepage'>('universities');
  
  // States from API
  const [unis, setUnis] = useState<University[]>([]);
  const [firestoreUnis, setFirestoreUnis] = useState<FirestoreUniversity[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionInquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [homepageContent, setHomepageContent] = useState({ announcement: '', tagline: '', subTagline: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit / Add Modal state
  const [modalType, setModalType] = useState<'add-uni' | 'edit-uni' | 'add-course' | 'edit-course' | 'add-blog' | 'edit-blog' | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Logo upload state
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Form structures
  const [uniForm, setUniForm] = useState({
    name: '', 
    type: 'Private', 
    location: '', 
    state: 'Karnataka',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=150&h=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&h=400&q=80',
    rating: 4.5, 
    reviewsCount: 120,
    establishedYear: 2010,
    coursesCount: 12,
    rank: 'Top Tier University', 
    shortDesc: 'A leading provider of high-quality online degrees accredited globally.', 
    longDesc: 'Our university delivers standard accredited modules built for job promotion and dynamic enterprise learning pathways.', 
    feeRange: '₹1,50,000 - ₹2,50,000', 
    accreditedBy: 'UGC-DEB, AICTE, NAAC A+',
    naacGrade: 'A+',
    aicteApproved: true,
    ugcApproved: true,
    degrees: 'MBA, BCA, MCA, BBA',
    specializations: 'Marketing, Finance, Data Science, HR',
    placementSalaryAvg: '7.5 LPA', 
    placementPercentage: 90, 
    topRecruiters: 'TCS, Cognizant, Wipro, Infosys'
  });

  const [courseForm, setCourseForm] = useState({
    name: '', level: 'Undergraduate', duration: '3 Years', category: 'MBA',
    fee: '', description: '', syllabus: '', careerProspects: ''
  });

  const [blogForm, setBlogForm] = useState({
    title: '', excerpt: '', content: '', category: 'Career Guide', author: 'GyaanPeeth Expert',
    image: '', tags: ''
  });

  // Fetch all states from Express backend API
  const fetchAllStates = async () => {
    setLoading(true);
    setError(null);
    try {
      const uRes = await fetch('/api/universities');
      const cRes = await fetch('/api/courses');
      const aRes = await fetch('/api/admissions');
      const rRes = await fetch('/api/reviews');
      const bRes = await fetch('/api/blogs');
      const hRes = await fetch('/api/homepage-content');

      setUnis(await uRes.json());
      setCourses(await cRes.json());
      setAdmissions(await aRes.json());
      setReviews(await rRes.json());
      setBlogs(await bRes.json());
      setHomepageContent(await hRes.json());
    } catch (err: any) {
      console.error(err);
      setError('Error connecting to Admin APIs. Ensure dev server is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStates();

    // Seed and listen to real-time updates of universities
    let unsubscribe: (() => void) | undefined;
    seedUniversitiesIfEmpty().then(() => {
      unsubscribe = subscribeUniversities((data) => {
        setFirestoreUnis(data);
      });
    }).catch(err => {
      console.error('Error seeding/subscribing universities in admin console:', err);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const triggerGlobalSync = () => {
    fetchAllStates();
    onRefreshAllData();
  };

  // ----------------------------------------------------
  // Admissions Inquiry Actions
  // ----------------------------------------------------
  const updateAdmissionsStatus = async (id: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/admissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) triggerGlobalSync();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAdmissionsInquiry = async (id: string) => {
    if (!window.confirm('Delete this student inquiry?')) return;
    try {
      await fetch(`/api/admissions/${id}`, { method: 'DELETE' });
      triggerGlobalSync();
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // Review Actions
  // ----------------------------------------------------
  const deleteReview = async (id: string) => {
    if (!window.confirm('Delete this student review?')) return;
    try {
      await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      triggerGlobalSync();
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // Homepage content
  // ----------------------------------------------------
  const saveHomepageContent = async () => {
    try {
      const res = await fetch('/api/homepage-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homepageContent)
      });
      if (res.ok) {
        alert('Homepage content updated successfully!');
        triggerGlobalSync();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // ----------------------------------------------------
  // Logo upload to Firebase Storage
  // ----------------------------------------------------
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const storageRef = ref(storage, `university-logos/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setUniForm(prev => ({ ...prev, logo: downloadURL }));
      alert('Logo uploaded successfully to Firebase Storage!');
    } catch (err: any) {
      console.error(err);
      alert('Failed to upload logo: ' + err.message);
    } finally {
      setLogoUploading(false);
    }
  };

  // ----------------------------------------------------
  // Delete Universities & Courses
  // ----------------------------------------------------
  const deleteUni = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this university from Firestore?')) return;
    try {
      setLoading(true);
      await removeUniversity(id);
      triggerGlobalSync();
    } catch (err: any) {
      console.error(err);
      alert('Error deleting university: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      triggerGlobalSync();
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // Submit Form Handlers
  // ----------------------------------------------------
  const handleUniSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Omit<FirestoreUniversity, 'id'> = {
      name: uniForm.name,
      type: uniForm.type,
      location: uniForm.location,
      state: uniForm.state,
      logo: uniForm.logo,
      coverImage: uniForm.coverImage,
      rating: Number(uniForm.rating) || 4.5,
      reviewsCount: Number(uniForm.reviewsCount) || 120,
      establishedYear: Number(uniForm.establishedYear) || 2010,
      coursesCount: Number(uniForm.coursesCount) || 12,
      rank: uniForm.rank,
      shortDesc: uniForm.shortDesc,
      longDesc: uniForm.longDesc,
      feeRange: uniForm.feeRange,
      accreditedBy: uniForm.accreditedBy.split(',').map(s => s.trim()).filter(Boolean),
      naacGrade: uniForm.naacGrade || undefined,
      aicteApproved: uniForm.aicteApproved,
      ugcApproved: uniForm.ugcApproved,
      degrees: uniForm.degrees.split(',').map(s => s.trim()).filter(Boolean),
      specializations: uniForm.specializations.split(',').map(s => s.trim()).filter(Boolean),
      placementSalaryAvg: uniForm.placementSalaryAvg,
      placementPercentage: Number(uniForm.placementPercentage) || 90,
      topRecruiters: uniForm.topRecruiters.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (modalType === 'edit-uni' && selectedId) {
        await updateUniversity(selectedId, payload);
        alert('University profile updated in Firestore successfully!');
      } else {
        await addUniversity(payload);
        alert('New university profile created in Firestore successfully!');
      }
      setModalType(null);
      triggerGlobalSync();
    } catch (err: any) {
      console.error(err);
      alert('Failed to save university to Firestore: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...courseForm,
      syllabus: courseForm.syllabus.split(',').map(s => s.trim()).filter(Boolean),
      careerProspects: courseForm.careerProspects.split(',').map(c => c.trim()).filter(Boolean)
    };

    try {
      const url = modalType === 'edit-course' ? `/api/courses/${selectedId}` : '/api/courses';
      const method = modalType === 'edit-course' ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setModalType(null);
        triggerGlobalSync();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...blogForm,
      tags: blogForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      const url = modalType === 'edit-blog' ? `/api/blogs/${selectedId}` : '/api/blogs';
      const method = modalType === 'edit-blog' ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setModalType(null);
        triggerGlobalSync();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div id="admin-login-container" className="max-w-md mx-auto my-12 bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800">
        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-500 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-white">Administrator Portal</h2>
            <p className="text-xs text-slate-400 mt-1">Please enter your credentials to access GyaanPeeth console</p>
          </div>
        </div>

        {authError && (
          <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-2.5 text-xs font-medium animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username / Email</label>
            <input
              id="admin-username-input"
              type="text"
              required
              placeholder="name@gyaanpeeth"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-accent-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
            </div>
            <div className="relative">
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-accent-500 transition-colors"
              />
              <button
                type="button"
                id="admin-password-visibility-btn"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <button
            id="admin-submit-login-btn"
            type="submit"
            className="w-full bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold text-xs py-3 rounded-xl transition-all shadow-md mt-6 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Unlock className="w-4 h-4" />
            Unlock Console
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-medium">Secured with End-to-End Environment Credentials</span>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-container" className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <h2 className="font-display font-bold text-xl md:text-2xl text-white flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-accent-500" />
            GyaanPeeth Core Administrator Console
          </h2>
          <p className="text-xs text-slate-400">Add, edit, or delete platform universities, admissions, courses, and settings in real-time</p>
        </div>
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            id="admin-refresh-btn"
            onClick={fetchAllStates}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Force Sync Database
          </button>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl flex items-center gap-3 text-xs font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-4 mb-6">
        {[
          { id: 'universities', label: 'Universities', icon: BookOpen },
          { id: 'courses', label: 'Courses Offered', icon: GraduationCap },
          { id: 'admissions', label: 'Admissions Queries', icon: Users, badge: admissions.filter(a => a.status === 'Pending').length },
          { id: 'reviews', label: 'Student Reviews', icon: MessageSquare },
          { id: 'blogs', label: 'News & Blogs', icon: FileText },
          { id: 'homepage', label: 'Home Configurations', icon: Home }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`admin-tab-toggle-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeTab === tab.id
                  ? 'bg-accent-500 text-slate-950 border-accent-500 font-bold'
                  : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.badge && tab.badge > 0 ? (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 animate-pulse">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* 1. UNIVERSITIES TAB */}
      {activeTab === 'universities' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-semibold text-sm text-white">Active Firestore Universities ({firestoreUnis.length})</h3>
            <button
              id="add-uni-btn"
              onClick={() => {
                setUniForm({
                  name: '', 
                  type: 'Private', 
                  location: '', 
                  state: 'Karnataka',
                  logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=150&h=150&q=80',
                  coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&h=400&q=80',
                  rating: 4.5, 
                  reviewsCount: 120,
                  establishedYear: 2010,
                  coursesCount: 12,
                  rank: 'NIRF Rank Tier 1', 
                  shortDesc: 'A leading provider of high-quality accredited online degrees.', 
                  longDesc: 'Our university delivers standard accredited modules built for job promotion and dynamic enterprise learning pathways.', 
                  feeRange: '₹1,50,000 - ₹2,50,000', 
                  accreditedBy: 'UGC-DEB, AICTE, NAAC A+',
                  naacGrade: 'A+',
                  aicteApproved: true,
                  ugcApproved: true,
                  degrees: 'MBA, BCA, MCA, BBA',
                  specializations: 'Marketing, Finance, Data Science, HR',
                  placementSalaryAvg: '7.5 LPA', 
                  placementPercentage: 90, 
                  topRecruiters: 'TCS, Cognizant, Wipro, Infosys'
                });
                setModalType('add-uni');
                setSelectedId(null);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New University
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {firestoreUnis.map(uni => (
              <div key={uni.id} className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex gap-4 items-center justify-between">
                <div className="flex gap-3 items-center min-w-0">
                  <img src={uni.logo} alt={uni.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700" />
                  <div className="min-w-0">
                    <h4 className="font-display font-semibold text-sm text-white truncate">{uni.name}</h4>
                    <p className="text-[11px] text-slate-400">{uni.location} • {uni.type} University</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {uni.ugcApproved && <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-bold">UGC</span>}
                      {uni.naacGrade && <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">NAAC {uni.naacGrade}</span>}
                      {uni.aicteApproved && <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">AICTE</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    id={`edit-uni-${uni.id}`}
                    onClick={() => {
                      setSelectedId(uni.id);
                      setUniForm({
                        name: uni.name,
                        type: uni.type,
                        location: uni.location,
                        state: uni.state || 'Karnataka',
                        logo: uni.logo,
                        coverImage: uni.coverImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&h=400&q=80',
                        rating: uni.rating || 4.5,
                        reviewsCount: uni.reviewsCount || 100,
                        establishedYear: uni.establishedYear || 2010,
                        coursesCount: uni.coursesCount || 12,
                        rank: uni.rank || '',
                        shortDesc: uni.shortDesc || '',
                        longDesc: uni.longDesc || '',
                        feeRange: uni.feeRange || '',
                        accreditedBy: (uni.accreditedBy || []).join(', '),
                        naacGrade: uni.naacGrade || '',
                        aicteApproved: uni.aicteApproved !== false,
                        ugcApproved: uni.ugcApproved !== false,
                        degrees: (uni.degrees || []).join(', '),
                        specializations: (uni.specializations || []).join(', '),
                        placementSalaryAvg: uni.placementSalaryAvg || '6.0 LPA',
                        placementPercentage: uni.placementPercentage || 90,
                        topRecruiters: (uni.topRecruiters || []).join(', ')
                      });
                      setModalType('edit-uni');
                    }}
                    className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    id={`delete-uni-${uni.id}`}
                    onClick={() => deleteUni(uni.id)}
                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-all"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. COURSES TAB */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-semibold text-sm text-white">Active Degrees ({courses.length})</h3>
            <button
              id="add-course-btn"
              onClick={() => {
                setCourseForm({
                  name: '', level: 'Postgraduate', duration: '2 Years', category: 'MBA',
                  fee: '₹1,50,000 - ₹3,000,000', description: '', syllabus: 'Sem 1, Sem 2, Sem 3, Sem 4',
                  careerProspects: 'Manager, Executive'
                });
                setModalType('add-course');
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(course => (
              <div key={course.id} className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-display font-semibold text-sm text-white">{course.name}</h4>
                  <p className="text-[11px] text-slate-400">{course.level} • {course.duration}</p>
                  <span className="text-[10px] font-semibold bg-brand-600/30 border border-brand-500/30 text-slate-300 px-2 py-0.5 rounded-md inline-block mt-2">
                    Category: {course.category}
                  </span>
                </div>
                <button
                  id={`delete-course-${course.id}`}
                  onClick={() => deleteCourse(course.id)}
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-all"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ADMISSIONS TAB */}
      {activeTab === 'admissions' && (
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-sm text-white">Admissions & Counseling Queries ({admissions.length})</h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-800 text-left text-xs text-slate-300">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-800 font-semibold text-white">
                  <th className="p-3">Student Details</th>
                  <th className="p-3">Interested Program</th>
                  <th className="p-3">Preferred College</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {admissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">No student admission applications received yet.</td>
                  </tr>
                ) : (
                  admissions.map(adm => (
                    <tr key={adm.id} className="hover:bg-slate-800/20">
                      <td className="p-3">
                        <p className="font-semibold text-white">{adm.name}</p>
                        <p className="text-[10px] text-slate-400">{adm.email} • {adm.phone}</p>
                        <p className="text-[9px] text-slate-500">From {adm.location} • Qual: {adm.qualification}</p>
                      </td>
                      <td className="p-3 font-semibold text-brand-400">{adm.courseInterested}</td>
                      <td className="p-3 text-slate-400">{adm.universityInterested}</td>
                      <td className="p-3">
                        <select
                          id={`inquiry-status-select-${adm.id}`}
                          value={adm.status}
                          onChange={(e) => updateAdmissionsStatus(adm.id, e.target.value)}
                          className="bg-slate-900 border border-slate-800 text-xs px-2 py-1 rounded text-white font-medium focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Admitted">Admitted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          id={`delete-inquiry-${adm.id}`}
                          onClick={() => deleteAdmissionsInquiry(adm.id)}
                          className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-sm text-white">Student Reviews & Rating Database ({reviews.length})</h3>

          <div className="space-y-3">
            {reviews.map(rev => (
              <div key={rev.id} className="bg-slate-800/30 border border-slate-800 rounded-2xl p-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-semibold text-white">{rev.userName}</span>
                    <span className="text-[10px] text-slate-400">posted for</span>
                    <span className="text-xs font-semibold text-accent-500">{rev.universityName}</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                  <span className="text-[10px] text-amber-400 block mt-2">Rating: {rev.rating} / 5.0</span>
                </div>
                <button
                  id={`delete-review-${rev.id}`}
                  onClick={() => deleteReview(rev.id)}
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-all shrink-0"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BLOGS TAB */}
      {activeTab === 'blogs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-semibold text-sm text-white">News & Career Blogs ({blogs.length})</h3>
            <button
              id="add-blog-tab-btn"
              onClick={() => {
                setBlogForm({
                  title: '', excerpt: '', content: '', category: 'Career Guide', author: 'UniPath Panel',
                  image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&h=500&q=80',
                  tags: 'Online Education, MBA, Guide'
                });
                setModalType('add-blog');
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Publish New Article
            </button>
          </div>

          <div className="space-y-3">
            {blogs.map(blog => (
              <div key={blog.id} className="bg-slate-800/30 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-semibold text-sm text-white">{blog.title}</h4>
                  <p className="text-[11px] text-slate-400">By {blog.author} on {blog.date} • {blog.category}</p>
                </div>
                <button
                  id={`delete-blog-${blog.id}`}
                  onClick={() => {
                    if (window.confirm('Delete this article?')) {
                      fetch(`/api/blogs/${blog.id}`, { method: 'DELETE' }).then(triggerGlobalSync);
                    }
                  }}
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-all"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. HOMEPAGE TAB */}
      {activeTab === 'homepage' && (
        <div className="space-y-4 max-w-xl">
          <h3 className="font-display font-semibold text-sm text-white">Hero Section Branding Configuration</h3>

          <div className="space-y-3 bg-slate-800/20 border border-slate-800 p-5 rounded-2xl">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Announcement Banner</label>
              <input
                id="homepage-banner-input"
                type="text"
                value={homepageContent.announcement}
                onChange={(e) => setHomepageContent({ ...homepageContent, announcement: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-accent-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Branding Headline</label>
              <input
                id="homepage-tagline-input"
                type="text"
                value={homepageContent.tagline}
                onChange={(e) => setHomepageContent({ ...homepageContent, tagline: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-accent-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Headline Sub-desc</label>
              <textarea
                id="homepage-subtagline-input"
                value={homepageContent.subTagline}
                onChange={(e) => setHomepageContent({ ...homepageContent, subTagline: e.target.value })}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-accent-500"
              />
            </div>

            <button
              id="save-homepage-btn"
              onClick={saveHomepageContent}
              className="flex items-center justify-center gap-1.5 w-full bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold text-xs py-3 rounded-xl transition-all shadow-md mt-4"
            >
              <Save className="w-4 h-4" />
              Save Layout Configuration
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODALS & FORMS
          ---------------------------------------------------- */}
      {modalType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh] space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-display font-semibold text-sm text-white">
                {modalType === 'add-uni' ? 'Add New University Profile' : modalType === 'edit-uni' ? 'Edit University Profile' : modalType === 'add-course' ? 'Add New Course Offering' : 'Publish Article'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* University Add/Edit Form */}
            {(modalType === 'add-uni' || modalType === 'edit-uni') && (
              <form onSubmit={handleUniSubmit} className="space-y-3.5 text-xs">
                {/* Logo Uploader */}
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
                  <span className="block font-bold text-slate-300 uppercase tracking-wider text-[10px]">University Branding & Logo</span>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center shrink-0">
                      <img src={uniForm.logo} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer w-fit transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        {logoUploading ? 'Uploading Logo...' : 'Upload Logo to Firebase Storage'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleLogoUpload} 
                          disabled={logoUploading}
                          className="hidden" 
                        />
                      </label>
                      <p className="text-[9px] text-slate-400">Securely stores asset in Google Cloud Storage and returns dynamic URL</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Direct Logo URL (Fallback)</label>
                    <input
                      id="uni-form-logo"
                      type="text"
                      value={uniForm.logo}
                      onChange={(e) => setUniForm({ ...uniForm, logo: e.target.value })}
                      placeholder="Or enter direct image URL"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[10px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">University Name</label>
                    <input
                      id="uni-form-name"
                      type="text"
                      required
                      value={uniForm.name}
                      onChange={(e) => setUniForm({ ...uniForm, name: e.target.value })}
                      placeholder="e.g. Amity University Online"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">University Type</label>
                    <select
                      id="uni-form-type"
                      value={uniForm.type}
                      onChange={(e) => setUniForm({ ...uniForm, type: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Private">Private</option>
                      <option value="Deemed">Deemed</option>
                      <option value="Central">Central</option>
                      <option value="State">State</option>
                      <option value="Online">Online</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">City / Location</label>
                    <input
                      id="uni-form-location"
                      type="text"
                      required
                      value={uniForm.location}
                      onChange={(e) => setUniForm({ ...uniForm, location: e.target.value })}
                      placeholder="e.g. Noida, Uttar Pradesh"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">State</label>
                    <input
                      id="uni-form-state"
                      type="text"
                      required
                      value={uniForm.state}
                      onChange={(e) => setUniForm({ ...uniForm, state: e.target.value })}
                      placeholder="e.g. Uttar Pradesh, Karnataka, Punjab"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Fee Range</label>
                    <input
                      id="uni-form-feerange"
                      type="text"
                      required
                      value={uniForm.feeRange}
                      onChange={(e) => setUniForm({ ...uniForm, feeRange: e.target.value })}
                      placeholder="e.g. ₹1,40,000 - ₹3,50,000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">NIRF Rank / Autonomy status</label>
                    <input
                      id="uni-form-rank"
                      type="text"
                      required
                      value={uniForm.rank}
                      onChange={(e) => setUniForm({ ...uniForm, rank: e.target.value })}
                      placeholder="e.g. NIRF Rank 35"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                {/* ACCREDITATION & APPROVAL STATUS BOARDS */}
                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/60 grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">NAAC Grade</label>
                    <input
                      id="uni-form-naac"
                      type="text"
                      value={uniForm.naacGrade}
                      onChange={(e) => setUniForm({ ...uniForm, naacGrade: e.target.value })}
                      placeholder="e.g. A++"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start pt-3">
                    <label className="flex items-center gap-1.5 text-slate-300 font-semibold cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={uniForm.ugcApproved}
                        onChange={(e) => setUniForm({ ...uniForm, ugcApproved: e.target.checked })}
                        className="rounded bg-slate-950 border-slate-800 text-accent-500 focus:ring-0"
                      />
                      <span>UGC Approved</span>
                    </label>
                  </div>
                  <div className="flex flex-col justify-center items-start pt-3">
                    <label className="flex items-center gap-1.5 text-slate-300 font-semibold cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={uniForm.aicteApproved}
                        onChange={(e) => setUniForm({ ...uniForm, aicteApproved: e.target.checked })}
                        className="rounded bg-slate-950 border-slate-800 text-accent-500 focus:ring-0"
                      />
                      <span>AICTE Approved</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Elite Accreditations (comma separated)</label>
                  <input
                    id="uni-form-accreditations"
                    type="text"
                    required
                    value={uniForm.accreditedBy}
                    onChange={(e) => setUniForm({ ...uniForm, accreditedBy: e.target.value })}
                    placeholder="e.g. UGC-DEB, AICTE, NAAC A+"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Degrees Offered (comma separated)</label>
                    <input
                      id="uni-form-degrees"
                      type="text"
                      required
                      value={uniForm.degrees}
                      onChange={(e) => setUniForm({ ...uniForm, degrees: e.target.value })}
                      placeholder="e.g. MBA, BCA, MCA, BBA"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Specializations (comma separated)</label>
                    <input
                      id="uni-form-specializations"
                      type="text"
                      required
                      value={uniForm.specializations}
                      onChange={(e) => setUniForm({ ...uniForm, specializations: e.target.value })}
                      placeholder="e.g. Finance, Marketing, HR, Data Science"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Avg Salary Package</label>
                    <input
                      id="uni-form-salaryavg"
                      type="text"
                      required
                      value={uniForm.placementSalaryAvg}
                      onChange={(e) => setUniForm({ ...uniForm, placementSalaryAvg: e.target.value })}
                      placeholder="e.g. 8.2 LPA"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Placement %</label>
                    <input
                      id="uni-form-placement-pct"
                      type="number"
                      required
                      value={uniForm.placementPercentage}
                      onChange={(e) => setUniForm({ ...uniForm, placementPercentage: Number(e.target.value) })}
                      placeholder="e.g. 90"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Established Year</label>
                    <input
                      id="uni-form-established"
                      type="number"
                      required
                      value={uniForm.establishedYear}
                      onChange={(e) => setUniForm({ ...uniForm, establishedYear: Number(e.target.value) })}
                      placeholder="e.g. 2005"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Brief 1-sentence Description</label>
                  <input
                    id="uni-form-shortdesc"
                    type="text"
                    required
                    value={uniForm.shortDesc}
                    onChange={(e) => setUniForm({ ...uniForm, shortDesc: e.target.value })}
                    placeholder="Brief headline description"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Detailed Description</label>
                  <textarea
                    id="uni-form-longdesc"
                    rows={2}
                    required
                    value={uniForm.longDesc}
                    onChange={(e) => setUniForm({ ...uniForm, longDesc: e.target.value })}
                    placeholder="Provide full description of academic structures..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Top Recruiters (comma separated)</label>
                  <input
                    id="uni-form-recruiters"
                    type="text"
                    required
                    value={uniForm.topRecruiters}
                    onChange={(e) => setUniForm({ ...uniForm, topRecruiters: e.target.value })}
                    placeholder="e.g. TCS, Capgemini, Cognizant, Google"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <button
                  id="submit-uni-form"
                  type="submit"
                  disabled={logoUploading}
                  className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold py-2.5 rounded-xl transition-colors mt-4 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  {modalType === 'edit-uni' ? 'Update University Profile' : 'Create University Profile'}
                </button>
              </form>
            )}

            {/* Course Add Form */}
            {modalType === 'add-course' && (
              <form onSubmit={handleCourseSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Course Title</label>
                  <input
                    id="course-form-name"
                    type="text"
                    required
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    placeholder="e.g. Online Bachelor of Computer Applications (BCA)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Academic Category</label>
                    <select
                      id="course-form-category"
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="MBA">MBA</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="BBA">BBA</option>
                      <option value="Diploma">Diploma</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Syllabus / Semesters (comma separated)</label>
                    <input
                      id="course-form-syllabus"
                      type="text"
                      required
                      value={courseForm.syllabus}
                      onChange={(e) => setCourseForm({ ...courseForm, syllabus: e.target.value })}
                      placeholder="Sem 1: C, Sem 2: Java"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Brief Description</label>
                  <textarea
                    id="course-form-description"
                    required
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <button
                  id="submit-course-form"
                  type="submit"
                  className="w-full bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold py-2.5 rounded-xl transition-colors mt-3"
                >
                  Create Course Offering
                </button>
              </form>
            )}

            {/* Blog Add Form */}
            {modalType === 'add-blog' && (
              <form onSubmit={handleBlogSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Article Title</label>
                  <input
                    id="blog-form-title"
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="Article Headline"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Excerpt</label>
                  <input
                    id="blog-form-excerpt"
                    type="text"
                    required
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    placeholder="Brief 1-sentence meta summary"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Full Article Body</label>
                  <textarea
                    id="blog-form-content"
                    required
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    rows={6}
                    placeholder="Write detailed informational article..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <button
                  id="submit-blog-form"
                  type="submit"
                  className="w-full bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold py-2.5 rounded-xl transition-colors mt-3"
                >
                  Publish Article to Portal
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
