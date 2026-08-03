import React, { useState } from 'react';
import { Mail, X, Send } from 'lucide-react';
import api from '../../api/axios';

export default function FloatingSubscribe() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await api.post('/newsletter/subscribe', { email });
      if (response.data.success) {
        setStatus({ type: 'success', message: 'Successfully subscribed!' });
        setEmail('');
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setStatus({ type: 'error', message: response.data.message || 'Failed to subscribe.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'An error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Expanded Form */}
      <div 
        className={`mb-4 overflow-hidden transition-all duration-300 ease-in-out transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-[calc(100vw-3rem)] sm:w-80 max-w-sm glass bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 relative">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-brand-500/10 p-2 rounded-lg text-brand-500">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Subscribe to Articles</h3>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Get the latest computer science articles delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full transition-all"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl px-4 py-2.5 text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {loading ? 'Subscribing...' : <><Send className="w-4 h-4" /> Subscribe to Articles</>}
            </button>
          </form>

          {status.message && (
            <div className={`mt-3 p-2 rounded-lg text-xs font-medium text-center ${
              status.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {status.message}
            </div>
          )}
        </div>
      </div>

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center justify-center w-14 h-14 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 pointer-events-auto ${
          isOpen ? 'rotate-90 bg-gray-800 from-gray-800 to-gray-700' : ''
        }`}
      >
        {isOpen ? <X className="w-6 h-6 transition-transform" /> : <Mail className="w-6 h-6 transition-transform group-hover:scale-110" />}
      </button>
    </div>
  );
}
