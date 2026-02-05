
import React, { useState } from 'react';
import { 
  UserPreferences, 
  PriorityLevel, 
  GamingLevel, 
  ProcessorLevel, 
  DisplayType, 
  AudioType, 
  BuildMaterial 
} from '../types';

interface WizardFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const BRANDS = [
  'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Motorola', 'Nothing', 'Sony', 'Asus'
];

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'JPY', symbol: '¥' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'CAD', symbol: 'C$' }
];

const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  'United States': 'USD',
  'India': 'INR',
  'United Kingdom': 'GBP',
  'Germany': 'EUR',
  'France': 'EUR',
  'Canada': 'CAD',
  'Australia': 'AUD',
  'Japan': 'JPY',
  'Other': 'USD'
};

const COUNTRIES = Object.keys(COUNTRY_CURRENCY_MAP);

const WizardForm: React.FC<WizardFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<UserPreferences>({
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

  const toggleBrand = (brand: string) => {
    setPrefs(prev => {
      const selectedBrands = prev.brandPreference ? prev.brandPreference.split(', ').filter(b => b !== 'Any') : [];
      let newBrands: string[];
      
      if (selectedBrands.includes(brand)) {
        newBrands = selectedBrands.filter(b => b !== brand);
      } else {
        newBrands = [...selectedBrands, brand];
      }
      
      return {
        ...prev,
        brandPreference: newBrands.length > 0 ? newBrands.join(', ') : ''
      };
    });
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const inputClasses = "w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all hover:border-slate-600";
  const labelClasses = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2";

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
            <p className="text-xs text-slate-500 mb-8 font-medium italic">Finding top-tier devices based on your buying power.</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Country / Region</label>
                  <select name="country" value={prefs.country} onChange={handleChange} className={inputClasses}>
                    {COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Currency</label>
                  <select name="currency" value={prefs.currency} onChange={handleChange} className={inputClasses}>
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className={`transition-all duration-300 ${prefs.unlimitedBudget ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                  <label className={labelClasses}>Maximum Budget</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-black text-xs">
                      {CURRENCIES.find(c => c.code === prefs.currency)?.symbol}
                    </span>
                    <input 
                      type="number" 
                      name="maxPrice" 
                      value={prefs.maxPrice} 
                      onChange={handleChange} 
                      className={`${inputClasses} pl-10 font-bold`} 
                      disabled={prefs.unlimitedBudget}
                    />
                  </div>
                </div>

                {/* Unlimited Budget Toggle */}
                <div 
                  onClick={() => setPrefs(prev => ({ ...prev, unlimitedBudget: !prev.unlimitedBudget }))}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                    prefs.unlimitedBudget 
                    ? 'bg-amber-900/20 border-amber-500 shadow-lg shadow-amber-600/10' 
                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${prefs.unlimitedBudget ? 'bg-amber-500' : 'bg-slate-800'}`}>
                      <svg className={`w-6 h-6 ${prefs.unlimitedBudget ? 'text-black' : 'text-slate-500'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.363.242.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.514 1.31c.307.355.849.733 1.557.923V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.514-1.31c-.307-.355-.849-.733-1.557-.923V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className={`text-sm font-black uppercase italic tracking-tight ${prefs.unlimitedBudget ? 'text-amber-400' : 'text-slate-400'}`}>Unlimited Budget</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Show me the absolute best tech on earth</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${prefs.unlimitedBudget ? 'bg-amber-500' : 'bg-slate-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${prefs.unlimitedBudget ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClasses}>Preferred Brands</label>
                <div className="grid grid-cols-3 gap-2">
                  {BRANDS.map(brand => {
                    const isSelected = prefs.brandPreference.split(', ').includes(brand);
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => toggleBrand(brand)}
                        className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                          isSelected 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-105' 
                          : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setPrefs(p => ({ ...p, brandPreference: '' }))}
                    className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                      prefs.brandPreference === '' 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30' 
                      : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                    }`}
                  >
                    Any Brand
                  </button>
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
                <label className={labelClasses}>Processing Power</label>
                <select name="processorPerformance" value={prefs.processorPerformance} onChange={handleChange} className={inputClasses}>
                  <option value={ProcessorLevel.BASIC}>Basic (Socials, Mail)</option>
                  <option value={ProcessorLevel.BALANCED}>Balanced (Average User)</option>
                  <option value={ProcessorLevel.FLAGSHIP}>Flagship (Top Power)</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Gaming Profile</label>
                <select name="gamingPerformance" value={prefs.gamingPerformance} onChange={handleChange} className={inputClasses}>
                  <option value={GamingLevel.CASUAL}>Casual Gaming</option>
                  <option value={GamingLevel.MID}>Mid-Range Gamer</option>
                  <option value={GamingLevel.HEAVY}>Pro / Competitive</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Min RAM / Storage</label>
                <input type="text" name="minRamStorage" value={prefs.minRamStorage} onChange={handleChange} placeholder="e.g. 12GB / 256GB" className={inputClasses} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-black mb-8 uppercase italic tracking-tight text-white">Hardware Internals</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-5 bg-slate-900 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                <input type="checkbox" name="support5G" checked={prefs.support5G} onChange={handleChange} className="w-6 h-6 rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-offset-slate-900 focus:ring-indigo-600 cursor-pointer" />
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors uppercase tracking-tight">Requires 5G Support</span>
              </div>
              <div>
                <label className={labelClasses}>Build Material</label>
                <select name="buildQuality" value={prefs.buildQuality} onChange={handleChange} className={inputClasses}>
                  <option value={BuildMaterial.GLASS}>Premium Glass & Armor</option>
                  <option value={BuildMaterial.METAL}>Rugged Metal Frame</option>
                  <option value={BuildMaterial.PLASTIC}>Polycarbonate (Light)</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Audio Preference</label>
                <select name="audioQuality" value={prefs.audioQuality} onChange={handleChange} className={inputClasses}>
                  <option value={AudioType.STEREO}>Stereo Speakers (Dual)</option>
                  <option value={AudioType.NORMAL}>Standard Mono</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-black mb-8 uppercase italic tracking-tight text-white">Visual Experience</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Display Tech</label>
                <select name="displayType" value={prefs.displayType} onChange={handleChange} className={inputClasses}>
                  <option value={DisplayType.AMOLED}>AMOLED / OLED</option>
                  <option value={DisplayType.HIGH_REFRESH}>120Hz+ Refresh</option>
                  <option value={DisplayType.LCD}>Standard LCD</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Camera Grade</label>
                <select name="cameraPriority" value={prefs.cameraPriority} onChange={handleChange} className={inputClasses}>
                  <option value={PriorityLevel.LOW}>Basic Setup</option>
                  <option value={PriorityLevel.MEDIUM}>Social Ready</option>
                  <option value={PriorityLevel.HIGH}>Pro Imaging</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Power Endurance</label>
                <select name="batteryPriority" value={prefs.batteryPriority} onChange={handleChange} className={inputClasses}>
                  <option value={PriorityLevel.MEDIUM}>Standard Day</option>
                  <option value={PriorityLevel.HIGH}>Extreme Life</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Support Cycle</label>
                <select name="updatesImportance" value={prefs.updatesImportance} onChange={handleChange} className={inputClasses}>
                  <option value={PriorityLevel.LOW}>Short Term</option>
                  <option value={PriorityLevel.HIGH}>Long Term (4y+)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-12">
        <button 
          onClick={prevStep} 
          disabled={step === 1 || isLoading} 
          className="px-8 py-4 rounded-2xl text-slate-500 hover:text-white disabled:opacity-0 transition-all font-black uppercase text-xs tracking-widest"
        >
          Previous
        </button>
        {step < 4 ? (
          <button 
            onClick={nextStep} 
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            Continue
          </button>
        ) : (
          <button 
            onClick={() => onSubmit(prefs)}
            disabled={isLoading}
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-2xl text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing
              </span>
            ) : 'Analyze Market'}
          </button>
        )}
      </div>
    </div>
  );
};

export default WizardForm;
