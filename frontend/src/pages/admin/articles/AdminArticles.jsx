import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, AlertCircle, FileText, CheckCircle, Clock } from 'lucide-react';
import { getAdminArticles, deleteAdminArticle } from '../../../api/admin';
import { toast } from 'react-hot-toast';

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await getAdminArticles();
      if (response.success) {
        setArticles(response.data);
      } else {
        setError('Failed to load articles.');
      }
    } catch (err) {
      setError('An error occurred while fetching articles.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const response = await deleteAdminArticle(id);
      if (response.success) {
        toast.success('Article deleted successfully!');
        setArticles(prev => prev.filter(a => a._id !== id));
      } else {
        toast.error(response.message || 'Failed to delete article.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred while deleting.');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Manage Articles</h1>
          <p className="text-gray-500 dark:text-gray-400">Write, edit, and publish your content.</p>
        </div>
        <Link 
          to="/admin/articles/new" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> New Article
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
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-medium">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-brand-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No articles found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">You haven't written any articles yet. Start sharing your knowledge!</p>
            <Link to="/admin/articles/new" className="text-brand-600 font-medium hover:underline">Write your first article</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-black/20">
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white">Title</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white">Topic</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
                {articles.map((article) => (
                  <tr key={article._id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 dark:text-white">{article.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">{article.excerpt || 'No excerpt'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {article.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {article.status === 'PUBLISHED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          <Clock className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3">
                        <Link to={`/admin/articles/edit/${article._id}`} className="p-2 text-gray-400 hover:text-brand-600 transition-colors bg-white dark:bg-black/40 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(article._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-black/40 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
