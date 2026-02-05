
import React from 'react';
import { PhoneRecommendation } from '../types';

interface PhoneCardProps {
  phone: PhoneRecommendation;
  rank: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const PhoneCard: React.FC<PhoneCardProps> = ({ phone, rank, isFavorite, onToggleFavorite }) => {
  return (
    <div className="group relative bg-slate-800/80 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl transition-all hover:-translate-y-2 hover:border-indigo-500/50">
      {/* Rank Badge */}
      <div className="absolute top-4 left-4 z-10 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
        #{rank} CHOICE
      </div>

      {/* Favorite Button */}
      <button 
        onClick={() => onToggleFavorite(phone.id)}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/5 hover:bg-red-500/20 group/fav transition-colors"
      >
        <svg 
          className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover/fav:text-red-400'}`} 
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </button>

      {/* Header Visual */}
      <div className="h-52 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-6 text-center">
        <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-1">{phone.brand}</span>
        <h3 className="text-2xl font-black text-white leading-tight mb-2">{phone.name}</h3>
        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-4">
          <span className="text-sm font-medium text-slate-200">{phone.bestUseCase}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-indigo-300 font-mono font-bold">{phone.priceEstimate}</span>
          <div className="w-px h-4 bg-slate-700"></div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Match Score</span>
            <span className="text-sm font-bold text-emerald-400">{phone.matchScore}%</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Pros & Cons */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Pros</span>
            <ul className="space-y-1">
              {phone.pros.slice(0, 3).map((p, i) => (
                <li key={i} className="text-[11px] text-slate-300 flex items-start">
                  <span className="text-emerald-500 mr-1.5 font-bold">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Cons</span>
            <ul className="space-y-1">
              {phone.cons.slice(0, 2).map((c, i) => (
                <li key={i} className="text-[11px] text-slate-300 flex items-start">
                  <span className="text-red-500 mr-1.5 font-bold">×</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* E-commerce Availability */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Available At</span>
          <div className="flex flex-wrap gap-2">
            {phone.availableRetailers.map((retailer, i) => (
              <a 
                key={i}
                href={retailer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-300 hover:border-indigo-500 hover:text-white transition-all flex items-center group/retailer"
              >
                {retailer.name}
                <svg className="w-3 h-3 ml-1.5 opacity-0 group-hover/retailer:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneCard;
