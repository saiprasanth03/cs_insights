import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api/axios';

export default function Unsubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    const isConfirmed = window.confirm("Are you absolutely sure you want to unsubscribe? You will no longer receive our latest articles and updates.");
    if (!isConfirmed) return;

    setStatus('loading');
    try {
      const response = await api.post('/newsletter/unsubscribe', { email });
      if (response.data.success) {
        setStatus('success');
        setMessage('You have been successfully unsubscribed from our newsletter.');
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Failed to unsubscribe.');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
        
        {status === 'success' ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Unsubscribed</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>
            <a href="/" className="inline-block px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Return Home
            </a>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unsubscribe</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Enter your email address to unsubscribe from CS Insights newsletters.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                />
              </div>

              {status === 'error' && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 px-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-medium rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
