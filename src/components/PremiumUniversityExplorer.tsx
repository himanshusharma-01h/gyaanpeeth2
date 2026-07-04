import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MapPin, Award, CheckCircle, ShieldCheck, GraduationCap, 
  ArrowRight, PhoneCall, Layers, ChevronDown, Filter, HelpCircle, 
  RefreshCw, Sparkles, AlertCircle 
} from 'lucide-react';
import { FirestoreUniversity } from '../data/universitiesData';
import { subscribeUniversities, seedUniversitiesIfEmpty } from '../lib/universitiesService';

interface PremiumUniversityExplorerProps {
  onSelectUniversity: (id: string) => void;
  onOpenCounsellingForm: () => void;
  onOpenCompare: () => void;
}

export default function PremiumUniversityExplorer({ 
  onSelectUniversity, 
  onOpenCounsellingForm, 
  onOpenCompare 
}: PremiumUniversityExplorerProps) {
  const [universities, setUniversities] = useState<FirestoreUniversity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDegree, setSelectedDegree] = useState('All');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  // Lazy loading pagination
  const [visibleCount, setVisibleCount] = useState(6);

  // Subscribe to Firestore updates and seed if empty
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initData = async () => {
      try {
        setLoading(true);
        // Ensure there is at least seeded data in Firestore
        await seedUniversitiesIfEmpty();
        
        // Listen to live updates
        unsubscribe = subscribeUniversities((data) => {
          setUniversities(data);
          setLoading(false);
        });
      } catch (err: any) {
        console.error(err);
        setError('Failed to load universities. Showing offline backup.');
        setLoading(false);
      }
    };

    initData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Compute unique values for filters dynamically based on current universities
  const uniqueStates = useMemo(() => {
    const states = new Set<string>();
    universities.forEach(u => {
      if (u.state) states.add(u.state);
    });
    return ['All', ...Array.from(states).sort()];
  }, [universities]);

  const uniqueDegrees = useMemo(() => {
    const degrees = new Set<string>();
    universities.forEach(u => {
      if (u.degrees) {
        u.degrees.forEach(d => degrees.add(d));
      }
    });
    return ['All', ...Array.from(degrees).sort()];
  }, [universities]);

  const uniqueSpecs = useMemo(() => {
    const specs = new Set<string>();
    universities.forEach(u => {
      if (u.specializations) {
        u.specializations.forEach(s => specs.add(s));
      }
    });
    return ['All', ...Array.from(specs).sort()];
  }, [universities]);

  // Filter universities based on selections
  const filteredUniversities = useMemo(() => {
    return universities.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            u.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesState = selectedState === 'All' || u.state === selectedState;
      
      const matchesDegree = selectedDegree === 'All' || (u.degrees && u.degrees.includes(selectedDegree));
      
      const matchesSpec = selectedSpecialization === 'All' || (u.specializations && u.specializations.includes(selectedSpecialization));

      return matchesSearch && matchesState && matchesDegree && matchesSpec;
    });
  }, [universities, searchTerm, selectedState, selectedDegree, selectedSpecialization]);

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedState('All');
    setSelectedDegree('All');
    setSelectedSpecialization('All');
    setVisibleCount(6);
  };

  return (
    <div id="premium-university-explorer-section" className="bg-white py-16 px-4 md:px-8 space-y-12 max-w-7xl mx-auto text-left">
      
      {/* SECTION HEADER */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">UGC-DEB Approved Directories</span>
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-brand-800 tracking-tight leading-tight">
            100+ Online Universities
            <span className="block text-accent-600 font-display font-bold text-2xl md:text-4xl mt-1">UGC-Approved Universities Verified by Experts</span>
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl leading-relaxed">
            Discover India's top online and distance universities with expert counselling and admission support. All data is synchronized from live databases.
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-slate-50/70 border border-slate-100 p-6 rounded-3xl space-y-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-brand-800 font-bold text-sm">
            <Filter className="w-4 h-4 text-accent-600" />
            <span>Search & Filter Engine</span>
          </div>
          {(searchTerm || selectedState !== 'All' || selectedDegree !== 'All' || selectedSpecialization !== 'All') && (
            <button 
              onClick={handleResetFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Text Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search university name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition-all outline-none"
            />
          </div>

          {/* State Selection */}
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="All">All States ({uniqueStates.length - 1})</option>
              {uniqueStates.filter(s => s !== 'All').map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Degree Selection */}
          <div className="relative">
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="All">All Degrees ({uniqueDegrees.length - 1})</option>
              {uniqueDegrees.filter(d => d !== 'All').map(deg => (
                <option key={deg} value={deg}>{deg}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Specialization Selection */}
          <div className="relative">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="All">All Specializations ({uniqueSpecs.length - 1})</option>
              {uniqueSpecs.filter(s => s !== 'All').map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <span>Showing {Math.min(filteredUniversities.length, visibleCount)} of {filteredUniversities.length} institutions</span>
          {searchTerm || selectedState !== 'All' || selectedDegree !== 'All' || selectedSpecialization !== 'All' ? (
            <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Filters Active</span>
          ) : null}
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="p-4 bg-amber-50 border border-amber-100 text-amber-800 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="text-xs font-semibold">{error}</span>
        </div>
      )}

      {/* DYNAMIC CARD GRID */}
      {loading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-accent-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium font-mono">Synchronizing GyaanPeeth Cloud Firestore Database...</p>
        </div>
      ) : filteredUniversities.length === 0 ? (
        <div className="py-20 border border-dashed border-slate-100 rounded-3xl text-center space-y-4 bg-slate-50/30">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-700 text-sm">No matching universities found</h4>
            <p className="text-xs text-slate-400">Try adjusting your keyword searches or filter choices above.</p>
          </div>
          <button 
            onClick={handleResetFilters}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredUniversities.slice(0, visibleCount).map((uni, idx) => (
                <motion.div
                  key={uni.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(idx * 0.05, 0.4) }}
                  whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)' }}
                  className="bg-white border border-slate-100 rounded-[16px] p-6 flex flex-col justify-between transition-all duration-300 relative group"
                >
                  <div className="space-y-4">
                    {/* CARD HEADER (Logo, Badges) */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-16 h-16 rounded-xl border border-slate-100 p-1 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                        <img 
                          src={uni.logo} 
                          alt={`${uni.name} logo`} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Recognition Badges */}
                      <div className="flex flex-wrap gap-1 justify-end max-w-[140px]">
                        {uni.ugcApproved && (
                          <span className="text-[8px] font-extrabold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                            UGC
                          </span>
                        )}
                        {uni.naacGrade && (
                          <span className="text-[8px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                            NAAC {uni.naacGrade}
                          </span>
                        )}
                        {uni.aicteApproved && (
                          <span className="text-[8px] font-extrabold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100">
                            AICTE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* UNIVERSITY NAME & DETAILS */}
                    <div className="space-y-1.5 text-left">
                      <h3 className="font-display font-extrabold text-base text-slate-800 leading-snug group-hover:text-blue-700 transition-colors">
                        {uni.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                        {uni.location}
                      </p>
                    </div>

                    {/* SHORT DESCRIPTION */}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 pt-1">
                      {uni.shortDesc}
                    </p>

                    {/* COURSES & TYPE ACCORDION ROW */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50 text-[10px] text-slate-500">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Courses Available</span>
                        <span className="text-slate-700 block font-bold mt-0.5">{uni.coursesCount || 12} Programs</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Accreditations</span>
                        <span className="text-slate-700 block font-bold mt-0.5 line-clamp-1">{uni.accreditedBy.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION CTA */}
                  <div className="pt-5 mt-5 border-t border-slate-100/50 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-600">{uni.placementSalaryAvg ? `${uni.placementSalaryAvg} Avg Sal` : 'Elite Placements'}</span>
                    <button
                      onClick={() => onSelectUniversity(uni.id)}
                      className="px-4 py-2 bg-slate-50 group-hover:bg-blue-600 hover:bg-blue-700 group-hover:text-white text-slate-700 rounded-xl text-[11px] font-extrabold transition-all duration-300 flex items-center gap-1.5 cursor-pointer border border-slate-100 group-hover:border-blue-600"
                    >
                      View University
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* LOAD MORE / LAZY LOADING */}
          {filteredUniversities.length > visibleCount && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="px-6 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <span>Show More Universities</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* PREMIUM COUNSELLING CTA SECTION */}
      <div className="bg-gradient-to-br from-brand-900 to-slate-900 border border-slate-800 text-white rounded-[24px] p-6 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Absolute Background Accent */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-accent-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Text Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-accent-400 bg-accent-500/10 px-3 py-1.5 rounded-full inline-block">
                Free Student Support
              </span>
              <h3 className="font-display font-extrabold text-2xl md:text-4xl leading-tight">
                Need Help Choosing the Right University?
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
                Our expert admission counsellors help students compare universities, select the right course, understand eligibility, scholarships, fees, and complete admission.
              </p>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">✓</span>
                <span>Free Expert Guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">✓</span>
                <span>Admission Assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">✓</span>
                <span>Scholarship Support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">✓</span>
                <span>Instant Call Back</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 w-full lg:justify-end">
            <button
              onClick={onOpenCounsellingForm}
              className="px-6 py-4 bg-accent-500 hover:bg-accent-600 text-brand-950 font-extrabold rounded-2xl text-xs md:text-sm transition-all duration-300 shadow-lg shadow-accent-500/20 flex items-center justify-center gap-2 cursor-pointer grow text-center"
            >
              <PhoneCall className="w-4 h-4" />
              Get Free Counselling
            </button>
            <button
              onClick={onOpenCompare}
              className="px-6 py-4 bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold rounded-2xl text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer grow text-center border border-slate-700"
            >
              <Layers className="w-4 h-4" />
              Compare Universities
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
