
import React from 'react';
import { PhoneRecommendation } from '../types';

interface PhoneCardProps {
  phone: PhoneRecommendation;
}

const PhoneCard: React.FC<PhoneCardProps> = ({ phone }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
      <div className="h-48 bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-1">{phone.name}</h3>
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-indigo-500/30">
            {phone.brand}
          </span>
          <p className="text-indigo-400 font-mono mt-3 text-lg">{phone.priceEstimate}</p>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Why it fits you</h4>
          <p className="text-slate-200 text-sm leading-relaxed">{phone.whyThisPhone}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Processor</span>
            <p className="text-xs text-slate-300 truncate" title={phone.processor}>{phone.processor}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Display</span>
            <p className="text-xs text-slate-300 truncate" title={phone.display}>{phone.display}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Camera</span>
            <p className="text-xs text-slate-300 truncate" title={phone.camera}>{phone.camera}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Battery</span>
            <p className="text-xs text-slate-300 truncate" title={phone.battery}>{phone.battery}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Highlights</h4>
          <div className="flex flex-wrap gap-2">
            {phone.keyFeatures.map((feature, idx) => (
              <span key={idx} className="bg-slate-700 text-slate-300 text-[10px] font-medium px-2 py-1 rounded">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneCard;
