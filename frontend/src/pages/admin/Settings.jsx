import React, { useState } from 'react';
import { Users, ShieldCheck, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { promoteToAdmin } from '../../api/admin';

export default function AdminSettings() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handlePromote = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter an email address.' });
      return;
    }

    setLoading(true);
    const result = await promoteToAdmin(email);
    
    if (result.success) {
      setStatus({ type: 'success', message: result.message || 'User successfully promoted to Admin.' });
      setEmail('');
    } else {
      setStatus({ type: 'error', message: result.error || 'Failed to promote user.' });
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Admin Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage permissions, team members, and global configurations.</p>
      </div>

      <div className="glass rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-brand-500/10 rounded-xl text-brand-600 dark:text-brand-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Promote User to Admin</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Grant full administrative privileges to an existing user.</p>
          </div>
        </div>

        {status.message && (
          <div className={`mb-6 p-4 border rounded-xl flex items-center gap-3 text-sm font-medium ${
            status.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <p>{status.message}</p>
          </div>
        )}

        <form onSubmit={handlePromote} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="email" 
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium py-3.5 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:-translate-y-0"
          >
            {loading ? 'Promoting...' : 'Promote to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
