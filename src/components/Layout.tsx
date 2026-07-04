import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, MessageSquare, PhoneCall, HelpCircle, 
  Menu, X, Laptop, ShieldCheck, ChevronRight, MessageCircleCode, ArrowRight,
  Mail, Clock
} from 'lucide-react';
import CounsellorBot from './CounsellorBot';
import { University, Course } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  universities: University[];
  courses: Course[];
  activeView: string;
  onNavigate: (view: string) => void;
  onSelectUniversity: (id: string) => void;
  onSelectCourse: (id: string) => void;
  announcement: string;
}

export default function Layout({
  children,
  universities,
  courses,
  activeView,
  onNavigate,
  onSelectUniversity,
  onSelectCourse,
  announcement
}: LayoutProps) {
  const [botOpen, setBotOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ type: 'uni' | 'course'; id: string; name: string }[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick search filtration logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    
    const uniMatches = universities
      .filter(u => u.name.toLowerCase().includes(query) || u.shortDesc.toLowerCase().includes(query))
      .map(u => ({ type: 'uni' as const, id: u.id, name: u.name }));
      
    const courseMatches = courses
      .filter(c => c.name.toLowerCase().includes(query) || c.category.toLowerCase().includes(query))
      .map(c => ({ type: 'course' as const, id: c.id, name: c.name }));

    setSearchResults([...uniMatches, ...courseMatches].slice(0, 5));
  }, [searchQuery, universities, courses]);

  const handleSearchSelect = (item: { type: 'uni' | 'course'; id: string; name: string }) => {
    setSearchQuery('');
    setSearchResults([]);
    if (item.type === 'uni') {
      onSelectUniversity(item.id);
    } else {
      onSelectCourse(item.id);
    }
  };

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'universities', label: 'Explore Colleges' },
    { id: 'courses', label: 'Online Programs' },
    { id: 'scholarships', label: 'Scholarships' },
    { id: 'blogs', label: 'News & Blog' },
    { id: 'help', label: 'Help Center' },
    { id: 'admin', label: 'Admin Console' }
  ];

  return (
    <div id="unipath-layout-wrapper" className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Top Announcement Banner */}
      {announcement && (
        <div id="top-announcement-banner" className="bg-brand-700 text-white text-[11px] md:text-xs text-center py-2 px-4 font-semibold tracking-wide border-b border-brand-600/30 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-500 fill-accent-500 animate-pulse" />
          <span>{announcement}</span>
          <button 
            id="banner-cta"
            onClick={() => onNavigate('scholarships')} 
            className="underline hover:text-accent-500 font-bold ml-1 flex items-center gap-0.5"
          >
            Apply Now <ChevronRight className="w-3 h-3 inline" />
          </button>
        </div>
      )}

      {/* Main Sticky Header */}
      <header id="unipath-sticky-header" className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <button 
            id="nav-logo-btn"
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 shrink-0 group text-left"
          >
            <div className="w-10 h-10 rounded-2xl shadow-md transition-all group-hover:scale-105 overflow-hidden border border-slate-100 flex items-center justify-center shrink-0">
              <img 
                src="/src/assets/images/regenerated_image_1783179368539.jpg" 
                alt="GyaanPeeth Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="block font-display font-extrabold text-lg md:text-xl text-brand-700 tracking-tight leading-none">
                Gyaan<span className="text-accent-500">Peeth</span>
              </span>
              <span className="text-[9px] md:text-[10px] text-slate-400 font-medium tracking-wide">Empowering Education, Inspiring Success</span>
            </div>
          </button>

          {/* Search Bar (Centered on Large screens) */}
          <div className="hidden lg:block relative max-w-md w-full">
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
              <input
                id="header-global-search"
                type="text"
                placeholder="Search programs, colleges, accreditations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all"
              />
            </div>
            
            {/* Search Suggestions */}
            {searchResults.length > 0 && (
              <div id="search-suggestions-dropdown" className="absolute top-12 left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
                <span className="block px-4 py-2 bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-slate-400">Suggestions</span>
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    id={`search-suggestion-item-${idx}`}
                    onClick={() => handleSearchSelect(item)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50/50 text-xs text-slate-700 transition-colors flex items-center justify-between border-b border-slate-50"
                  >
                    <span className="font-medium truncate">{item.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      item.type === 'uni' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {item.type === 'uni' ? 'College' : 'Course'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeView === item.id || (item.id === 'universities' && activeView === 'university-detail') || (item.id === 'courses' && activeView === 'course-detail')
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Actions / Toggle */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div id="mobile-navigation-menu" className="md:hidden border-t border-slate-100 bg-white p-4 space-y-3 shadow-lg">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                id="header-global-search-mobile"
                type="text"
                placeholder="Search colleges, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800"
              />
            </div>

            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  id={`nav-link-mobile-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                    activeView === item.id
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main-content-canvas" className="flex-grow">
        {children}
      </main>

      {/* Universal Footer */}
      <footer id="global-portal-footer" className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 shadow-md flex items-center justify-center shrink-0">
                <img 
                  src="/src/assets/images/regenerated_image_1783179370285.jpg" 
                  alt="GyaanPeeth Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Gyaan<span className="text-accent-500">Peeth</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              GyaanPeeth is India's premium online education counselling aggregator. We bring 100% transparent and objective comparisons of elite UGC-DEB accredited colleges right to your screen.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              100% Authorized Partner
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider mb-4">Online Degrees</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {courses.slice(0, 4).map(course => (
                <li key={course.id}>
                  <button 
                    id={`footer-course-link-${course.id}`}
                    onClick={() => onSelectCourse(course.id)} 
                    className="hover:text-accent-500 transition-colors text-left"
                  >
                    {course.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider mb-4">Elite Colleges</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {universities.slice(0, 3).map(uni => (
                <li key={uni.id}>
                  <button 
                    id={`footer-uni-link-${uni.id}`}
                    onClick={() => onSelectUniversity(uni.id)} 
                    className="hover:text-accent-500 transition-colors text-left font-medium"
                  >
                    {uni.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider mb-4">Get Free Counselling</h4>
            <p className="text-xs text-slate-400 mb-3.5">Our senior advisors help you navigate admissions, documentation, and zero-interest EMI options.</p>
            <button
              id="footer-enquiry-cta"
              onClick={() => onNavigate('scholarships')}
              className="w-full bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              Start Free Enquiry
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Footer Base */}
        <div className="border-t border-slate-800/60 py-6 text-center text-slate-500 text-[11px]">
          <p>© 2026 GyaanPeeth Educational Advisory Panel. All rights reserved. Accreditations and logos are intellectual properties of their respective universities.</p>
        </div>
      </footer>

      {/* Floating Action Button: AI Counselling Chat */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
        
        {/* WhatsApp Button */}
        <a
          id="whatsapp-chat-bubble"
          href="https://wa.me/918239697999?text=Hi%20GyaanPeeth,%20I%20need%20expert%20assistance%20for%20admissions!"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-3 md:py-2 px-4 shadow-xl transition-all scale-100 hover:scale-105"
        >
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span className="hidden md:inline text-xs font-bold">Chat on WhatsApp</span>
        </a>

        {/* AI Chat Button */}
        <button
          id="ai-counselor-bubble"
          onClick={() => setBotOpen(!botOpen)}
          className="flex items-center gap-2 bg-brand-700 border border-brand-600 hover:bg-brand-600 text-white rounded-full p-3 md:py-2.5 px-5 shadow-xl transition-all scale-100 hover:scale-105"
        >
          <MessageSquare className="w-4.5 h-4.5 text-accent-500" />
          <span className="text-xs font-bold tracking-wide flex items-center gap-1.5">
            AI Counsellor
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </span>
        </button>
      </div>

      {/* Counsellor Bot Drawer Drawer */}
      <CounsellorBot isOpen={botOpen} onClose={() => setBotOpen(false)} />
    </div>
  );
}
