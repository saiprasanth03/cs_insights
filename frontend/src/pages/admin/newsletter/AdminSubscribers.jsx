import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, Clock, AlertCircle, XCircle, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../api/axios';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await api.get('/admin/subscribers');
      if (response.data.success) {
        setSubscribers(response.data.data);
      } else {
        setError('Failed to load subscribers.');
      }
    } catch (err) {
      setError('An error occurred while fetching subscribers.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (email) => {
    if (!window.confirm(`Are you sure you want to forcibly unsubscribe ${email}?`)) return;
    
    try {
      const res = await api.post('/newsletter/unsubscribe', { email });
      if (res.data.success) {
        toast.success(`Unsubscribed ${email} successfully`);
        fetchSubscribers();
      } else {
        toast.error('Failed to unsubscribe');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Newsletter Subscribers</h1>
          <p className="text-gray-500 dark:text-gray-400">View all users who have subscribed to your email campaigns.</p>
        </div>
        <Link 
          to="/admin/newsletters" 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg shrink-0"
        >
          <Mail className="w-4 h-4" /> View Email Delivery Logs ↗
        </Link>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="glass rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Loading subscribers...</div>
        ) : subscribers.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-brand-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No subscribers yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">Your list is currently empty. Add a subscribe box to your frontend to start collecting emails!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-black/20">
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white">Subscribed On</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{sub.email}</td>
                    <td className="py-4 px-6">
                      {sub.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : sub.status === 'UNSUBSCRIBED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          <AlertCircle className="w-3.5 h-3.5" /> Unsubscribed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {sub.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleUnsubscribe(sub.email)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-100 hover:bg-red-200 dark:text-red-400 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                          title="Force Unsubscribe"
                        >
                          <XCircle className="w-4 h-4" /> Unsubscribe
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
