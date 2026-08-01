import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../../api/axios'; // Direct API call for now

export default function AdminNewsletters() {
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    content: '',
    coverImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '', previewUrl: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '', previewUrl: '' });

    try {
      const response = await api.post('/admin/newsletters', formData);
      if (response.data.success) {
        const subCount = response.data.subscriberCount || 0;
        setStatus({ 
          type: 'success',
          message: subCount > 0 
            ? `Newsletter successfully sent to ${subCount} active subscriber(s)!`
            : 'Preview generated! (No active subscribers found in database yet).',
          previewUrl: response.data.previewUrl
        });
        setFormData({ subject: '', title: '', content: '', coverImage: '' });
      } else {
        setStatus({ type: 'error', message: 'Failed to send newsletter.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'An error occurred while sending.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Send Newsletter</h1>
        <p className="text-gray-500 dark:text-gray-400">Blast a beautiful email campaign to all your subscribers.</p>
      </div>

      {status.message && (
        <div className={`mb-8 p-6 rounded-2xl flex flex-col gap-3 border ${
          status.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
        }`}>
          <div className="flex items-center gap-3">
            {status.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <p className="font-bold text-lg">{status.message}</p>
          </div>
          {status.previewUrl && (
            <div className="mt-2 pl-9">
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">Click below to preview the exact HTML email that was generated:</p>
              <a 
                href={status.previewUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-brand-600 dark:text-brand-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-4 h-4" /> View Live Rendered Email ↗
              </a>
            </div>
          )}
        </div>
      )}

      <div className="glass rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Subject Line</label>
            <input 
              type="text" 
              required
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="e.g. Caching Explained: How Systems Get Faster"
              className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Main Title (Inside Email)</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Caching Explained: How Systems Get Faster"
              className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all font-bold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image URL (Optional)</label>
            <input 
              type="url" 
              value={formData.coverImage}
              onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
              placeholder="https://example.com/image.png"
              className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Newsletter Content</label>
            <p className="text-xs text-gray-500 mb-2">Tip: Use `&gt; text` for highlights and `\`\`\` text` for code blocks.</p>
            <textarea 
              required
              rows="12"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Write your email content here..."
              className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-y font-mono text-sm leading-relaxed"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:-translate-y-0"
            >
              {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Campaign</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
