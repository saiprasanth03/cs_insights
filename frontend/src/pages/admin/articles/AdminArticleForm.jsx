import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Heading1, Heading2, Bold, Image as ImageIcon, Palette } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAdminArticle, createAdminArticle, updateAdminArticle, getAdminCategories } from '../../../api/admin';
import ImageUploader from '../../../components/ui/ImageUploader';

export default function AdminArticleForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    status: 'DRAFT',
    sendNewsletter: true,
    allowLikes: true,
    allowComments: true,
    allowShares: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch categories for the dropdown with fallback
      let catData = [];
      try {
        const catRes = await getAdminCategories();
        if (catRes && catRes.success && Array.isArray(catRes.data) && catRes.data.length > 0) {
          catData = catRes.data;
        }
      } catch (e) {
        console.error('Admin categories fetch failed, trying public endpoint...', e);
      }

      if (catData.length === 0) {
        try {
          const publicRes = await api.get('/categories');
          if (publicRes.data && publicRes.data.success && Array.isArray(publicRes.data.data)) {
            catData = publicRes.data.data;
          }
        } catch (e) {
          console.error('Public categories fetch failed...', e);
        }
      }

      // Sort categories so valid topics (starting with letters) appear first
      catData.sort((a, b) => {
        const aClean = /^[a-zA-Z]/.test(a.name || '');
        const bClean = /^[a-zA-Z]/.test(b.name || '');
        if (aClean && !bClean) return -1;
        if (!aClean && bClean) return 1;
        return (a.name || '').localeCompare(b.name || '');
      });

      setCategories(catData);

      if (isEditing) {
        const artRes = await getAdminArticle(id);
        if (artRes.success) {
          const article = artRes.data;
          setFormData({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt || '',
            content: article.content || '',
            coverImage: article.coverImage || '',
            category: article.category?._id || article.category || (catData[0]?._id || ''),
            status: article.status || 'DRAFT',
            sendNewsletter: false,
            allowLikes: article.allowLikes ?? true,
            allowComments: article.allowComments ?? true,
            allowShares: article.allowShares ?? true
          });
        } else {
          toast.error('Failed to load article.');
        }
      } else {
        // For new articles, default to the first clean topic if available
        const defaultCat = catData.find(c => /^[a-zA-Z]/.test(c.name || '')) || catData[0];
        if (defaultCat) {
          setFormData(prev => ({
            ...prev,
            category: prev.category || defaultCat._id
          }));
        }
      }
    } catch (err) {
      toast.error('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData({
      ...formData,
      title: newTitle,
      slug: !isEditing ? generateSlug(newTitle) : formData.slug
    });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    await handleSubmit(e, 'PUBLISHED');
  };

  const handleSubmit = async (e, forceStatus = null) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!formData.title?.trim()) {
      toast.error('Please enter an article title.');
      return;
    }
    if (!formData.content?.trim()) {
      toast.error('Please enter article content.');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a topic.');
      return;
    }
    if (!formData.slug?.trim()) {
      toast.error('Please enter a URL slug.');
      return;
    }

    setSaving(true);

    try {
      const dataToSubmit = {
        ...formData,
        status: forceStatus || formData.status
      };

      const response = isEditing 
        ? await updateAdminArticle(id, dataToSubmit)
        : await createAdminArticle(dataToSubmit);
        
      if (response && response.success) {
        toast.success(isEditing ? 'Article updated successfully!' : 'Article saved successfully!');
        navigate('/admin/articles');
      } else {
        toast.error(response?.message || response?.error || 'Failed to save article.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-medium">Loading editor...</div>;
  }

  return (
    <div className="p-8 max-w-[90rem] mx-auto w-full">
      <div className="mb-8">
        <Link to="/admin/articles" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Articles
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {isEditing ? 'Edit Article' : 'Write New Article'}
        </h1>
      </div>

      <div className="glass rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Introduction to React"
                className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all font-bold text-lg"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content (Markdown)</label>
                
                {/* Markdown Toolbar */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button 
                    type="button" 
                    onClick={() => {
                      const text = formData.content;
                      setFormData({...formData, content: text + (text ? '\n\n' : '') + "#1'Heading 1'#\n"});
                    }}
                    className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors font-mono text-xs font-bold border border-transparent"
                    title="Add Heading 1"
                  >
                    # H1
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const text = formData.content;
                      setFormData({...formData, content: text + (text ? '\n\n' : '') + "#2'Heading 2'#\n"});
                    }}
                    className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors font-mono text-xs font-bold border border-transparent"
                    title="Add Heading 2"
                  >
                    ## H2
                  </button>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const text = formData.content;
                      setFormData({...formData, content: text + (text ? ' ' : '') + '**Bold Text** '});
                    }}
                    className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Add Bold Text"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const text = formData.content;
                      setFormData({...formData, content: text + (text ? ' ' : '') + '<span style="color: #6366f1;">Colored Text</span> '});
                    }}
                    className="p-1.5 text-brand-600 hover:text-brand-700 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors"
                    title="Add Color Text"
                  >
                    <Palette className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const text = formData.content;
                      setFormData({...formData, content: text + (text ? ' ' : '') + '`highlighted text` '});
                    }}
                    className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex items-center justify-center font-mono text-sm font-bold"
                    title="Add Highlight / Code"
                  >
                    {`</>`}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const text = formData.content;
                      setFormData({...formData, content: text + (text ? '\n\n' : '') + '![Image Description](https://image-url.com/image.jpg)\n'});
                    }}
                    className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Add Image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <textarea 
                required
                rows="25"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Write your article content here..."
                className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-y font-mono text-sm leading-relaxed min-h-[500px]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Excerpt</label>
              <textarea 
                rows="3"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                placeholder="A short summary of the article..."
                className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
              />
            </div>
            
            <ImageUploader 
              label="Cover Image"
              value={formData.coverImage}
              onChange={(url) => setFormData({...formData, coverImage: url})}
            />

          </div>

          {/* Sidebar Settings */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            <div className="bg-gray-50 dark:bg-black/30 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Publish Settings</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none mb-6"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>

                <div className="mb-6 flex items-center gap-3 p-3 bg-brand-50 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-800/30">
                  <input 
                    type="checkbox" 
                    id="sendNewsletter"
                    checked={formData.sendNewsletter}
                    onChange={(e) => setFormData({...formData, sendNewsletter: e.target.checked})}
                    className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
                  />
                  <label htmlFor="sendNewsletter" className="text-sm font-medium text-brand-900 dark:text-brand-300 cursor-pointer select-none">
                    Email to all subscribers
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topic</label>
                <select 
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 px-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all cursor-pointer font-medium"
                >
                  <option value="" disabled className="bg-white dark:bg-gray-900 text-gray-400">Select a topic...</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-1">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL Slug</label>
                <input 
                  type="text" 
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 px-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                />
              </div>

              <div className="mb-6 border-t border-gray-200/50 dark:border-gray-800/50 pt-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Engagement Settings</h3>
                
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.allowLikes}
                      onChange={(e) => setFormData({...formData, allowLikes: e.target.checked})}
                      className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 bg-white dark:bg-black/50 border-gray-300 dark:border-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow Likes</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.allowComments}
                      onChange={(e) => setFormData({...formData, allowComments: e.target.checked})}
                      className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 bg-white dark:bg-black/50 border-gray-300 dark:border-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow Comments</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.allowShares}
                      onChange={(e) => setFormData({...formData, allowShares: e.target.checked})}
                      className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 bg-white dark:bg-black/50 border-gray-300 dark:border-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow Shares</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  type="button"
                  onClick={(e) => handleSubmit(e, 'PUBLISHED')}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:-translate-y-0"
                >
                  {saving ? 'Publishing...' : <><Save className="w-4 h-4" /> Publish Article</>}
                </button>

                <button 
                  type="button" 
                  onClick={(e) => handleSubmit(e, 'DRAFT')}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all disabled:opacity-70"
                >
                  {saving ? 'Saving...' : 'Save as Draft'}
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
