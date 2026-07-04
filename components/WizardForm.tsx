
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  Settings, 
  MapPin, 
  DollarSign, 
  Cpu, 
  Gamepad2, 
  HardDrive, 
  Monitor, 
  Camera, 
  Wifi,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Diamond,
  VolumeX,
  Mic,
  Music,
  Activity,
  Battery,
  Ear
} from 'lucide-react';
import { 
  UserPreferences, 
  PriorityLevel, 
  GamingLevel, 
  ProcessorLevel, 
  DisplayType, 
  AudioType, 
  BuildMaterial,
  UserKnowledgeLevel,
  ProductCategory
} from '../types';

interface WizardFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
  category: ProductCategory;
}

const PHONE_BRANDS = [
  'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Motorola', 'Nothing', 'Sony', 'Asus', 'Realme', 'Oppo', 'Vivo'
];

const EARBUD_BRANDS = [
  'Sony', 'Bose', 'Apple', 'Sennheiser', 'Samsung', 'Google', 'Jabra', 'Soundcore', 'Beats', 'Marshall', 'Nothing', 'OnePlus'
];

const SIMPLE_PHONE_GOALS = [
  { id: 'Photography', label: 'Pro Photography', icon: <Camera className="w-5 h-5" />, desc: 'ISP, Sensors, Optics' },
  { id: 'Gaming', label: 'Heavy Gaming', icon: <Gamepad2 className="w-5 h-5" />, desc: 'Thermals, Cooling, GPU' },
  { id: 'Work', label: 'Work & Productivity', icon: <Sparkles className="w-5 h-5" />, desc: 'Multitasking, Battery' },
  { id: 'Casual', label: 'Casual Use', icon: <Smartphone className="w-5 h-5" />, desc: 'Reliability, Value' },
  { id: 'Battery', label: 'Long Endurance', icon: <Zap className="w-5 h-5" />, desc: 'Charging, Capacity' }
];

const SIMPLE_EARBUD_GOALS = [
  { id: 'ANC', label: 'Pure Quiet (ANC)', icon: <VolumeX className="w-5 h-5" />, desc: 'Active Noise Cancellation' },
  { id: 'Audiophile', label: 'Audiophile Sound', icon: <Music className="w-5 h-5" />, desc: 'High-Res Audio, Detail' },
  { id: 'Sports', label: 'Sports & Fitness', icon: <Activity className="w-5 h-5" />, desc: 'Sweatproof, Secure Fit' },
  { id: 'Calls', label: 'Crystal Clear Calls', icon: <Mic className="w-5 h-5" />, desc: 'Multi-Mic Voice Isolation' },
  { id: 'Battery', label: 'Long Endurance', icon: <Battery className="w-5 h-5" />, desc: 'Case capacity, Playtime' }
];

// Need to import Smartphone and Zap since they are used in SIMPLE_PHONE_GOALS
import { Smartphone, Zap } from 'lucide-react';

const RAM_STORAGE_OPTIONS = [
  "6GB / 128GB (Standard)",
  "8GB / 128GB (Mainstream)",
  "8GB / 256GB (Balanced)",
  "12GB / 256GB (Performance)",
  "12GB / 512GB (High Capacity)",
  "16GB / 512GB (Pro Creator)",
  "24GB / 1TB (Ultra-Premium)"
];

const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  'United States': 'USD', 'India': 'INR', 'United Kingdom': 'GBP',
  'Germany': 'EUR', 'France': 'EUR', 'Canada': 'CAD',
  'Australia': 'AUD', 'Japan': 'JPY', 'Other': 'USD'
};

const WizardForm: React.FC<WizardFormProps> = ({ onSubmit, isLoading, category }) => {
  const [step, setStep] = useState(0); // 0 is knowledge level selection
  const [prefs, setPrefs] = useState<UserPreferences>({
    category,
    knowledgeLevel: UserKnowledgeLevel.CASUAL,
    maxPrice: category === ProductCategory.EARBUDS ? 300 : 1000,
    currency: 'USD',
    country: 'United States',
    unlimitedBudget: false,
    prioritizePremium: false,
    cameraPriority: PriorityLevel.MEDIUM,
    batteryPriority: PriorityLevel.MEDIUM,
    gamingPerformance: GamingLevel.MID,
    brandPreference: '',
    processorPerformance: ProcessorLevel.BALANCED,
    minRamStorage: '8GB / 128GB (Mainstream)',
    support5G: true,
    displayType: DisplayType.AMOLED,
    audioQuality: AudioType.STEREO,
    buildQuality: BuildMaterial.GLASS,
    updatesImportance: PriorityLevel.MEDIUM,
    simpleGoals: category === ProductCategory.EARBUDS ? ['Audiophile'] : ['Casual'],
    
    // Earbuds default specs
    ancPriority: PriorityLevel.MEDIUM,
    soundProfile: 'Balanced',
    fitType: 'In-Ear',
    waterResistance: PriorityLevel.MEDIUM,
    codecPreference: 'Standard (SBC/AAC)'
  });

  const isEarbuds = category === ProductCategory.EARBUDS;
  const BRANDS = isEarbuds ? EARBUD_BRANDS : PHONE_BRANDS;
  const SIMPLE_GOALS = isEarbuds ? SIMPLE_EARBUD_GOALS : SIMPLE_PHONE_GOALS;

  React.useEffect(() => {
    setPrefs(prev => ({
      ...prev,
      category,
      maxPrice: prev.maxPrice === 1000 && isEarbuds ? 300 : (prev.maxPrice === 300 && !isEarbuds ? 1000 : prev.maxPrice),
      simpleGoals: isEarbuds ? ['Audiophile'] : ['Casual']
    }));
  }, [category, isEarbuds]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setPrefs(prev => {
      const updates: any = {
        [name]: type === 'checkbox' ? checked : (name === 'maxPrice' ? parseInt(value) : value),
      };
      if (name === 'country' && COUNTRY_CURRENCY_MAP[value]) {
        updates.currency = COUNTRY_CURRENCY_MAP[value];
      }
      return { ...prev, ...updates };
    });
  };

  const toggleBrand = (brand: string) => {
    setPrefs(prev => {
      const selected = prev.brandPreference ? prev.brandPreference.split(', ') : [];
      const newSelected = selected.includes(brand) 
        ? selected.filter(b => b !== brand)
        : [...selected, brand];
      return { ...prev, brandPreference: newSelected.join(', ') };
    });
  };

  const toggleSimpleGoal = (goalId: string) => {
    setPrefs(prev => {
      const goals = prev.simpleGoals || [];
      const newGoals = goals.includes(goalId) 
        ? goals.filter(g => g !== goalId)
        : [...goals, goalId];
      return { ...prev, simpleGoals: newGoals };
    });
  };

  const startJourney = (level: UserKnowledgeLevel) => {
    setPrefs(p => ({ ...p, knowledgeLevel: level }));
    setStep(1);
  };

  const inputClasses = "w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none text-white transition-all hover:border-white/10 placeholder:text-slate-600";
  const labelClasses = "block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3";

  const BrandSelector = () => (
    <div className="space-y-4">
      <label className={labelClasses}>Preferred Brands</label>
      <div className="flex flex-wrap gap-2">
        {BRANDS.map(brand => {
          const isSelected = prefs.brandPreference.split(', ').includes(brand);
          return (
            <motion.button
              key={brand}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleBrand(brand)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                isSelected 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
              }`}
            >
              {brand}
            </motion.button>
          );
        })}
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPrefs(p => ({ ...p, brandPreference: '' }))}
          className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
            prefs.brandPreference === '' 
            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
            : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/10'
          }`}
        >
          Any Brand
        </motion.button>
      </div>
    </div>
  );

  if (step === 0) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-2xl p-12 rounded-[3rem] border border-white/10 shadow-2xl max-w-2xl mx-auto w-full text-center relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/20 transition-colors"></div>
        
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl font-display font-black uppercase italic tracking-tighter text-white leading-none">
              Welcome to <span className="text-indigo-500">PhoneFinder</span>
            </h2>
            <p className="text-slate-400 font-medium text-lg">How would you like to find your next device?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.button 
              whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startJourney(UserKnowledgeLevel.CASUAL)}
              className="group/btn p-10 bg-slate-950/50 border border-white/5 rounded-[2.5rem] transition-all text-left relative overflow-hidden shadow-xl"
            >
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-8 group-hover/btn:scale-110 group-hover/btn:bg-indigo-500/20 transition-all">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-display font-black text-white uppercase italic tracking-tight mb-3">I want it simple</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-[0.15em]">Tell us what you do, and we'll handle the specs for you.</p>
              <div className="absolute bottom-6 right-6 opacity-0 group-hover/btn:opacity-100 transition-all -translate-x-4 group-hover/btn:translate-x-0">
                <ChevronRight className="w-6 h-6 text-indigo-500" />
              </div>
            </motion.button>

            <motion.button 
              whileHover={{ y: -5, borderColor: 'rgba(139, 92, 246, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startJourney(UserKnowledgeLevel.EXPERT)}
              className="group/btn p-10 bg-slate-950/50 border border-white/5 rounded-[2.5rem] transition-all text-left relative overflow-hidden shadow-xl"
            >
              <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-500 mb-8 group-hover/btn:scale-110 group-hover/btn:bg-violet-500/20 transition-all">
                <Settings className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-display font-black text-white uppercase italic tracking-tight mb-3">I know my specs</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-[0.15em]">Detailed control over RAM, display, silicon, and more.</p>
              <div className="absolute bottom-6 right-6 opacity-0 group-hover/btn:opacity-100 transition-all -translate-x-4 group-hover/btn:translate-x-0">
                <ChevronRight className="w-6 h-6 text-violet-500" />
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // EXPERT STEPS
  if (prefs.knowledgeLevel === UserKnowledgeLevel.EXPERT) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl max-w-2xl mx-auto w-full">
        {/* Progress Tracker */}
        <div className="flex justify-between mb-12 relative max-w-[240px] mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10 -translate-y-1/2"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500 ${step >= i ? 'bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] scale-110' : 'bg-slate-950 text-slate-600 border border-white/5'}`}>
              {i}
            </div>
          ))}
        </div>

        <div className="min-h-[480px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-black uppercase italic tracking-tight text-white">Region & Budget</h2>
                  <p className="text-slate-500 text-sm font-medium">Define your market and spending limits.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={labelClasses}><MapPin className="w-3 h-3 inline mr-1" /> Country</label>
                      <select name="country" value={prefs.country} onChange={handleChange} className={inputClasses}>
                        {Object.keys(COUNTRY_CURRENCY_MAP).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClasses}><DollarSign className="w-3 h-3 inline mr-1" /> Currency</label>
                      <input 
                        type="text" 
                        name="currency" 
                        value={prefs.currency} 
                        onChange={handleChange} 
                        className={inputClasses} 
                        placeholder="e.g. USD, EUR"
                        maxLength={5}
                      />
                    </div>
                  </div>
                  
                  <div className={`space-y-2 transition-opacity ${prefs.unlimitedBudget ? 'opacity-30 pointer-events-none' : ''}`}>
                    <label className={labelClasses}>Max Budget</label>
                    <input type="number" name="maxPrice" value={prefs.maxPrice} onChange={handleChange} className={inputClasses} />
                  </div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setPrefs(p => ({...p, unlimitedBudget: !p.unlimitedBudget}))} 
                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between ${prefs.unlimitedBudget ? 'bg-amber-500/10 border-amber-500/50 shadow-xl shadow-amber-500/10' : 'bg-slate-950 border-white/5 hover:border-white/10'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${prefs.unlimitedBudget ? 'bg-amber-500 text-black' : 'bg-slate-900 text-amber-500'}`}>
                        <Diamond className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-black uppercase text-white tracking-widest block">Unlimited Budget</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Match with the absolute best</span>
                      </div>
                    </div>
                    <div className={`w-14 h-7 rounded-full p-1 transition-colors ${prefs.unlimitedBudget ? 'bg-amber-500' : 'bg-slate-800'}`}>
                      <motion.div 
                        animate={{ x: prefs.unlimitedBudget ? 28 : 0 }}
                        className="w-5 h-5 bg-white rounded-full shadow-lg" 
                      />
                    </div>
                  </motion.div>
                  
                  <BrandSelector />
                </div>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-black uppercase italic tracking-tight text-white">
                    {isEarbuds ? "Acoustic Engine" : "Performance Engine"}
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    {isEarbuds ? "Configure active noise cancellation and sound characteristics." : "Configure the silicon and memory requirements."}
                  </p>
                </div>

                <div className="space-y-6">
                  {isEarbuds ? (
                    <>
                      <div className="space-y-2">
                        <label className={labelClasses}><VolumeX className="w-3 h-3 inline mr-1" /> Active Noise Cancellation (ANC)</label>
                        <select name="ancPriority" value={prefs.ancPriority} onChange={handleChange} className={inputClasses}>
                          <option value={PriorityLevel.LOW}>Not Important (Focus on Sound)</option>
                          <option value={PriorityLevel.MEDIUM}>Mainstream (Effective isolation)</option>
                          <option value={PriorityLevel.HIGH}>Extreme Isolation (Industry-leading quiet)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className={labelClasses}><Music className="w-3 h-3 inline mr-1" /> Sound Profile Signature</label>
                        <select name="soundProfile" value={prefs.soundProfile} onChange={handleChange} className={inputClasses}>
                          <option value="Balanced">Balanced / Audiophile (Natural acoustics)</option>
                          <option value="Bass Heavy">Bass Boosted (Hip-hop, EDM, workouts)</option>
                          <option value="Vocal-focused">Vocal / Mid-Forward (Podcasts, clear calls)</option>
                          <option value="Treble/Bright">Bright & Detailed (Classical, jazz, clarity)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className={labelClasses}><Diamond className="w-3 h-3 inline mr-1" /> Audio Codec Preferences</label>
                        <select name="codecPreference" value={prefs.codecPreference} onChange={handleChange} className={inputClasses}>
                          <option value="Standard (SBC/AAC)">Standard Quality (Universal SBC/AAC - Apple-safe)</option>
                          <option value="High-Res (LDAC/aptX Adaptive/LHDC)">High-Resolution codecs (LDAC, aptX Adaptive, LHDC)</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                         <label className={labelClasses}><Cpu className="w-3 h-3 inline mr-1" /> Processor Performance</label>
                         <select name="processorPerformance" value={prefs.processorPerformance} onChange={handleChange} className={inputClasses}>
                          <option value={ProcessorLevel.BASIC}>Basic Tasks (Lite Apps)</option>
                          <option value={ProcessorLevel.BALANCED}>Balanced Power (Most Users)</option>
                          <option value={ProcessorLevel.FLAGSHIP}>Extreme Flagship (Pro/Gaming)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className={labelClasses}><Gamepad2 className="w-3 h-3 inline mr-1" /> Gaming Demand</label>
                        <select name="gamingPerformance" value={prefs.gamingPerformance} onChange={handleChange} className={inputClasses}>
                          <option value={GamingLevel.CASUAL}>Casual Gamer</option>
                          <option value={GamingLevel.MID}>Mid Gamer</option>
                          <option value={GamingLevel.HEAVY}>Pro Gamer (Advanced Cooling Needed)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className={labelClasses}><HardDrive className="w-3 h-3 inline mr-1" /> Min RAM / Storage Combo</label>
                        <select name="minRamStorage" value={prefs.minRamStorage} onChange={handleChange} className={inputClasses}>
                          {RAM_STORAGE_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
            
            {step >= 3 && (
               <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
               >
                  <div className="space-y-2">
                    <h2 className="text-3xl font-display font-black uppercase italic tracking-tight text-white">
                      {isEarbuds ? "Fit & Protection" : "Final Hardware Specs"}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                      {isEarbuds ? "Select how you wear them and what environment they should withstand." : "Visuals, imaging, and connectivity preferences."}
                    </p>
                  </div>

                  {isEarbuds ? (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className={labelClasses}><Ear className="w-3 h-3 inline mr-1" /> Form Factor / Fit Style</label>
                        <select name="fitType" value={prefs.fitType} onChange={handleChange} className={inputClasses}>
                          <option value="In-Ear">In-Ear with silicone tips (Isolation)</option>
                          <option value="Semi-Open">Semi-Open (AirPods style, zero fatigue)</option>
                          <option value="Open-Ear / Bone Conduction">Open-Ear / Bone Conduction (Sports safety)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className={labelClasses}><Activity className="w-3 h-3 inline mr-1" /> Water Resistance (IPX)</label>
                        <select name="waterResistance" value={prefs.waterResistance} onChange={handleChange} className={inputClasses}>
                          <option value={PriorityLevel.LOW}>Standard (IPX2-IPX4 - Everyday sweat)</option>
                          <option value={PriorityLevel.MEDIUM}>High Water-Res (IPX5 - Running, heavy sweat)</option>
                          <option value={PriorityLevel.HIGH}>Waterproof (IPX7 - Extreme protection/washing)</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className={labelClasses}><Monitor className="w-3 h-3 inline mr-1" /> Display Technology</label>
                          <select name="displayType" value={prefs.displayType} onChange={handleChange} className={inputClasses}>
                            <option value={DisplayType.AMOLED}>AMOLED / OLED</option>
                            <option value={DisplayType.HIGH_REFRESH}>120Hz+ Liquid Smooth</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className={labelClasses}><Camera className="w-3 h-3 inline mr-1" /> Imaging System</label>
                          <select name="cameraPriority" value={prefs.cameraPriority} onChange={handleChange} className={inputClasses}>
                            <option value={PriorityLevel.MEDIUM}>High Quality Imaging</option>
                            <option value={PriorityLevel.HIGH}>Pro Studio Grade</option>
                          </select>
                        </div>
                      </div>
                      
                      <motion.div 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleChange({ target: { name: 'support5G', type: 'checkbox', checked: !prefs.support5G } } as any)}
                        className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between ${prefs.support5G ? 'bg-indigo-500/10 border-indigo-500/50 shadow-xl shadow-indigo-500/10' : 'bg-slate-950 border-white/5 hover:border-white/10'}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${prefs.support5G ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-indigo-500'}`}>
                            <Wifi className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-xs font-black uppercase text-white tracking-widest block">5G Connectivity</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Next-gen network support</span>
                          </div>
                        </div>
                        <div className={`w-14 h-7 rounded-full p-1 transition-colors ${prefs.support5G ? 'bg-indigo-500' : 'bg-slate-800'}`}>
                          <motion.div 
                            animate={{ x: prefs.support5G ? 28 : 0 }}
                            className="w-5 h-5 bg-white rounded-full shadow-lg" 
                          />
                        </div>
                      </motion.div>
                    </>
                  )}
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
          <button 
            onClick={() => setStep(s => s - 1)} 
            className="flex items-center space-x-2 px-6 py-3 text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          {step < 3 ? (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(s => s + 1)} 
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all flex items-center space-x-2"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSubmit(prefs)} 
              disabled={isLoading} 
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Match My Tech</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  // CASUAL MODE
  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black uppercase italic tracking-tight text-white leading-none">Simple Finder</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Personalized matching made easy</p>
        </div>
        <button 
          onClick={() => setStep(0)} 
          className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400 transition-colors border border-white/5"
        >
          Switch Mode
        </button>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className={labelClasses}><MapPin className="w-3 h-3 inline mr-1" /> Region</label>
            <select name="country" value={prefs.country} onChange={handleChange} className={inputClasses}>
              {Object.keys(COUNTRY_CURRENCY_MAP).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelClasses}><DollarSign className="w-3 h-3 inline mr-1" /> Currency</label>
            <input 
              type="text" 
              name="currency" 
              value={prefs.currency} 
              onChange={handleChange} 
              className={inputClasses} 
              placeholder="e.g. USD, EUR"
              maxLength={5}
            />
          </div>
          <div className={`space-y-2 transition-opacity ${prefs.unlimitedBudget ? 'opacity-30 pointer-events-none' : ''}`}>
            <label className={labelClasses}><DollarSign className="w-3 h-3 inline mr-1" /> Max Budget ({prefs.currency})</label>
            <input type="number" name="maxPrice" value={prefs.maxPrice} onChange={handleChange} className={inputClasses} disabled={prefs.unlimitedBudget} />
          </div>
        </div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setPrefs(p => ({...p, unlimitedBudget: !p.unlimitedBudget}))} 
          className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between group ${prefs.unlimitedBudget ? 'bg-amber-500/10 border-amber-500/50 shadow-2xl shadow-amber-500/10' : 'bg-slate-950 border-white/5 hover:border-white/10'}`}
        >
          <div className="flex items-center space-x-5">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${prefs.unlimitedBudget ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-slate-900 text-amber-500 opacity-60'}`}>
               <Diamond className="w-7 h-7" />
             </div>
             <div>
                <span className={`text-xs font-black uppercase tracking-widest block transition-colors ${prefs.unlimitedBudget ? 'text-white' : 'text-slate-400'}`}>The Best of the Best</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">I want a flagship, cost is no concern</span>
             </div>
          </div>
          <div className={`w-14 h-7 rounded-full p-1 transition-colors ${prefs.unlimitedBudget ? 'bg-amber-500' : 'bg-slate-800'}`}>
            <motion.div 
              animate={{ x: prefs.unlimitedBudget ? 28 : 0 }}
              className="w-5 h-5 bg-white rounded-full shadow-lg" 
            />
          </div>
        </motion.div>

        <BrandSelector />

        <div className="space-y-4">
          <label className={labelClasses}>Select What You Need (Multiple OK)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SIMPLE_GOALS.map(goal => {
              const isSelected = prefs.simpleGoals.includes(goal.id);
              return (
                <motion.button
                  key={goal.id}
                  whileHover={{ y: -3, borderColor: isSelected ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.1)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleSimpleGoal(goal.id)}
                  className={`p-6 rounded-[2rem] border-2 transition-all text-left group relative overflow-hidden ${
                    isSelected ? 'bg-indigo-500/10 border-indigo-500/50 shadow-xl shadow-indigo-500/10' : 'bg-slate-950 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 group-hover:text-slate-200'}`}>
                        {goal.icon}
                      </div>
                      <span className={`text-sm font-display font-black uppercase italic tracking-tight ${isSelected ? 'text-white' : 'text-slate-400'}`}>{goal.label}</span>
                    </div>
                    {isSelected && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,1)]"></div>}
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">{goal.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSubmit(prefs)}
        disabled={isLoading || prefs.simpleGoals.length === 0}
        className="w-full mt-12 px-10 py-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 disabled:text-slate-700 rounded-[2rem] text-white font-display font-black uppercase italic tracking-tight text-2xl shadow-[0_20px_50px_-12px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center space-x-4"
      >
        {isLoading ? (
          <>
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Analyzing Market...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            <span>{isEarbuds ? "Find My Perfect Earbuds" : "Find My Perfect Phone"}</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default WizardForm;
