import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, ArrowRight, Tag } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function ReadingList() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await api.get('/me/bookmarks');
        if (response.data.success) {
          setBookmarks(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch bookmarks', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBookmarks();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const toggleBookmark = async (articleId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await api.post(`/me/bookmarks/${articleId}`);
      if (response.data.success && !response.data.bookmarked) {
        setBookmarks(prev => prev.filter(b => b.article._id !== articleId));
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-12 max-w-7xl">
      <Helmet>
        <title>My Reading List | CS Insights</title>
      </Helmet>

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <Bookmark className="w-10 h-10 text-brand-500" />
          My Reading List
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Your saved articles and tutorials for easy access later.
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="text-center py-20 bg-white/50 dark:bg-gray-900/50 rounded-3xl glass">
          <h2 className="text-2xl font-bold mb-4">Log in to save articles</h2>
          <Link to="/login" className="inline-flex px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors">
            Log in now
          </Link>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-gray-900/50 rounded-3xl glass border border-gray-200/50 dark:border-gray-800/50">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your reading list is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Explore our articles and bookmark the ones you want to read later.</p>
          <Link to="/articles" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors">
            Browse Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookmarks.map(({ article }) => {
            if (!article) return null;
            return (
              <div key={article._id} className="group flex flex-col relative rounded-3xl glass overflow-hidden border border-gray-200/50 dark:border-gray-800/50 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                <Link to={`/articles/${article.slug}`} className="absolute inset-0 z-30 focus:outline-none">
                  <span className="sr-only">Read {article.title}</span>
                </Link>
                
                <div className="aspect-[16/9] w-full relative overflow-hidden bg-gray-900">
                  {article.coverImage ? (
                    <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-accent-violet opacity-80 group-hover:scale-110 transition-transform duration-700" />
                  )}
                  
                  <div className="absolute top-4 right-4 z-40">
                    <button 
                      onClick={(e) => toggleBookmark(article._id, e)}
                      className="w-10 h-10 rounded-full glass bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                      title="Remove Bookmark"
                    >
                      <Bookmark className="w-5 h-5 fill-white" />
                    </button>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    {article.category?.name && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1.5 font-medium text-brand-600 dark:text-brand-400">
                          <Tag className="w-3.5 h-3.5" /> {article.category.name}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-brand-500 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-1">
                    {article.excerpt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
