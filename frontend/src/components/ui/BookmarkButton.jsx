import React, { useState, useEffect, useContext } from 'react';
import { Bookmark } from 'lucide-react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function BookmarkButton({ articleId, className = "" }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated && articleId) {
      const checkBookmark = async () => {
        try {
          const res = await api.get('/me/bookmarks');
          if (res.data.success) {
            const isBookmarked = res.data.data.some(b => b.article && b.article._id === articleId);
            setBookmarked(isBookmarked);
          }
        } catch (e) {
          // Ignore
        }
      };
      checkBookmark();
    }
  }, [isAuthenticated, articleId]);

  const toggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please log in to bookmark articles.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post(`/me/bookmarks/${articleId}`);
      if (res.data.success) {
        setBookmarked(res.data.bookmarked);
        toast.success(res.data.message);
      }
    } catch (e) {
      toast.error("Failed to update bookmark.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleBookmark}
      disabled={loading}
      className={`relative z-40 p-2 rounded-full glass bg-white/20 hover:bg-white/40 transition-colors ${className}`}
      aria-label="Bookmark"
    >
      <Bookmark className={`w-5 h-5 transition-colors ${bookmarked ? 'fill-brand-500 text-brand-500' : 'text-gray-700 dark:text-gray-300'}`} />
    </button>
  );
}
