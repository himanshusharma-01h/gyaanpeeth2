import React, { useState } from 'react';
import { motion } from 'motion/react';
import { University } from '../types';
import { X, Check, Star, Award, ShieldAlert, TrendingUp, DollarSign } from 'lucide-react';

interface CompareToolProps {
  universities: University[];
  selectedToCompare: string[];
  onRemove: (id: string) => void;
  onAdd: (id: string) => void;
  onClear: () => void;
}

export default function CompareTool({ 
  universities, 
  selectedToCompare, 
  onRemove, 
  onAdd, 
  onClear 
}: CompareToolProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Filter out universities already selected
  const availableToSelect = universities.filter(u => !selectedToCompare.includes(u.id));
  const comparedUnits = selectedToCompare.map(id => universities.find(u => u.id === id)).filter(Boolean) as University[];

  // Helpers to highlight maximum values
  const getBestPlacement = () => {
    if (comparedUnits.length < 2) return null;
    let best = comparedUnits[0];
    comparedUnits.forEach(u => {
      const bestNum = parseFloat(best.placementSalaryAvg);
      const currNum = parseFloat(u.placementSalaryAvg);
      if (currNum > bestNum) best = u;
    });
    return best.id;
  };

  const getBestRating = () => {
    if (comparedUnits.length < 2) return null;
    let best = comparedUnits[0];
    comparedUnits.forEach(u => {
      if (u.rating > best.rating) best = u;
    });
    return best.id;
  };

  const bestPlacementId = getBestPlacement();
  const bestRatingId = getBestRating();

  return (
    <div id="compare-tool-container" className="space-y-6 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50 pb-5">
        <div>
          <h3 className="font-display font-semibold text-lg md:text-xl text-brand-700 flex items-center gap-2">
            <Award className="w-5 h-5 text-accent-500" />
            Interactive University Comparison
          </h3>
          <p className="text-xs text-slate-500">Compare up to 3 UGC-DEB certified colleges side-by-side to choose the perfect program</p>
        </div>

        {comparedUnits.length > 0 && (
          <button
            id="clear-comparison-btn"
            onClick={onClear}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 hover:bg-rose-100/50 px-3.5 py-1.5 rounded-xl border border-rose-100"
          >
            Clear Comparison Panel
          </button>
        )}
      </div>

      {/* Selection Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {comparedUnits.map(uni => (
          <div 
            key={uni.id} 
            className="flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm"
          >
            <img src={uni.logo} alt={uni.name} className="w-5 h-5 rounded-lg object-cover" />
            <span>{uni.name}</span>
            <button 
              id={`remove-comparison-${uni.id}`}
              onClick={() => onRemove(uni.id)} 
              className="p-0.5 hover:bg-brand-100 rounded-full text-brand-500 hover:text-brand-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {comparedUnits.length < 3 && (
          <div className="relative">
            <button
              id="compare-dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-1"
            >
              + Add University to Compare
            </button>
            
            {dropdownOpen && (
              <div id="compare-dropdown-menu" className="absolute left-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto">
                {availableToSelect.length === 0 ? (
                  <span className="block px-4 py-3 text-xs text-slate-400">All universities selected</span>
                ) : (
                  availableToSelect.map(uni => (
                    <button
                      key={uni.id}
                      id={`compare-select-option-${uni.id}`}
                      onClick={() => {
                        onAdd(uni.id);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors flex items-center gap-2"
                    >
                      <img src={uni.logo} alt={uni.name} className="w-5 h-5 rounded-md object-cover" />
                      {uni.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison Grid */}
      {comparedUnits.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-xs font-medium flex flex-col items-center justify-center gap-2">
          <ShieldAlert className="w-8 h-8 text-slate-300" />
          No universities added to compare yet. Add up to 3 universities above to view their comparison matrix.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-100 rounded-2xl overflow-hidden text-left">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Key Parameter</th>
                {comparedUnits.map(uni => (
                  <th key={uni.id} className="p-4 text-xs font-bold text-brand-700 uppercase tracking-wider w-[25%]">
                    <div className="flex items-center gap-2">
                      <img src={uni.logo} alt={uni.name} className="w-7 h-7 rounded-lg object-cover border border-slate-100" />
                      <div>
                        <span className="block font-semibold normal-case text-brand-700">{uni.name}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">{uni.type} University</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs text-slate-600">
              {/* Accreditations */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/20">Accreditations</td>
                {comparedUnits.map(uni => (
                  <td key={uni.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {(uni.accreditedBy || []).map((acc, i) => (
                        <span key={i} className="text-[9px] font-bold bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.5 rounded-md shadow-inner">
                          {acc}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/20">Overall Student Rating</td>
                {comparedUnits.map(uni => (
                  <td key={uni.id} className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 text-sm">{uni.rating || 4.5} / 5.0</span>
                      <div className="flex text-amber-400 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(uni.rating || 4.5) ? 'fill-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400">({uni.reviewsCount || 0})</span>
                      {bestRatingId === uni.id && (
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wide">
                          Highest Rated
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Fee Range */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/20">Approx Fee Range</td>
                {comparedUnits.map(uni => (
                  <td key={uni.id} className="p-4 font-semibold text-brand-600">
                    <div className="flex items-center gap-1 text-xs">
                      <DollarSign className="w-3.5 h-3.5 text-brand-500" />
                      {uni.feeRange || '₹1.5L - ₹2.5L'}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Placements */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/20">Placement Excellence</td>
                {comparedUnits.map(uni => (
                  <td key={uni.id} className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-slate-800 font-semibold">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        Avg Salary: {uni.placementSalaryAvg || '5.5 LPA'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Placement Rate: <span className="font-semibold text-slate-700">{uni.placementPercentage || 90}%</span>
                      </div>
                      {bestPlacementId === uni.id && (
                        <span className="inline-block mt-1 bg-amber-50 border border-amber-100 text-accent-600 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wide">
                          Best Placements
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Core Recuiters */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/20">Top Corporate Partners</td>
                {comparedUnits.map(uni => (
                  <td key={uni.id} className="p-4">
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      {(uni.topRecruiters || []).slice(0, 4).join(', ')}
                    </p>
                  </td>
                ))}
              </tr>

              {/* Courses Offered Count */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/20">Popular Courses</td>
                {comparedUnits.map(uni => (
                  <td key={uni.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {(uni.coursesOffered || []).map((course, idx) => (
                        <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {course.courseName}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Location & Year */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/20">Establishment & Location</td>
                {comparedUnits.map(uni => (
                  <td key={uni.id} className="p-4">
                    <p className="font-semibold text-slate-800">{uni.location}</p>
                    <p className="text-[10px] text-slate-400">Established: {uni.establishedYear} • {uni.rank}</p>
                  </td>
                ))}
              </tr>

              {/* Admin & Govt Approvals */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/20">Admin & Govt Approvals</td>
                {comparedUnits.map(uni => (
                  <td key={uni.id} className="p-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        {uni.ugcApproved ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-lg shadow-sm">
                            <Check className="w-3 h-3" /> UGC Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 font-bold px-2 py-0.5 rounded-lg shadow-sm">
                            <X className="w-3 h-3 text-amber-500" /> UGC Pending
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        {uni.aicteApproved ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-lg shadow-sm">
                            <Check className="w-3 h-3" /> AICTE Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 font-bold px-2 py-0.5 rounded-lg shadow-sm">
                            <X className="w-3 h-3 text-amber-500" /> AICTE Pending
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="inline-flex items-center gap-1 bg-brand-50 border border-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-lg shadow-sm">
                          <Award className="w-3 h-3 text-brand-500" /> NAAC Grade: {uni.naacGrade || 'A+'}
                        </span>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
