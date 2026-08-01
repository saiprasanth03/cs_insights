import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    try {
      const response = await api.post('/newsletter/subscribe', { email });
      if (response.data.success) {
        setStatus('success');
        setMessage('Successfully subscribed! Welcome aboard.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Failed to subscribe.');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <Helmet>
        <title>Newsletter | CS Insights</title>
      </Helmet>
      
      <div className="glass bg-gradient-to-br from-brand-900/40 to-accent-violet/20 border border-brand-500/20 rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-cyan/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-brand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-brand-500" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">Join the CS Insights Newsletter</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
            Get exclusive tutorials, deep-dives into algorithms, and system design interviews delivered straight to your inbox. No spam, ever.
          </p>
          
          {status === 'success' && (
            <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center gap-3 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p className="font-medium">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="font-medium">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your best email address..." 
              required
              className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-96 shadow-inner"
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl px-8 py-4 text-lg transition-all shadow-lg hover:shadow-brand-500/25 shrink-0 hover:-translate-y-0.5 disabled:opacity-70"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
