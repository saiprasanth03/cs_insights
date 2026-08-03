import React, { useState, useEffect } from 'react';
import { Mail, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '../../../api/axios';

export default function AdminNewsletters() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/newsletters');
      if (response.data.success) {
        setCampaigns(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch article email logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Article Email Delivery Logs</h1>
          <p className="text-gray-500 dark:text-gray-400">View real-time delivery status and failed recipient logs for published articles.</p>
        </div>
        <button 
          onClick={fetchCampaigns}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-xl transition-all shadow-sm shrink-0 text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Logs
        </button>
      </div>

      <div className="glass rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl overflow-hidden p-6">
        {loading ? (
          <div className="flex justify-center p-12 text-gray-500 font-medium">Loading delivery logs...</div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Mail className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No article email dispatches yet</h3>
            <p className="text-sm">When you publish an article with "Email subscribers on publish" checked, delivery logs and failure details will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-200/50 dark:border-gray-700/50">
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Article Title</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Date Published</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Delivery Status</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Sent / Failed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50 bg-white/30 dark:bg-gray-900/30">
                {campaigns.map(camp => (
                  <React.Fragment key={camp._id}>
                    <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 dark:text-white truncate max-w-md">{camp.title || camp.subject}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(camp.sentAt || camp.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          camp.status === 'SENT' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' :
                          camp.status === 'PARTIALLY_FAILED' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400' :
                          'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                        }`}>
                          {camp.status === 'SENT' && <CheckCircle2 className="w-3.5 h-3.5" />}
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
                            <strong>⚠️ Delivery Failures for this Article:</strong>
                            <div className="mt-1 space-y-1">
                              {camp.failedRecipients.map((f, i) => (
                                <div key={i}>❌ <span className="font-bold">{f.email}</span> — Reason: {f.reason}</div>
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
        )}
      </div>
    </div>
  );
}
