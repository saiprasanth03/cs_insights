import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import { getAdminAuthors, deleteAdminAuthor } from '../../../api/admin';
import { toast } from 'react-hot-toast';

export default function AdminAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await getAdminAuthors();
      if (response.success) {
        setAuthors(response.data);
      }
    } catch (err) {
      toast.error('Failed to load authors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this author?')) return;
    try {
      const response = await deleteAdminAuthor(id);
      if (response.success) {
        toast.success('Author deleted successfully');
        setAuthors(authors.filter(a => a._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete author');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-medium">Loading authors...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Authors</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage the author profiles displayed on your website.</p>
        </div>
        <Link 
          to="/admin/authors/new" 
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-brand-500/25"
        >
          <UserPlus className="w-4 h-4" /> Add Author
        </Link>
      </div>

      <div className="glass rounded-3xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200/50 dark:border-gray-800/50">
                <th className="p-5 font-semibold text-gray-900 dark:text-gray-100 text-sm">Author</th>
                <th className="p-5 font-semibold text-gray-900 dark:text-gray-100 text-sm">Title</th>
                <th className="p-5 font-semibold text-gray-900 dark:text-gray-100 text-sm">Bio</th>
                <th className="p-5 font-semibold text-gray-900 dark:text-gray-100 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map(author => (
                <tr key={author._id} className="border-b border-gray-100/50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      {author.avatar ? (
                        <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold">
                          {author.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">{author.name}</span>
                    </div>
                  </td>
                  <td className="p-5 text-gray-600 dark:text-gray-300 text-sm">{author.title}</td>
                  <td className="p-5 text-gray-500 dark:text-gray-400 text-sm max-w-[300px] truncate">
                    {author.bio}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        to={`/admin/authors/${author._id}/edit`}
                        className="p-2 text-gray-400 hover:text-brand-600 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(author._id)}
                        className="p-2 text-gray-400 hover:text-red-500 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {authors.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-500">
                    No authors found. Create one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
