
import React, { useState } from 'react';
import { 
  UserPreferences, 
  PriorityLevel, 
  GamingLevel, 
  ProcessorLevel, 
  DisplayType, 
  AudioType, 
  BuildMaterial,
  UserKnowledgeLevel
} from '../types';

interface WizardFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const BRANDS = [
  'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Motorola', 'Nothing', 'Sony', 'Asus'
];

const SIMPLE_GOALS = [
  { id: 'Photography', label: 'Pro Photography', icon: '📸', desc: 'ISP, Sensors, Optics' },
  { id: 'Gaming', label: 'Heavy Gaming', icon: '🎮', desc: 'Thermals, Cooling, GPU' },
  { id: 'Work', label: 'Work & Productivity', icon: '💼', desc: 'Multitasking, Battery' },
  { id: 'Casual', label: 'Casual Use', icon: '📱', desc: 'Reliability, Value' },
  { id: 'Battery', label: 'Long Endurance', icon: '🔋', desc: 'Charging, Capacity' }
];

const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  'United States': 'USD', 'India': 'INR', 'United Kingdom': 'GBP',
  'Germany': 'EUR', 'France': 'EUR', 'Canada': 'CAD',
  'Australia': 'AUD', 'Japan': 'JPY', 'Other': 'USD'
};

const WizardForm: React.FC<WizardFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(0); // 0 is knowledge level selection
  const [prefs, setPrefs] = useState<UserPreferences>({
    knowledgeLevel: UserKnowledgeLevel.CASUAL,
    maxPrice: 1000,
    currency: 'USD',
    country: 'United States',
    unlimitedBudget: false,
    prioritizePremium: false,
    cameraPriority: PriorityLevel.MEDIUM,
    batteryPriority: PriorityLevel.MEDIUM,
    gamingPerformance: GamingLevel.MID,
    brandPreference: '',
    processorPerformance: ProcessorLevel.BALANCED,
    minRamStorage: '8GB / 128GB',
    support5G: true,
    displayType: DisplayType.AMOLED,
    audioQuality: AudioType.STEREO,
    buildQuality: BuildMaterial.GLASS,
    updatesImportance: PriorityLevel.MEDIUM,
    simpleGoals: ['Casual']
  });

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

  const inputClasses = "w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all hover:border-slate-600";
  const labelClasses = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2";

  if (step === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl max-w-2xl mx-auto w-full text-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">Welcome to PhoneFinder</h2>
        <p className="text-sm text-slate-400 mb-10">How would you like us to find your next device?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => startJourney(UserKnowledgeLevel.CASUAL)}
            className="group p-6 bg-slate-900 border border-slate-700 rounded-3xl hover:border-indigo-500 transition-all text-left"
          >
            <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">💡</div>
            <h4 className="text-lg font-black text-white uppercase italic tracking-tight mb-1">I want it simple</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-tighter">Tell us what you do, and we'll handle the specs for you.</p>
          </button>

          <button 
            onClick={() => startJourney(UserKnowledgeLevel.EXPERT)}
            className="group p-6 bg-slate-900 border border-slate-700 rounded-3xl hover:border-indigo-500 transition-all text-left"
          >
            <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
            <h4 className="text-lg font-black text-white uppercase italic tracking-tight mb-1">I know my specs</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-tighter">Detailed control over RAM, display, silicon, and more.</p>
          </button>
        </div>
      </div>
    );
  }

  // EXPERT STEPS
  if (prefs.knowledgeLevel === UserKnowledgeLevel.EXPERT) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-2xl max-w-2xl mx-auto w-full">
        {/* Progress Tracker */}
        <div className="flex justify-between mb-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-700/50 -z-10 -translate-y-1/2"></div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 ${step >= i ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] scale-110' : 'bg-slate-800 text-slate-500'}`}>
              {i}
            </div>
          ))}
        </div>

        <div className="min-h-[440px]">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black mb-1 uppercase italic tracking-tight text-white">Region & Budget</h2>
              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Country</label>
                    <select name="country" value={prefs.country} onChange={handleChange} className={inputClasses}>
                      {Object.keys(COUNTRY_CURRENCY_MAP).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClasses}>Currency</label>
                    <input value={prefs.currency} readOnly className={`${inputClasses} opacity-50 cursor-not-allowed`} />
                  </div>
                </div>
                <div className={`${prefs.unlimitedBudget ? 'opacity-30 pointer-events-none' : ''}`}>
                  <label className={labelClasses}>Max Budget</label>
                  <input type="number" name="maxPrice" value={prefs.maxPrice} onChange={handleChange} className={inputClasses} />
                </div>
                <div onClick={() => setPrefs(p => ({...p, unlimitedBudget: !p.unlimitedBudget}))} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${prefs.unlimitedBudget ? 'bg-amber-900/20 border-amber-500 shadow-lg shadow-amber-500/10' : 'bg-slate-900 border-slate-700'}`}>
                  <span className="text-xs font-black uppercase text-white tracking-widest">Unlimited Budget Mode</span>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${prefs.unlimitedBudget ? 'bg-amber-500' : 'bg-slate-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${prefs.unlimitedBudget ? 'translate-x-6' : ''}`} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black mb-8 uppercase italic tracking-tight text-white">Performance Engine</h2>
              <div className="space-y-6">
                <div>
                   <label className={labelClasses}>Processor Performance</label>
                   <select name="processorPerformance" value={prefs.processorPerformance} onChange={handleChange} className={inputClasses}>
                    <option value={ProcessorLevel.BASIC}>Basic Tasks (Lite Apps)</option>
                    <option value={ProcessorLevel.BALANCED}>Balanced Power (Most Users)</option>
                    <option value={ProcessorLevel.FLAGSHIP}>Extreme Flagship (Pro/Gaming)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Gaming Demand</label>
                  <select name="gamingPerformance" value={prefs.gamingPerformance} onChange={handleChange} className={inputClasses}>
                    <option value={GamingLevel.CASUAL}>Casual Gamer</option>
                    <option value={GamingLevel.MID}>Mid Gamer</option>
                    <option value={GamingLevel.HEAVY}>Pro Gamer (Advanced Cooling Needed)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Minimum RAM / Storage</label>
                  <input type="text" name="minRamStorage" value={prefs.minRamStorage} onChange={handleChange} className={inputClasses} placeholder="e.g. 12GB RAM" />
                </div>
              </div>
            </div>
          )}
          {step > 2 && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-black mb-8 uppercase italic tracking-tight text-white">Final Hardware Specs</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Display Technology</label>
                    <select name="displayType" value={prefs.displayType} onChange={handleChange} className={inputClasses}>
                      <option value={DisplayType.AMOLED}>AMOLED / OLED</option>
                      <option value={DisplayType.HIGH_REFRESH}>120Hz+ Liquid Smooth</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClasses}>Imaging System</label>
                    <select name="cameraPriority" value={prefs.cameraPriority} onChange={handleChange} className={inputClasses}>
                      <option value={PriorityLevel.MEDIUM}>High Quality Imaging</option>
                      <option value={PriorityLevel.HIGH}>Pro Studio Grade</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className={labelClasses}>Preferred Brand Ecosystem</label>
                  <input type="text" name="brandPreference" value={prefs.brandPreference} onChange={handleChange} className={inputClasses} placeholder="e.g. Apple, Samsung (Optional)" />
                </div>
             </div>
          )}
        </div>

        <div className="flex justify-between mt-12">
          <button onClick={() => setStep(s => s - 1)} className="px-6 py-3 text-slate-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">Back</button>
          {step < 4 ? (
            <button onClick={() => setStep(s => s + 1)} className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 transition-all">Continue</button>
          ) : (
            <button onClick={() => onSubmit(prefs)} disabled={isLoading} className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 rounded-2xl text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 transition-all">
              {isLoading ? 'Analyzing Market...' : 'Match My Tech'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // CASUAL MODE (Simplified journey)
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-2xl max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Simple Finder</h2>
        <button onClick={() => setStep(0)} className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-indigo-300">Switch Mode</button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Market Region</label>
            <select name="country" value={prefs.country} onChange={handleChange} className={inputClasses}>
              {Object.keys(COUNTRY_CURRENCY_MAP).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className={`${prefs.unlimitedBudget ? 'opacity-30 pointer-events-none' : ''}`}>
            <label className={labelClasses}>Max Spending ({prefs.currency})</label>
            <input type="number" name="maxPrice" value={prefs.maxPrice} onChange={handleChange} className={inputClasses} disabled={prefs.unlimitedBudget} />
          </div>
        </div>

        <div onClick={() => setPrefs(p => ({...p, unlimitedBudget: !p.unlimitedBudget}))} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${prefs.unlimitedBudget ? 'bg-amber-900/20 border-amber-500 shadow-xl shadow-amber-500/10' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}>
          <div className="flex items-center space-x-4">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-colors ${prefs.unlimitedBudget ? 'bg-amber-500 text-black' : 'bg-slate-800 text-amber-500 opacity-60'}`}>💎</div>
             <div>
                <span className={`text-xs font-black uppercase tracking-widest block transition-colors ${prefs.unlimitedBudget ? 'text-white' : 'text-slate-400'}`}>The Best of the Best</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">I want a flagship, cost is no concern</span>
             </div>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${prefs.unlimitedBudget ? 'bg-amber-500' : 'bg-slate-700'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${prefs.unlimitedBudget ? 'translate-x-6' : ''}`} />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Select What You Need (Multiple OK)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SIMPLE_GOALS.map(goal => {
              const isSelected = prefs.simpleGoals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleSimpleGoal(goal.id)}
                  className={`p-4 rounded-2xl border-2 transition-all text-left group ${
                    isSelected ? 'bg-indigo-900/20 border-indigo-500 shadow-lg' : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl group-hover:scale-110 transition-transform">{goal.icon}</span>
                      <span className={`text-sm font-black uppercase italic tracking-tight ${isSelected ? 'text-white' : 'text-slate-400'}`}>{goal.label}</span>
                    </div>
                    {isSelected && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>}
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter leading-tight">{goal.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button 
        onClick={() => onSubmit(prefs)}
        disabled={isLoading || prefs.simpleGoals.length === 0}
        className="w-full mt-10 px-10 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-3xl text-white font-black uppercase italic tracking-tighter text-xl shadow-2xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Matching Your Lifestyle...
          </>
        ) : 'Find My Perfect Phone'}
      </button>
    </div>
  );
};

export default WizardForm;
