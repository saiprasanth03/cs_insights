import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAdminAuthor, createAdminAuthor, updateAdminAuthor } from '../../../api/admin';
import ImageUploader from '../../../components/ui/ImageUploader';

export default function AdminAuthorForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchAuthor();
    }
  }, [id]);

  const fetchAuthor = async () => {
    try {
      const response = await getAdminAuthor(id);
      if (response.success) {
        setFormData({
          name: response.data.name || '',
          title: response.data.title || '',
          bio: response.data.bio || '',
          avatar: response.data.avatar || '',
        });
      } else {
        toast.error('Failed to load author.');
      }
    } catch (err) {
      toast.error('An error occurred while fetching the author.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = isEditing 
        ? await updateAdminAuthor(id, formData)
        : await createAdminAuthor(formData);
        
      if (response.success) {
        toast.success(isEditing ? 'Author updated successfully!' : 'Author created successfully!');
        navigate('/admin/authors');
      } else {
        toast.error(response.error || 'Failed to save author.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-medium">Loading author...</div>;
  }

  return (
    <div className="p-8 max-w-[90rem] mx-auto w-full">
      <div className="mb-8">
        <Link to="/admin/authors" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Authors
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {isEditing ? 'Edit Author' : 'Add New Author'}
        </h1>
      </div>

      <div className="glass rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. S Sai Prasanth"
              className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Founder & Lead Editor"
              className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea 
              rows="4"
              required
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Passionate about distributed systems..."
              className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
            />
          </div>

          <ImageUploader 
            label="Avatar Photo"
            value={formData.avatar}
            onChange={(url) => setFormData({...formData, avatar: url})}
          />

          <div className="flex justify-end mt-4">
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:-translate-y-0"
            >
              {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Author</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
