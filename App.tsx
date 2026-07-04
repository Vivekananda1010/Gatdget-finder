
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Heart, 
  Zap, 
  Shield, 
  Cpu, 
  Camera, 
  Layers, 
  ChevronRight,
  AlertTriangle,
  ExternalLink,
  Ear
} from 'lucide-react';
import WizardForm from './components/WizardForm';
import PhoneCard from './components/PhoneCard';
import ComparisonTable from './components/ComparisonTable';
import AIChatAssistant from './components/AIChatAssistant';
import { UserPreferences, PhoneRecommendation, ProductCategory } from './types';
import { getPhoneRecommendations } from './services/geminiService';

const App: React.FC = () => {
  const [category, setCategory] = useState<ProductCategory>(ProductCategory.PHONE);
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

  const trendingEarbuds = [
    { name: 'Sony WF-1000XM5', brand: 'Sony', use: 'Ultimate Noise Cancelling' },
    { name: 'Bose QC Ultra', brand: 'Bose', use: 'Supreme Comfort & Quiet' },
    { name: 'Apple AirPods Pro 2', brand: 'Apple', use: 'Ecosystem Harmony' }
  ];

  const trendingItems = category === ProductCategory.EARBUDS ? trendingEarbuds : trendingPhones;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full"
        />
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <nav className="border-b border-white/5 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between h-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group cursor-pointer">
              {category === ProductCategory.EARBUDS ? (
                <Ear className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
              ) : (
                <Smartphone className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
              )}
            </div>
            <span className="text-2xl font-display font-black tracking-tight text-white uppercase italic">
              {category === ProductCategory.EARBUDS ? "Audio" : "Phone"}<span className="text-indigo-500">Finder</span>
            </span>
          </motion.div>
          
          <div className="flex space-x-8 items-center">
            <div className="hidden md:flex space-x-8">
              {['Benchmarks', 'Compare', 'Expert Mode'].map((item) => (
                <a key={item} href="#" className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em]">
                  {item}
                </a>
              ))}
            </div>
            <div className="w-px h-6 bg-slate-800 hidden md:block"></div>
            <button className="relative group p-2">
              <Heart className={`w-6 h-6 transition-colors ${favorites.length > 0 ? 'text-red-500 fill-red-500' : 'text-slate-400 group-hover:text-red-400'}`} />
              <AnimatePresence>
                {favorites.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-950"
                  >
                    {favorites.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 grid lg:grid-cols-2 gap-20 items-center">
          <div className="text-left space-y-12">
            <div className="flex flex-wrap items-center gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span>Powered by Gemini 3.5 Flash</span>
              </motion.div>

              {/* Dynamic Interactive Category Switcher */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex bg-slate-950/80 p-1 rounded-[1.25rem] border border-white/5"
              >
                <button 
                  onClick={() => {
                    setCategory(ProductCategory.PHONE);
                    setRecommendations([]);
                  }}
                  className={`flex items-center space-x-2 py-1.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${category === ProductCategory.PHONE ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Phones</span>
                </button>
                <button 
                  onClick={() => {
                    setCategory(ProductCategory.EARBUDS);
                    setRecommendations([]);
                  }}
                  className={`flex items-center space-x-2 py-1.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${category === ProductCategory.EARBUDS ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}
                >
                  <Ear className="w-3.5 h-3.5" />
                  <span>Earbuds</span>
                </button>
              </motion.div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl md:text-9xl font-display font-black leading-[0.85] tracking-tighter text-white uppercase italic"
            >
              Your Next <span className="text-indigo-500 block">{category === ProductCategory.EARBUDS ? "Acoustic." : "Flagship."}</span> 
              <span className="text-slate-700">Found by AI.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 max-w-xl leading-relaxed font-medium"
            >
              {category === ProductCategory.EARBUDS 
                ? "We've analyzed driver materials, sound responses, active noise cancellation frequency depths, and water resistance to find your perfect fit."
                : "We've processed 5,000+ data points across display tech, silicon performance, and ISP capabilities to match you with your perfect device."}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              {trendingItems.map((tp, idx) => (
                <motion.div 
                  key={tp.name}
                  whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.5)' }}
                  className="px-5 py-3 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl flex items-center space-x-4 transition-colors group cursor-default"
                >
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{tp.brand}</span>
                    <span className="text-sm font-bold text-slate-200">{tp.name}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full -z-10"></div>
            <WizardForm onSubmit={handleFormSubmit} isLoading={loading} category={category} />
          </motion.div>
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {recommendations.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              ref={resultsRef} 
              className="max-w-7xl mx-auto px-6 py-32"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 space-y-8 md:space-y-0">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 text-indigo-500">
                    <Layers className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-[0.4em]">Analysis Complete</span>
                  </div>
                  <h2 className="text-6xl md:text-8xl font-display font-black uppercase italic leading-none tracking-tighter">
                    Top {recommendations.length} <span className="text-slate-800">Matches</span>
                  </h2>
                </div>
                <p className="text-slate-400 max-w-sm text-base leading-relaxed border-l-2 border-indigo-500/30 pl-8 font-medium">
                  Our AI analyzed the market and identified these models that best align with your specific requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-40">
                {recommendations.map((phone, idx) => (
                  <PhoneCard 
                    key={phone.id} 
                    phone={phone} 
                    rank={idx + 1} 
                    isFavorite={favorites.includes(phone.id)}
                    onToggleFavorite={toggleFavorite}
                    category={category}
                  />
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="pt-32 border-t border-white/5"
              >
                <ComparisonTable phones={recommendations} category={category} />
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto px-6 mt-12"
            >
              <div className="bg-red-500/10 border border-red-500/30 p-10 rounded-[3rem] text-red-200 text-center font-bold flex items-center justify-center space-x-6 shadow-2xl shadow-red-500/10">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <span className="text-lg">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AIChatAssistant recommendations={recommendations} category={category} />

      <footer className="border-t border-white/5 py-40 bg-slate-950/50 backdrop-blur-3xl mt-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-20 mb-32">
            <div className="col-span-2 space-y-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  {category === ProductCategory.EARBUDS ? (
                    <Ear className="w-7 h-7 text-white" />
                  ) : (
                    <Smartphone className="w-7 h-7 text-white" />
                  )}
                </div>
                <span className="text-2xl font-display font-black tracking-tight text-white uppercase italic">
                  {category === ProductCategory.EARBUDS ? "Audio" : "Phone"}<span className="text-indigo-500">Finder</span>
                </span>
              </div>
              <p className="text-slate-500 max-w-md text-base leading-relaxed font-medium">
                {category === ProductCategory.EARBUDS
                  ? "The world's most advanced AI audio consultant. We use real-time acoustic profiles and professional reviews to find your perfect fit."
                  : "The world's most advanced AI smartphone consultant. We use real-time market data and professional benchmarks to find your perfect match."}
              </p>
            </div>
            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Resources</h4>
              <ul className="space-y-5">
                {['Benchmarks', 'Brand Partners', 'Market Data', 'API Access'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors font-bold flex items-center group">
                      {item}
                      <ChevronRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Legal</h4>
              <ul className="space-y-5">
                {['Privacy Shield', 'Terms of Service', 'AI Disclaimer', 'Cookie Policy'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors font-bold flex items-center group">
                      {item}
                      <ChevronRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            <div className="flex flex-col space-y-2">
              <span className="text-[10px] font-black tracking-[0.6em] text-slate-700 uppercase">PhoneFinder Intelligent Engine v3.0</span>
              <p className="text-[10px] text-slate-800 font-bold uppercase tracking-widest">© 2024 PhoneFinder Pro. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <Shield className="w-4 h-4" />
                <span>Secure Data</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <Zap className="w-4 h-4" />
                <span>Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
