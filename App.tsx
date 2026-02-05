
import React, { useState, useRef, useEffect } from 'react';
import WizardForm from './components/WizardForm';
import PhoneCard from './components/PhoneCard';
import ComparisonTable from './components/ComparisonTable';
import AIChatAssistant from './components/AIChatAssistant';
import { UserPreferences, PhoneRecommendation } from './types';
import { getPhoneRecommendations } from './services/geminiService';

const App: React.FC = () => {
  const [recommendations, setRecommendations] = useState<PhoneRecommendation[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('phone_favorites') || '[]'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('phone_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleFormSubmit = async (prefs: UserPreferences) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPhoneRecommendations(prefs);
      setRecommendations(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const trendingPhones = [
    { name: 'Samsung S24 Ultra', brand: 'Samsung', use: 'Best All-Rounder' },
    { name: 'iPhone 16 Pro', brand: 'Apple', use: 'The Pro Choice' },
    { name: 'Google Pixel 9 Pro', brand: 'Google', use: 'AI Mastery' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <nav className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between h-20 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-white uppercase italic">PhoneFinder <span className="text-indigo-500">Pro</span></span>
          </div>
          <div className="flex space-x-6 items-center">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Market Live
            </span>
            <div className="w-px h-6 bg-slate-800"></div>
            <button className="relative">
              <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {favorites.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[8px] font-black rounded-full flex items-center justify-center">{favorites.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      <main className="pb-32">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-20 items-center">
          <div className="text-left">
            <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter mb-8 text-white uppercase italic">
              Your Next <span className="text-indigo-500 block">Flagship.</span> Found by AI.
            </h1>
            <p className="text-xl text-slate-400 mb-12 max-w-xl leading-relaxed">
              We've processed 5,000+ data points across display tech, silicon performance, and ISP capabilities to match you with your perfect device.
            </p>
            
            <div className="flex flex-wrap gap-4">
              {trendingPhones.map(tp => (
                <div key={tp.name} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-full flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-300">{tp.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <WizardForm onSubmit={handleFormSubmit} isLoading={loading} />
        </section>

        {/* Results */}
        {recommendations.length > 0 && (
          <section ref={resultsRef} className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
              <div>
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-[0.3em] mb-4 block">Analysis Complete</span>
                <h2 className="text-5xl font-black uppercase italic">Top {recommendations.length} Matches</h2>
              </div>
              <p className="text-slate-500 max-w-sm text-sm">Our AI analyzed the market and identified these models that best align with your specific requirements.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((phone, idx) => (
                <PhoneCard 
                  key={phone.id} 
                  phone={phone} 
                  rank={idx + 1} 
                  isFavorite={favorites.includes(phone.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            <ComparisonTable phones={recommendations} />
          </section>
        )}

        {error && (
          <div className="max-w-2xl mx-auto px-6 mt-12">
            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-3xl text-red-200 text-center font-medium">
              {error}
            </div>
          </div>
        )}
      </main>

      <AIChatAssistant recommendations={recommendations} />

      <footer className="border-t border-white/5 py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[10px] font-black tracking-[0.5em] text-slate-600 uppercase mb-8 block">PhoneFinder Intelligent Engine v3.0</span>
          <div className="flex justify-center space-x-12 mb-16">
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase">Realtime Benchmarks</a>
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase">Privacy Shield</a>
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase">Brand Partners</a>
          </div>
          <p className="text-xs text-slate-700 max-w-xl mx-auto italic">
            Disclaimer: AI scores are based on current market specifications and professional reviewer consensus. Prices may vary by region and retailer.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
