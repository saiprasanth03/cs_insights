import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAdminCategory, createAdminCategory, updateAdminCategory } from '../../../api/admin';
import ImageUploader from '../../../components/ui/ImageUploader';

export default function AdminTopicForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchTopic();
    }
  }, [id]);

  const fetchTopic = async () => {
    try {
      const response = await getAdminCategory(id);
      if (response.success) {
        setFormData({
          name: response.data.name || '',
          slug: response.data.slug || '',
          description: response.data.description || '',
          image: response.data.image || '',
        });
      } else {
        toast.error('Failed to load topic.');
      }
    } catch (err) {
      toast.error('An error occurred while fetching the topic.');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData({
      ...formData,
      name: newName,
      slug: !isEditing ? generateSlug(newName) : formData.slug
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = isEditing 
        ? await updateAdminCategory(id, formData)
        : await createAdminCategory(formData);
        
      if (response.success) {
        toast.success(isEditing ? 'Topic updated successfully!' : 'Topic created successfully!');
        navigate('/admin/topics');
      } else {
        toast.error(response.error || 'Failed to save topic.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-medium">Loading topic...</div>;
  }

  return (
    <div className="p-8 max-w-[90rem] mx-auto w-full">
      <div className="mb-8">
        <Link to="/admin/topics" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Topics
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {isEditing ? 'Edit Topic' : 'Create New Topic'}
        </h1>
      </div>

      <div className="glass rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topic Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Data Structures"
              className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL Slug</label>
            <input 
              type="text" 
              required
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              placeholder="e.g. data-structures"
              className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">This will be used in the URL: /topics/<strong>{formData.slug || 'slug'}</strong></p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea 
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="A brief description of this topic..."
              className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
            />
          </div>

          <ImageUploader 
            label="Topic Image"
            value={formData.image}
            onChange={(url) => setFormData({...formData, image: url})}
          />

          <div className="flex justify-end mt-4">
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:-translate-y-0"
            >
              {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Topic</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
