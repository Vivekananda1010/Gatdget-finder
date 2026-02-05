
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

interface PreferenceFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const PreferenceForm: React.FC<PreferenceFormProps> = ({ onSubmit, isLoading }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prefs);
  };

  const inputClasses = "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600 text-white";
  const labelClasses = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2";
  const sectionTitleClasses = "text-lg font-bold text-indigo-400 flex items-center mb-6";
  const stepCircleClasses = "w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center mr-2";

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 md:p-10 rounded-3xl shadow-2xl border border-slate-700 space-y-10 text-left max-w-5xl mx-auto">
      
      {/* Step 1: Budget & Identity */}
      <div>
        <h3 className={sectionTitleClasses}>
          <span className={stepCircleClasses}>1</span>
          Budget & Brand
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClasses}>Min Budget ($)</label>
            <input
              type="number"
              name="minPrice"
              value={prefs.minPrice}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Max Budget ($)</label>
            <input
              type="number"
              name="maxPrice"
              value={prefs.maxPrice}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Preferred Brand (Optional)</label>
            <input
              type="text"
              name="brandPreference"
              placeholder="e.g. Samsung, Apple, Google"
              value={prefs.brandPreference}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Step 2: Performance & Hardware */}
      <div>
        <h3 className={sectionTitleClasses}>
          <span className={stepCircleClasses}>2</span>
          Performance & Storage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className={labelClasses}>Processor Power</label>
            <select name="processorPerformance" value={prefs.processorPerformance} onChange={handleChange} className={inputClasses}>
              <option value={ProcessorLevel.BASIC}>Basic (Daily Tasks)</option>
              <option value={ProcessorLevel.BALANCED}>Balanced (Best for most)</option>
              <option value={ProcessorLevel.FLAGSHIP}>Flagship (Top Tier)</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Gaming Profile</label>
            <select name="gamingPerformance" value={prefs.gamingPerformance} onChange={handleChange} className={inputClasses}>
              <option value={GamingLevel.CASUAL}>Casual / Social Media</option>
              <option value={GamingLevel.MID}>Mid-Range Gamer</option>
              <option value={GamingLevel.HEAVY}>Hardcore / Pro Gamer</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Min RAM / Storage</label>
            <input
              type="text"
              name="minRamStorage"
              placeholder="e.g. 8GB / 256GB"
              value={prefs.minRamStorage}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col justify-end">
            <label className="flex items-center space-x-3 cursor-pointer p-2.5 bg-slate-900 rounded-lg border border-slate-700">
              <input
                type="checkbox"
                name="support5G"
                checked={prefs.support5G}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded bg-slate-800 border-slate-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-300">Requires 5G Support</span>
            </label>
          </div>
        </div>
      </div>

      {/* Step 3: Multimedia & Experience */}
      <div>
        <h3 className={sectionTitleClasses}>
          <span className={stepCircleClasses}>3</span>
          Display & Multimedia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className={labelClasses}>Display Tech</label>
            <select name="displayType" value={prefs.displayType} onChange={handleChange} className={inputClasses}>
              <option value={DisplayType.AMOLED}>AMOLED / OLED (Punchy colors)</option>
              <option value={DisplayType.HIGH_REFRESH}>High Refresh Rate (Smooth)</option>
              <option value={DisplayType.LCD}>LCD (Standard)</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Audio Quality</label>
            <select name="audioQuality" value={prefs.audioQuality} onChange={handleChange} className={inputClasses}>
              <option value={AudioType.STEREO}>Stereo Speakers (Best)</option>
              <option value={AudioType.NORMAL}>Normal / Mono</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Camera Priority</label>
            <select name="cameraPriority" value={prefs.cameraPriority} onChange={handleChange} className={inputClasses}>
              <option value={PriorityLevel.LOW}>Low - Just for basics</option>
              <option value={PriorityLevel.MEDIUM}>Medium - Great for socials</option>
