import React, { useState, useEffect } from 'react';
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
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/admin/newsletters');
      if (response.data.success) {
        setCampaigns(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns', error);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '', failedRecipients: [] });

    try {
      const response = await api.post('/admin/newsletters', formData);
      if (response.data.success) {
        const subCount = response.data.subscriberCount || 0;
        const failed = response.data.failedRecipients || [];
        const successCount = subCount - failed.length;

        setStatus({ 
          type: failed.length > 0 ? 'warning' : 'success',
          message: subCount > 0 
            ? `Campaign processed: ${successCount}/${subCount} emails sent successfully!`
            : 'No active subscribers found in database.',
          failedRecipients: failed
        });
        setFormData({ subject: '', title: '', content: '', coverImage: '' });
        fetchCampaigns();
      } else {
        setStatus({ type: 'error', message: 'Failed to send newsletter.', failedRecipients: [] });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'An error occurred while sending.', failedRecipients: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Article Email Broadcast & Logs</h1>
        <p className="text-gray-500 dark:text-gray-400">Send an article email broadcast or view delivery failure logs for article emails.</p>
      </div>

      {status.message && (
        <div className={`mb-8 p-6 rounded-2xl flex flex-col gap-3 border ${
          status.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' 
            : status.type === 'warning'
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
            : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
        }`}>
          <div className="flex items-center gap-3">
            {status.type === 'success' ? <CheckCircle className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
            <p className="font-bold text-lg">{status.message}</p>
          </div>

          {status.failedRecipients && status.failedRecipients.length > 0 && (
            <div className="mt-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="font-bold text-sm text-red-700 dark:text-red-400 mb-2">⚠️ Delivery Issues ({status.failedRecipients.length} failed):</p>
              <ul className="space-y-1 text-xs font-mono text-red-600 dark:text-red-300">
                {status.failedRecipients.map((item, idx) => (
                  <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-red-500/10 pb-1">
                    <span className="font-bold">{item.email}</span>
                    <span className="opacity-80">Reason: {item.reason}</span>
                  </li>
                ))}
              </ul>
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
              {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Broadcast Article Email</>}
            </button>
          </div>
        </form>
      </div>

      {/* Campaign History */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Article Email Broadcast History</h2>
        
        {loadingCampaigns ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="glass rounded-3xl p-8 text-center text-gray-500 dark:text-gray-400">
            No campaigns sent yet.
          </div>
        ) : (
          <div className="glass rounded-3xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-200/50 dark:border-gray-700/50">
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Subject</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Date Sent</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Sent / Failed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50 bg-white/30 dark:bg-gray-900/30">
                  {campaigns.map(camp => (
                    <React.Fragment key={camp._id}>
                      <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 dark:text-white truncate max-w-xs">{camp.subject}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(camp.sentAt || camp.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            camp.status === 'SENT' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' :
                            camp.status === 'PARTIALLY_FAILED' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400' :
                            'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                          }`}>
                            {camp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                          <span className="text-green-600 dark:text-green-400 font-bold">{camp.successfulSends || (camp.metrics && camp.metrics.sent) || 0} sent</span>
                          {camp.failedSends > 0 && (
                            <span className="text-red-500 ml-2 font-bold">({camp.failedSends} failed)</span>
                          )}
                        </td>
                      </tr>
                      {camp.failedRecipients && camp.failedRecipients.length > 0 && (
                        <tr className="bg-red-500/5 dark:bg-red-900/10">
                          <td colSpan="4" className="px-6 py-3">
                            <div className="text-xs text-red-600 dark:text-red-400 font-mono">
                              <strong>Delivery Issues:</strong>
                              <div className="mt-1 space-y-1">
                                {camp.failedRecipients.map((f, i) => (
                                  <div key={i}>❌ {f.email} — Reason: {f.reason}</div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
