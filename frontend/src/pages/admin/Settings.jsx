import React, { useState } from 'react';
import { Users, ShieldCheck, Mail, AlertCircle, CheckCircle2, Send } from "lucide-react";
import api from '../../../api/axios';
import { promoteToAdmin } from '../../api/admin';

export default function AdminSettings() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const [testEmail, setTestEmail] = useState('');
  const [testStatus, setTestStatus] = useState(null);
  const [testingEmail, setTestingEmail] = useState(false);

  const handleTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmail) return;
    setTestingEmail(true);
    setTestStatus(null);
    try {
      const response = await api.post('/admin/test-email', { email: testEmail });
      setTestStatus(response.data.results);
    } catch (err) {
      setTestStatus({ error: err.response?.data?.message || err.message });
    }
    setTestingEmail(false);
  };

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

      <div className="glass rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-brand-500/10 rounded-xl text-brand-600 dark:text-brand-400">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Email Configuration Test</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Verify your Resend and Brevo API integrations.</p>
          </div>
        </div>

        {testStatus && testStatus.error && (
          <div className="mb-6 p-4 rounded-xl flex items-start gap-3 border bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{testStatus.error}</p>
          </div>
        )}

        {testStatus && !testStatus.error && (
          <div className="mb-6 space-y-3">
            <div className={`p-4 rounded-xl border flex justify-between items-center ${testStatus.resend.status === 'SUCCESS' ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' : testStatus.resend.configured ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-400'}`}>
              <div>
                <strong className="block text-sm">Resend (First 100 Emails)</strong>
                <span className="text-xs">{testStatus.resend.configured ? 'Configured in .env' : 'Not configured (Missing API Key)'}</span>
              </div>
              <span className="font-bold">{testStatus.resend.status}</span>
            </div>
            
            <div className={`p-4 rounded-xl border flex justify-between items-center ${testStatus.brevo.status === 'SUCCESS' ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' : testStatus.brevo.configured ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-400'}`}>
              <div>
                <strong className="block text-sm">Brevo SMTP (Fallback)</strong>
                <span className="text-xs">{testStatus.brevo.configured ? 'Configured in .env' : 'Not configured (Missing API Key)'}</span>
              </div>
              <span className="font-bold">{testStatus.brevo.status}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleTestEmail} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="email" 
              required
              placeholder="Enter your email to receive a test message"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={testingEmail}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 dark:from-gray-700 dark:to-gray-600 text-white font-medium py-3.5 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:-translate-y-0"
          >
            {testingEmail ? 'Testing...' : 'Send Test Emails'}
          </button>
        </form>
      </div>
    </div>
  );
}
