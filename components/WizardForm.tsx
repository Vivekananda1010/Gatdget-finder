
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

const WizardForm: React.FC<WizardFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<UserPreferences>({
    minPrice: 400,
    maxPrice: 1000,
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
    setPrefs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name.includes('Price') ? parseInt(value) : value),
    }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const inputClasses = "w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white";
  const labelClasses = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2";

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-2xl max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-700 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= i ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
            {i}
          </div>
        ))}
      </div>

      <div className="min-h-[300px]">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold mb-6">Budget & Identity</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Min Budget ($)</label>
                  <input type="number" name="minPrice" value={prefs.minPrice} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Max Budget ($)</label>
                  <input type="number" name="maxPrice" value={prefs.maxPrice} onChange={handleChange} className={inputClasses} />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Preferred Brand</label>
                <input type="text" name="brandPreference" placeholder="e.g. Samsung, Apple, Any" value={prefs.brandPreference} onChange={handleChange} className={inputClasses} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold mb-6">Performance</h2>
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
                  <option value={GamingLevel.CASUAL}>Casual</option>
                  <option value={GamingLevel.MID}>Mid-Range Gamer</option>
                  <option value={GamingLevel.HEAVY}>Pro Gamer</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Min RAM / Storage</label>
                <input type="text" name="minRamStorage" value={prefs.minRamStorage} onChange={handleChange} className={inputClasses} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold mb-6">Hardware & Connectivity</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-slate-900 rounded-xl border border-slate-700">
                <input type="checkbox" name="support5G" checked={prefs.support5G} onChange={handleChange} className="w-5 h-5 accent-indigo-500" />
                <span className="text-sm font-medium">I need 5G Support</span>
              </div>
              <div>
                <label className={labelClasses}>Build Material</label>
                <select name="buildQuality" value={prefs.buildQuality} onChange={handleChange} className={inputClasses}>
                  <option value={BuildMaterial.GLASS}>Premium Glass</option>
                  <option value={BuildMaterial.METAL}>Rugged Metal</option>
                  <option value={BuildMaterial.PLASTIC}>Lightweight Plastic</option>
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
            <h2 className="text-2xl font-bold mb-6">User Experience</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Display</label>
                <select name="displayType" value={prefs.displayType} onChange={handleChange} className={inputClasses}>
                  <option value={DisplayType.AMOLED}>AMOLED (Deep Blacks)</option>
                  <option value={DisplayType.HIGH_REFRESH}>High Refresh (Smooth)</option>
                  <option value={DisplayType.LCD}>LCD (Budget)</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Camera</label>
                <select name="cameraPriority" value={prefs.cameraPriority} onChange={handleChange} className={inputClasses}>
                  <option value={PriorityLevel.LOW}>Basic</option>
                  <option value={PriorityLevel.MEDIUM}>Good Socials</option>
                  <option value={PriorityLevel.HIGH}>Pro Quality</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Battery</label>
                <select name="batteryPriority" value={prefs.batteryPriority} onChange={handleChange} className={inputClasses}>
                  <option value={PriorityLevel.MEDIUM}>Standard Day</option>
                  <option value={PriorityLevel.HIGH}>Extreme Life</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Updates</label>
                <select name="updatesImportance" value={prefs.updatesImportance} onChange={handleChange} className={inputClasses}>
                  <option value={PriorityLevel.LOW}>Optional</option>
                  <option value={PriorityLevel.HIGH}>Must be long-term</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-10">
        <button 
          onClick={prevStep} 
          disabled={step === 1 || isLoading} 
          className="px-6 py-3 rounded-xl text-slate-400 hover:text-white disabled:opacity-0 transition-all font-medium"
        >
          Back
        </button>
        {step < 4 ? (
          <button 
            onClick={nextStep} 
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            Continue
          </button>
        ) : (
          <button 
            onClick={() => onSubmit(prefs)}
            disabled={isLoading}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 rounded-xl text-white font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            {isLoading ? 'Analyzing...' : 'Find My Phone'}
          </button>
        )}
      </div>
    </div>
  );
};

export default WizardForm;
