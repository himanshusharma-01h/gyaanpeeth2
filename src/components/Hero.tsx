import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Star, ShieldCheck, Search, ArrowRight, ArrowLeftRight, HelpCircle } from 'lucide-react';

interface HeroProps {
  homepageContent: { announcement: string; tagline: string; subTagline: string };
  onCategorySelect: (category: string) => void;
  onNavigate: (view: string) => void;
  onQuickCompare: () => void;
}

export default function Hero({
  homepageContent,
  onCategorySelect,
  onNavigate,
  onQuickCompare
}: HeroProps) {
  const categories = [
    { key: 'MBA', label: 'MBA', desc: 'Management' },
    { key: 'BCA', label: 'BCA', desc: 'Computing' },
    { key: 'MCA', label: 'MCA', desc: 'Software' },
    { key: 'B.Tech', label: 'B.Tech', desc: 'Engineering' },
    { key: 'BBA', label: 'BBA', desc: 'Commerce' },
    { key: 'Diploma', label: 'Diploma', desc: 'Professional' }
  ];

  const stats = [
    { value: '150K+', label: 'Students Advised' },
    { value: '25+', label: 'UGC-Approved Partners' },
    { value: '94%', label: 'Placement Success' },
    { value: '8.2 LPA', label: 'Avg Salary Offered' }
  ];

  return (
    <div id="unipath-hero-section" className="relative overflow-hidden bg-slate-900 text-white pt-10 pb-16 md:pb-24">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 opacity-90 z-0" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10 text-center flex flex-col items-center justify-center space-y-6 md:space-y-8">
        
        {/* Brand Text & Categories */}
        <div className="w-full space-y-6 md:space-y-8 flex flex-col items-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-semibold text-accent-500 tracking-wider uppercase">
            <Sparkles className="w-4 h-4 fill-accent-500" />
            UGC-DEB Accredited Online Portals
          </div>

          {/* Heading */}
          <div className="space-y-3 max-w-3xl">
            <h1 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight md:leading-tight">
              {homepageContent.tagline || "Your Trusted Gateway to Accredited Online Degrees"}
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
              {homepageContent.subTagline || "Compare fee structures, student ratings, placement salaries, and accreditations of India's top online universities with 100% transparency."}
            </p>
          </div>

          {/* Core Interactive Category Selector */}
          <div className="space-y-3 w-full max-w-3xl">
            <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">Choose your dream stream:</span>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  id={`hero-category-select-${cat.key}`}
                  onClick={() => onCategorySelect(cat.key)}
                  className="bg-white/5 hover:bg-accent-500 hover:text-slate-950 border border-white/10 hover:border-accent-500 p-3 rounded-2xl transition-all duration-300 text-center flex flex-col items-center justify-center cursor-pointer shadow-md group"
                >
                  <span className="font-display font-bold text-xs block text-white group-hover:text-slate-950">{cat.label}</span>
                  <span className="text-[9px] text-slate-400 group-hover:text-slate-850">{cat.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/5 w-full max-w-3xl">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-0.5">
                <span className="block font-display font-extrabold text-xl md:text-2xl text-accent-500">{stat.value}</span>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
