
import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  CheckCircle2, 
  XCircle, 
  ShoppingCart, 
  ExternalLink, 
  Cpu, 
  Camera, 
  Zap, 
  Smartphone,
  Trophy,
  Star,
  Activity,
  Battery,
  Monitor,
  Music,
  Shield,
  Droplets,
  Volume2,
  Ear
} from 'lucide-react';
import { PhoneRecommendation, ProductCategory } from '../types';

interface PhoneCardProps {
  phone: PhoneRecommendation;
  rank: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  category: ProductCategory;
}

const PhoneCard: React.FC<PhoneCardProps> = ({ phone, rank, isFavorite, onToggleFavorite, category }) => {
  const isEarbuds = category === ProductCategory.EARBUDS;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: rank * 0.1 }}
      className="group relative bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 flex flex-col h-full overflow-hidden shadow-2xl"
    >
      {/* Rank Badge */}
      <div className="absolute top-6 left-6 z-10">
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border backdrop-blur-md ${
          rank === 1 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-slate-950/50 border-white/10 text-slate-400'
        }`}>
          {rank === 1 ? <Trophy className="w-4 h-4" /> : <Star className="w-4 h-4" />}
          <span className="text-xs font-black uppercase tracking-widest">Rank #{rank}</span>
        </div>
      </div>

      {/* Favorite Button */}
      <button 
        onClick={() => onToggleFavorite(phone.id)}
        className="absolute top-6 right-6 z-10 p-3 rounded-2xl bg-slate-950/50 border border-white/10 backdrop-blur-md group/fav transition-all hover:scale-110 active:scale-90"
      >
        <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-400 group-hover/fav:text-red-400'}`} />
      </button>

      {/* Header Visual */}
      <div className="h-56 bg-gradient-to-br from-slate-800 to-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-8 text-center">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="absolute inset-0 flex items-center justify-center opacity-10"
        >
          {isEarbuds ? (
            <Ear className="w-32 h-32 text-white" />
          ) : (
            <Smartphone className="w-32 h-32 text-white" />
          )}
        </motion.div>
        
        <div className="relative z-10 space-y-3">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] block">{phone.brand}</span>
          <h3 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter leading-none">{phone.name}</h3>
          <div className="inline-flex px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">{phone.bestUseCase}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8 flex-grow">
        {/* Dynamic 2x2 Specifications Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Specification 1: Display / Sound */}
          <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center space-x-2 text-slate-500">
              {isEarbuds ? <Music className="w-3.5 h-3.5 text-indigo-400" /> : <Monitor className="w-3.5 h-3.5 text-indigo-400" />}
              <span className="text-[9px] font-black uppercase tracking-widest truncate">
                {isEarbuds ? "Sound & Drivers" : "Display"}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-200 line-clamp-2" title={phone.display}>{phone.display}</p>
          </div>

          {/* Specification 2: Processor / ANC */}
          <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center space-x-2 text-slate-500">
              {isEarbuds ? <Volume2 className="w-3.5 h-3.5 text-violet-400" /> : <Cpu className="w-3.5 h-3.5 text-violet-400" />}
              <span className="text-[9px] font-black uppercase tracking-widest truncate">
                {isEarbuds ? "Active Noise Cancelling" : "Processor"}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-200 line-clamp-2" title={phone.processor}>{phone.processor}</p>
          </div>

          {/* Specification 3: Camera / Battery & Charging */}
          <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center space-x-2 text-slate-500">
              {isEarbuds ? <Battery className="w-3.5 h-3.5 text-emerald-400" /> : <Camera className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="text-[9px] font-black uppercase tracking-widest truncate">
                {isEarbuds ? "Battery & Case" : "Camera"}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-200 line-clamp-2" title={phone.camera}>{phone.camera}</p>
          </div>

          {/* Specification 4: Battery / Fit & Waterproof */}
          <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center space-x-2 text-slate-500">
              {isEarbuds ? <Droplets className="w-3.5 h-3.5 text-amber-400" /> : <Battery className="w-3.5 h-3.5 text-amber-400" />}
              <span className="text-[9px] font-black uppercase tracking-widest truncate">
                {isEarbuds ? "Fit & Waterproof" : "Battery"}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-200 line-clamp-2" title={phone.battery}>{phone.battery}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-2" /> Key Advantages
            </span>
            <ul className="space-y-2">
              {phone.pros.slice(0, 3).map((pro, i) => (
                <li key={i} className="text-xs text-slate-400 font-medium leading-relaxed flex items-start">
                  <span className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center">
              <XCircle className="w-3 h-3 mr-2" /> Considerations
            </span>
            <ul className="space-y-2">
              {phone.cons.slice(0, 2).map((con, i) => (
                <li key={i} className="text-xs text-slate-500 font-medium leading-relaxed flex items-start">
                  <span className="w-1.5 h-1.5 bg-red-500/20 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="p-8 pt-0 mt-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Estimated Price</span>
            <span className="text-2xl font-display font-black text-white italic">{phone.priceEstimate}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block">AI Match Score</span>
            <div className="flex items-center justify-end space-x-1">
              <Activity className="w-4 h-4 text-indigo-500" />
              <span className="text-xl font-display font-black text-white italic">{phone.matchScore}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {phone.availableRetailers.map((retailer, i) => (
            <motion.a
              key={i}
              href={retailer.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all group/link"
            >
              <ShoppingCart className="w-3 h-3" />
              <span>{retailer.name}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PhoneCard;
