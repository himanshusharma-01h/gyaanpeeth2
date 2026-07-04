import React from 'react';
import { Course, University } from '../types';
import { 
  GraduationCap, Clock, Award, CheckCircle, ArrowRight, BookOpen, 
  Briefcase, Landmark, ExternalLink 
} from 'lucide-react';

interface CourseDetailProps {
  course: Course;
  universities: University[];
  onSelectUniversity: (id: string) => void;
  onApplyCourse: (courseName: string) => void;
}

export default function CourseDetail({
  course,
  universities,
  onSelectUniversity,
  onApplyCourse
}: CourseDetailProps) {
  // Find which universities offer this particular course
  const offeringUnis = universities.filter(u => 
    u.coursesOffered.some(co => co.courseId.toLowerCase() === course.id.toLowerCase() || u.coursesOffered.some(c => c.courseName.toLowerCase().includes(course.category.toLowerCase())))
  );

  return (
    <div id="course-detail-canvas" className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 text-left">
      
      {/* Header Splash Card */}
      <div className="brand-gradient text-white rounded-3xl p-6 md:p-10 border border-brand-600 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-accent-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            Online Program Dossier
          </span>
          <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white tracking-tight leading-tight">
            {course.name}
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-4 h-4 text-accent-500" />
              Duration: <span className="text-white font-bold">{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <GraduationCap className="w-4 h-4 text-accent-500" />
              Level: <span className="text-white font-bold">{course.level}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Landmark className="w-4 h-4 text-accent-500" />
              UGC-DEB Accredited Status: <span className="text-emerald-400 font-bold">100% Validated</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Syllabus & Prospects */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-6">
          
          {/* Syllabus */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-brand-700 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent-500" />
              Academic Syllabus & Semesters
            </h3>
            <p className="text-xs text-slate-500">A robust and contemporary industry-aligned curriculum design structure.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {course.syllabus.map((sem, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-brand-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="block font-semibold text-slate-800 text-xs">Module {idx + 1}</span>
                    <p className="text-[11px] text-slate-500 pt-0.5">{sem}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career prospects */}
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <h3 className="font-display font-bold text-base text-brand-700 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent-500" />
              Career Outcomes & Industry Roles
            </h3>
            <p className="text-xs text-slate-500">Graduates from this verified degree secure prestigious roles worldwide:</p>

            <div className="flex flex-wrap gap-2 pt-1">
              {course.careerProspects.map((prospect, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100/50 text-emerald-800 rounded-xl px-3 py-1.5 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {prospect}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Universities offering this course */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-brand-50/50 border border-brand-100 rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600 block">Accredited Providers</span>
              <h3 className="font-display font-bold text-sm text-brand-700 pt-0.5">Top Colleges offering {course.category}</h3>
            </div>

            <div className="space-y-3">
              {offeringUnis.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No college offering listed for this stream yet.</p>
              ) : (
                offeringUnis.map(uni => {
                  const specificCo = uni.coursesOffered.find(c => c.courseId.toLowerCase() === course.id.toLowerCase()) || uni.coursesOffered[0];
                  return (
                    <div key={uni.id} className="bg-white border border-slate-100 p-3.5 rounded-2xl space-y-3 shadow-inner">
                      <div className="flex items-center gap-3">
                        <img src={uni.logo} alt={uni.name} className="w-10 h-10 rounded-xl object-cover border border-slate-50" />
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-slate-800 truncate">{uni.name}</span>
                          <span className="block text-[10px] text-slate-400">{uni.type} • {uni.rank}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-50">
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase">Sem Fee</span>
                          <span className="block font-bold text-brand-600">{specificCo?.fee || '₹60,000'}</span>
                        </div>
                        <button
                          id={`provider-view-${uni.id}`}
                          onClick={() => onSelectUniversity(uni.id)}
                          className="flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-700"
                        >
                          Visit College
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              id="course-apply-now-btn"
              onClick={() => onApplyCourse(course.name)}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-1"
            >
              Start Free Program Application
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
