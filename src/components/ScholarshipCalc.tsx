import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Award, HelpCircle, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ScholarshipCalcProps {
  onClaim: (scholarshipPercent: number) => void;
}

export default function ScholarshipCalc({ onClaim }: ScholarshipCalcProps) {
  const [marks, setMarks] = useState<number>(75);
  const [income, setIncome] = useState<string>('2-5L');
  const [category, setCategory] = useState<string>('General');
  const [result, setResult] = useState<number | null>(null);

  const calculateScholarship = () => {
    let percentage = 0;

    // Marks criteria
    if (marks >= 90) {
      percentage += 30;
    } else if (marks >= 80) {
      percentage += 20;
    } else if (marks >= 70) {
      percentage += 10;
    } else if (marks >= 60) {
      percentage += 5;
    }

    // Income criteria
    if (income === 'Under-2L') {
      percentage += 15;
    } else if (income === '2-5L') {
      percentage += 10;
    } else if (income === '5-8L') {
      percentage += 5;
    }

    // Special category bonus
    if (category === 'Female' || category === 'Defence' || category === 'SC-ST') {
      percentage += 10;
    }

    // Max limit is 50%
    const finalPercent = Math.min(percentage, 50);
    setResult(finalPercent);
  };

  const handleReset = () => {
    setResult(null);
    setMarks(75);
    setIncome('2-5L');
    setCategory('General');
  };

  return (
    <div id="scholarship-calculator-card" className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-50 rounded-2xl text-brand-600 border border-brand-100 shrink-0">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg md:text-xl text-brand-700">Online Scholarship Eligibility Portal</h3>
          <p className="text-xs text-slate-500">Instantly check your eligibility for our up to 50% Tuition Fee Waivers</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result === null ? (
          <motion.div
            key="calc-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Marks Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  Previous Academic Marks
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" title="Your 12th Standard or Undergraduate CGPA equivalent percentage" />
                </label>
                <span className="text-sm font-bold text-accent-600">{marks}%</span>
              </div>
              <input
                id="scholarship-marks-slider"
                type="range"
                min="45"
                max="100"
                value={marks}
                onChange={(e) => setMarks(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent-500 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Pass (45%)</span>
                <span>Average (75%)</span>
                <span>Elite (90%+)</span>
              </div>
            </div>

            {/* Income Bracket */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Annual Household Income Bracket (INR)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'Under-2L', label: 'Below ₹2 Lakhs' },
                  { key: '2-5L', label: '₹2L - ₹5 Lakhs' },
                  { key: '5-8L', label: '₹5L - ₹8 Lakhs' },
                  { key: 'Above-8L', label: 'Above ₹8 Lakhs' }
                ].map((bracket) => (
                  <button
                    key={bracket.key}
                    id={`income-bracket-${bracket.key}`}
                    type="button"
                    onClick={() => setIncome(bracket.key)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                      income === bracket.key
                        ? 'border-brand-500 bg-brand-50/50 text-brand-700 font-semibold shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-white'
                    }`}
                  >
                    {bracket.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category / Demographic */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Demographic Profile (Select category if applicable)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'General', label: 'General' },
                  { key: 'Female', label: 'Female Student' },
                  { key: 'SC-ST', label: 'SC / ST' },
                  { key: 'Defence', label: 'Defence Ward' },
                  { key: 'OBC', label: 'OBC Category' }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    id={`category-btn-${cat.key}`}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`px-2 py-2 rounded-lg border text-[11px] font-medium transition-all ${
                      category === cat.key
                        ? 'border-accent-500 bg-accent-500/5 text-accent-600 font-semibold shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action */}
            <button
              id="calc-scholarship-btn"
              onClick={calculateScholarship}
              className="w-full mt-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              Calculate My Scholarship Award
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="calc-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-4 space-y-5"
          >
            <div className="inline-flex items-center justify-center p-4 bg-emerald-50 rounded-full text-emerald-500 mb-2 border border-emerald-100">
              <CheckCircle className="w-12 h-12" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-100/50 px-3 py-1 rounded-full border border-emerald-200">
                Eligibility Confirmed
              </span>
              <h4 className="font-display font-bold text-2xl text-slate-800 pt-2">
                Tuition Scholarship Approved!
              </h4>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 max-w-sm mx-auto shadow-inner">
              <span className="text-slate-500 text-xs font-medium block">Approved Discount Percentage</span>
              <span className="text-4xl md:text-5xl font-display font-extrabold text-brand-600 block pt-1">
                {result}% OFF
              </span>
              <p className="text-[11px] text-slate-400 mt-2">
                Valid on UGC-DEB approved courses for Autumn 2026 admissions
              </p>
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <button
                id="claim-scholarship-btn"
                onClick={() => onClaim(result)}
                className="w-full bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 glow-hover"
              >
                Claim Scholarship & Autofill Form
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                id="recalculate-scholarship-btn"
                onClick={handleReset}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold transition-colors block mx-auto"
              >
                Recalculate with different parameters
              </button>
            </div>

            <div className="flex justify-center items-center gap-1 text-[11px] text-slate-400 pt-2 border-t border-slate-50">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              Secured under UniPath verified admissions scheme
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
