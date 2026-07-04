
import React from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Monitor, 
  Camera, 
  Battery as BatteryIcon, 
  Zap, 
  Layers, 
  Info,
  Smartphone,
  DollarSign,
  Music,
  Volume2,
  Droplets,
  Ear
} from 'lucide-react';
import { PhoneRecommendation, ProductCategory } from '../types';

interface ComparisonTableProps {
  phones: PhoneRecommendation[];
  category: ProductCategory;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ phones, category }) => {
  const isEarbuds = category === ProductCategory.EARBUDS;
  const specs = [
    { label: 'Match Score', key: 'matchScore', icon: <Zap className="w-4 h-4" />, format: (v: number) => `${v}%`, highlight: true },
    { label: 'Price', key: 'priceEstimate', icon: <DollarSign className="w-4 h-4" /> },
    { label: isEarbuds ? 'Sound & Drivers' : 'Display', key: 'display', icon: isEarbuds ? <Music className="w-4 h-4" /> : <Monitor className="w-4 h-4" /> },
    { label: isEarbuds ? 'Noise Cancellation' : 'Processor', key: 'processor', icon: isEarbuds ? <Volume2 className="w-4 h-4" /> : <Cpu className="w-4 h-4" /> },
    { label: isEarbuds ? 'Battery & Case' : 'Camera', key: 'camera', icon: isEarbuds ? <BatteryIcon className="w-4 h-4" /> : <Camera className="w-4 h-4" /> },
    { label: isEarbuds ? 'Fit & Waterproof' : 'Battery', key: 'battery', icon: isEarbuds ? <Droplets className="w-4 h-4" /> : <BatteryIcon className="w-4 h-4" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-32 overflow-hidden border border-white/5 rounded-[3rem] bg-slate-900/20 backdrop-blur-2xl shadow-2xl"
    >
      <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter text-white">Spec-by-Spec Comparison</h2>
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Detailed hardware analysis across all matches</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Data Sync Active</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50">
              <th className="p-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] border-r border-white/5">Feature Matrix</th>
              {phones.map((p, idx) => (
                <th key={p.id} className="p-8 min-w-[240px]">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-[10px] font-black text-indigo-500 border border-white/5">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter mb-1">{p.brand}</span>
                      <span className="text-lg font-display font-black text-white uppercase italic tracking-tighter">{p.name}</span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {specs.map(spec => (
              <tr key={spec.label} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-8 border-r border-white/5 bg-slate-950/20">
                  <div className="flex items-center space-x-3 text-slate-500 group-hover:text-indigo-400 transition-colors">
                    {spec.icon}
                    <span className="text-[10px] font-black uppercase tracking-widest">{spec.label}</span>
                  </div>
                </td>
                {phones.map(p => {
                  const val = (p as any)[spec.key];
                  return (
                    <td key={p.id} className={`p-8 text-sm font-medium leading-relaxed ${spec.highlight ? 'text-emerald-400 font-black' : 'text-slate-400'}`}>
                      {spec.format ? spec.format(val) : val}
                      {spec.highlight && (
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${val}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-emerald-500"
                          />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="hover:bg-white/[0.02] transition-colors group">
              <td className="p-8 border-r border-white/5 bg-slate-950/20">
                <div className="flex items-center space-x-3 text-slate-500 group-hover:text-indigo-400 transition-colors">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Best For</span>
                </div>
              </td>
              {phones.map(p => (
                <td key={p.id} className="p-8">
                  <div className="inline-flex px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">{p.bestUseCase}</span>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ComparisonTable;
