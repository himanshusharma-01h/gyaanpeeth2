import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { portalCategories, portalCourses, PortalCourse } from '../data/coursesData';
import { 
  Briefcase, Laptop, Globe, Sparkles, Code, FlaskConical, Cpu, 
  BookOpen, LineChart, Layers, Award, GraduationCap, ShieldCheck, 
  Users, Settings, ArrowRight, ArrowLeftRight, Star, Check 
} from 'lucide-react';

// Dynamic icon mapping helper
const getCourseIcon = (iconName: string) => {
  switch (iconName) {
    case 'Briefcase': return <Briefcase className="w-5 h-5 text-blue-500" />;
    case 'Laptop': return <Laptop className="w-5 h-5 text-indigo-500" />;
    case 'Globe': return <Globe className="w-5 h-5 text-emerald-500" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-500" />;
    case 'Code': return <Code className="w-5 h-5 text-purple-500" />;
    case 'FlaskConical': return <FlaskConical className="w-5 h-5 text-pink-500" />;
    case 'Cpu': return <Cpu className="w-5 h-5 text-cyan-500" />;
    case 'BookOpen': return <BookOpen className="w-5 h-5 text-orange-500" />;
    case 'LineChart': return <LineChart className="w-5 h-5 text-teal-500" />;
    case 'Layers': return <Layers className="w-5 h-5 text-violet-500" />;
    case 'Award': return <Award className="w-5 h-5 text-rose-500" />;
    case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-yellow-500" />;
    case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-green-500" />;
    case 'Users': return <Users className="w-5 h-5 text-sky-500" />;
    case 'Settings': return <Settings className="w-5 h-5 text-slate-500" />;
    default: return <GraduationCap className="w-5 h-5 text-brand-500" />;
  }
};

interface PremiumCourseExplorerProps {
  onCompareCourse: (courseName: string) => void;
  onExploreDetail?: (courseId: string) => void;
}

export default function PremiumCourseExplorer({ onCompareCourse, onExploreDetail }: PremiumCourseExplorerProps) {
  const [activeCategory, setActiveCategory] = useState<'pg' | 'ug' | 'engineering'>('pg');

  const filteredCourses = portalCourses.filter(c => c.category === activeCategory);

  return (
    <div id="premium-courses-section" className="bg-white border border-slate-100 rounded-[32px] p-4 md:p-8 shadow-xl max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar (Only 3 categories) */}
        <aside className="w-full md:w-80 shrink-0 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8">
          <div className="space-y-6">
            <div className="text-left">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full inline-block">
                Curated Syllabi
              </span>
              <h3 className="font-display font-extrabold text-2xl text-slate-800 mt-2 tracking-tight">
                Academic Programs
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Filter online and professional courses recognized by UGC-DEB for private & public careers.
              </p>
            </div>

            {/* Sidebar List */}
            <nav className="space-y-2">
              {portalCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`sidebar-cat-btn-${cat.id}`}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group flex items-start gap-4 relative cursor-pointer overflow-hidden ${
                      isActive 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/10' 
                        : 'bg-slate-50 border-slate-50 hover:bg-slate-100/70 hover:border-slate-200 text-slate-700'
                    }`}
                  >
                    {/* Active accent background element */}
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-active-pill" 
                        className="absolute inset-0 bg-blue-600 -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-sm tracking-wide">
                          {cat.label}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {cat.count} Programs
                        </span>
                      </div>
                      <p className={`text-[10px] mt-1 leading-relaxed ${isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-500'}`}>
                        {cat.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Trust Seal */}
          <div className="hidden md:block pt-8 border-t border-slate-100/80 mt-8 text-left space-y-3">
            <div className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-xs font-semibold">100% DEB Approved</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Every course listed is vetted and periodically re-assessed against latest regulatory guidelines.
            </p>
          </div>
        </aside>

        {/* Right Side Course Cards Grid */}
        <div className="flex-1 text-left min-h-[450px]">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Stream Explorer</span>
              <h4 className="font-display font-extrabold text-lg text-slate-800">
                {activeCategory === 'pg' ? 'Postgraduate Degrees' : activeCategory === 'ug' ? 'Undergraduate Degrees' : 'Engineering Specializations'}
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Click "Compare Now" to analyze and select</span>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    layout
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      {/* Top Header Row with Badge & Icon */}
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 bg-white border border-slate-100 rounded-xl group-hover:bg-blue-50/40 group-hover:border-blue-100/50 transition-colors">
                          {getCourseIcon(course.iconName)}
                        </div>
                        
                        {/* Badge */}
                        <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          course.badge === 'Trending' 
                            ? 'bg-rose-50 text-rose-600' 
                            : course.badge === 'New' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          {course.badge}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="space-y-1">
                        <h5 className="font-display font-extrabold text-sm text-slate-800 leading-snug group-hover:text-blue-700 transition-colors">
                          {course.name}
                        </h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                          {course.subtitle}
                        </p>
                      </div>

                      {/* Specs Row */}
                      <div className="grid grid-cols-2 gap-2 border-t border-slate-100/50 pt-3 text-[10px] text-slate-500 font-medium">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Duration</span>
                          <span className="text-slate-700 block font-bold mt-0.5">{course.duration}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Avg Placement</span>
                          <span className="text-emerald-600 block font-bold mt-0.5">{course.avgSalary}</span>
                        </div>
                      </div>
                    </div>

                    {/* Compare CTA Button */}
                    <div className="pt-4 mt-4 border-t border-slate-100/40 flex items-center gap-1.5 justify-between">
                      <button
                        onClick={() => onExploreDetail && onExploreDetail(course.id)}
                        className="text-[10px] text-slate-400 hover:text-slate-700 underline font-medium"
                      >
                        Syllabus
                      </button>
                      <button
                        id={`btn-compare-${course.id}`}
                        onClick={() => onCompareCourse(course.name)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-extrabold transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1 cursor-pointer"
                      >
                        Compare Now
                        <ArrowLeftRight className="w-3 h-3" />
                      </button>
                    </div>

                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
