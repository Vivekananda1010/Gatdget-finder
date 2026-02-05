
import React, { useState, useRef } from 'react';
import PreferenceForm from './components/PreferenceForm';
import PhoneCard from './components/PhoneCard';
import { UserPreferences, PhoneRecommendation } from './types';
import { getPhoneRecommendations } from './services/geminiService';

const App: React.FC = () => {
  const [recommendations, setRecommendations] = useState<PhoneRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = async (prefs: UserPreferences) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPhoneRecommendations(prefs);
      setRecommendations(data);
      // Scroll to results after a short delay to allow render
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">PhoneFinder <span className="text-indigo-500">AI</span></span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Home</a>
              <a href="#" className="hover:text-white transition-colors">Compare</a>
              <a href="#" className="hover:text-white transition-colors">Deals</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Perfect Phone</span> for Your Life
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Stop scrolling through endless reviews. Our AI expert analyzes your budget and priorities to recommend the best smartphone for you.
          </p>
          
          <PreferenceForm onSubmit={handleFormSubmit} isLoading={loading} />
        </section>

        {/* Results Section */}
        {recommendations.length > 0 && (
          <section ref={resultsRef} className="max-w-7xl mx-auto px-4 py-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-white">Top Recommendations</h2>
              <div className="h-1 flex-grow mx-8 bg-slate-800 rounded-full hidden md:block"></div>
              <button 
                onClick={() => setRecommendations([])}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((phone) => (
                <PhoneCard key={phone.id} phone={phone} />
              ))}
            </div>
          </section>
        )}

        {error && (
          <div className="max-w-4xl mx-auto px-4 pb-12">
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-200 text-center">
              {error}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white">PhoneFinder AI</span>
              </div>
              <p className="text-sm text-slate-500">
                Helping you navigate the complex world of mobile technology with smart, personalized advice.
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Platform</h4>
              <a href="#" className="text-sm text-slate-500 hover:text-indigo-400">About Us</a>
              <a href="#" className="text-sm text-slate-500 hover:text-indigo-400">Privacy Policy</a>
              <a href="#" className="text-sm text-slate-500 hover:text-indigo-400">Terms of Service</a>
            </div>
            <div className="flex flex-col space-y-2">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Connect</h4>
              <a href="#" className="text-sm text-slate-500 hover:text-indigo-400">Twitter</a>
              <a href="#" className="text-sm text-slate-500 hover:text-indigo-400">Instagram</a>
              <a href="#" className="text-sm text-slate-500 hover:text-indigo-400">Newsletter</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-900 text-center">
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} PhoneFinder AI. Powered by Gemini. Built for speed and accuracy.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
