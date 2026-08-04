import React, { useEffect, useState } from 'react';
import { MessageSquare, CheckCircle, XCircle, Trash2, Reply, Search, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../api/axios';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/comments');
      if (res.data.success) {
        setComments(res.data.data);
      } else {
        setError('Failed to fetch comments.');
      }
    } catch (err) {
      setError('An error occurred while fetching comments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleModerate = async (id, status) => {
    try {
      const res = await api.put(`/admin/comments/${id}/moderate`, { status });
      if (res.data.success) {
        toast.success(`Comment status updated to ${status}`);
        setComments(comments.map(c => c._id === id ? { ...c, status } : c));
      } else {
        toast.error(res.data.message || 'Failed to update comment');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await api.delete(`/admin/comments/${id}`);
      if (res.data.success) {
        toast.success('Comment deleted');
        setComments(comments.filter(c => c._id !== id));
      } else {
        toast.error('Failed to delete comment');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const handleSendReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      const res = await api.post(`/admin/comments/${id}/reply`, { adminReply: replyText });
      if (res.data.success) {
        toast.success('Reply added successfully');
        setComments(comments.map(c => c._id === id ? { ...c, adminReply: replyText } : c));
        setReplyingId(null);
        setReplyText('');
      } else {
        toast.error('Failed to add reply');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const filteredComments = comments.filter(c => {
    const matchesStatus = filterStatus === 'ALL' || (c.status && c.status.toLowerCase() === filterStatus.toLowerCase());
    const matchesSearch = 
      (c.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.article?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Review & Moderate Comments</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage reader feedback, approve/reject comments, and respond as admin.</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass rounded-2xl p-4 mb-8 border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st 
                  ? 'bg-brand-600 text-white shadow-md' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {st} {st === 'PENDING' && comments.filter(c => c.status === 'PENDING' || c.status === 'pending').length > 0 && (
                <span className="ml-1 bg-amber-500 text-white px-1.5 py-0.5 rounded-full text-[10px]">
                  {comments.filter(c => c.status === 'PENDING' || c.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search comment, user or article..."
            className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Comments List */}
      <div className="glass rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Loading comments...</div>
        ) : filteredComments.length === 0 ? (
          <div className="p-16 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400 opacity-50" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No comments found</h3>
            <p className="text-sm">No reader comments matching the selected filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
            {filteredComments.map((comment) => (
              <div key={comment._id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-500 font-bold flex items-center justify-center text-sm">
                      {(comment.user?.name || 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm">
                        {comment.user?.name || 'Anonymous Reader'}
                        {comment.user?.email && <span className="text-xs font-normal text-gray-500 ml-2">({comment.user.email})</span>}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        On article: <span className="font-semibold text-brand-600 dark:text-brand-400">{comment.article?.title || 'Unknown Article'}</span> • {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      comment.status === 'APPROVED' || comment.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400'
                        : comment.status === 'REJECTED' || comment.status === 'rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400'
                    }`}>
                      {comment.status || 'APPROVED'}
                    </span>
                  </div>
                </div>

                <div className="text-gray-800 dark:text-gray-200 text-sm bg-gray-50 dark:bg-black/40 p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 font-sans leading-relaxed">
                  {comment.content}
                </div>

                {comment.adminReply && (
                  <div className="ml-6 p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-xs text-brand-700 dark:text-brand-300 flex flex-col gap-1">
                    <span className="font-bold flex items-center gap-1"><Reply className="w-3 h-3" /> Admin Reply:</span>
                    <p>{comment.adminReply}</p>
                  </div>
                )}

                {/* Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {comment.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleModerate(comment._id, 'APPROVED')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400 rounded-lg text-xs font-bold transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                    {comment.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleModerate(comment._id, 'REJECTED')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-bold transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                    <button
                      onClick={() => setReplyingId(replyingId === comment._id ? null : comment._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-lg text-xs font-bold transition-all"
                    >
                      <Reply className="w-3.5 h-3.5" /> Reply
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-all ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>

                {replyingId === comment._id && (
                  <div className="mt-3 flex flex-col gap-2 p-3 bg-gray-100 dark:bg-gray-800/80 rounded-xl">
                    <textarea
                      rows="2"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write admin reply to this comment..."
                      className="w-full bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setReplyingId(null)}
                        className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendReply(comment._id)}
                        className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded-md text-xs font-bold"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
