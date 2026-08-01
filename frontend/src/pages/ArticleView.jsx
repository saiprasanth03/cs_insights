import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Heart, Share2, MessageSquare, Send, Trash2, CornerDownRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import api from '../api/axios';
import ReactMarkdown from 'react-markdown';
import Skeleton from '@/components/ui/Skeleton';
import BookmarkButton from '@/components/ui/BookmarkButton';
import { Helmet } from 'react-helmet-async';

export default function ArticleView() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { user } = useContext(AuthContext) || {};
  const isAdmin = user?.roles?.includes('ADMIN') || user?.roles?.includes('SUPER_ADMIN');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${slug}`);
        if (response.data.success) {
          const articleData = response.data.data;
          setArticle(articleData);
          
          if (articleData.allowComments !== false) {
            fetchComments(articleData._id);
          }
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        setError('Failed to load article.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const fetchComments = async (articleId) => {
    try {
      const res = await api.get(`/articles/${articleId}/comments`);
      if (res.data.success) {
        setComments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  const handleLike = async () => {
    if (isLiking || article.allowLikes === false) return;
    setIsLiking(true);
    try {
      // For now, if unauthenticated it might fail or we could just use local state for demo.
      // But we mapped toggleLike, which requires auth.
      const res = await api.post(`/articles/${article._id}/like`);
      if (res.data.success) {
        setArticle({ ...article, likes: res.data.likes });
      }
    } catch (err) {
      toast.error('You must be logged in to like articles.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    if (article.allowShares === false) return;
    navigator.clipboard.writeText(window.location.href);
    toast.success('Article link copied to clipboard!');
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || article.allowComments === false) return;
    setIsSubmittingComment(true);
    try {
      const res = await api.post(`/articles/${article._id}/comments`, { content: newComment });
      if (res.data.success) {
        toast.success('Comment submitted and pending approval!');
        setNewComment('');
      }
    } catch (err) {
      toast.error('You must be logged in to comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleAdminDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await api.delete(`/admin/comments/${commentId}`);
      if (res.data.success) {
        toast.success("Comment deleted");
        setComments(comments.filter(c => c._id !== commentId));
      }
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  const handleAdminReply = async (commentId) => {
    if (!replyContent.trim()) return;
    try {
      const res = await api.post(`/admin/comments/${commentId}/reply`, { adminReply: replyContent });
      if (res.data.success) {
        toast.success("Reply posted");
        setComments(comments.map(c => c._id === commentId ? { ...c, adminReply: replyContent } : c));
        setReplyingTo(null);
        setReplyContent('');
      }
    } catch (err) {
      toast.error("Failed to post reply");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="flex items-center gap-6 mb-8">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-64 w-full rounded-3xl mb-12" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full mt-8" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Oops!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{error || 'Article not found.'}</p>
        <Link to="/articles" className="text-brand-600 hover:underline">
          &larr; Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Helmet>
        <title>{article.title} | CS Insights</title>
        <meta name="description" content={article.excerpt || "Read this article on CS Insights"} />
        {article.coverImage && <meta property="og:image" content={article.coverImage} />}
      </Helmet>

      <Link to="/articles" className="inline-flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 mb-8 group">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
      </Link>

      <article>
        <header className="mb-10 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                <Tag className="w-3.5 h-3.5" /> {article.category?.name || 'Programming'}
              </span>
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {article.excerpt}
          </p>
        </header>

        {article.coverImage && (
          <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-2xl relative">
            <img 
              src={article.coverImage} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl"></div>
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert prose-brand max-w-none prose-img:rounded-xl prose-img:shadow-lg prose-headings:font-bold prose-a:text-brand-600 mb-16">
          <ReactMarkdown>
            {article.content ? article.content.replace(/#1'([^']+)'#/g, '# $1').replace(/#2'([^']+)'#/g, '## $1') : ''}
          </ReactMarkdown>
        </div>

        {/* Action Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mb-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {article.allowLikes !== false && (
              <button 
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium"
              >
                <Heart className="w-5 h-5" /> 
                {article.likes || 0} Likes
              </button>
            )}
            
            {article.allowComments !== false && (
              <a href="#comments" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all font-medium">
                <MessageSquare className="w-5 h-5" />
                {comments.length} Comments
              </a>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <BookmarkButton articleId={article._id} className="!bg-gray-100 dark:!bg-gray-800" />
            {article.allowShares !== false && (
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all font-medium"
              >
                <Share2 className="w-5 h-5" /> Share
              </button>
            )}
          </div>
        </div>

        {/* Comments Section */}
        {article.allowComments !== false && (
          <div id="comments" className="bg-gray-50 dark:bg-black/30 rounded-3xl p-8 border border-gray-200 dark:border-gray-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Comments ({comments.length})</h3>
            
            <form onSubmit={submitComment} className="mb-10">
              <textarea 
                rows="3"
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Leave a comment..."
                className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none mb-3"
              />
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={isSubmittingComment}
                  className="flex items-center gap-2 px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
                >
                  <Send className="w-4 h-4" /> {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm relative group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900 dark:text-white">{comment.user?.name || 'Anonymous User'}</span>
                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                  
                  {comment.adminReply && (
                    <div className="mt-4 pl-4 border-l-2 border-brand-500 bg-brand-50 dark:bg-brand-900/10 p-4 rounded-r-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-brand-700 dark:text-brand-400 bg-brand-100 dark:bg-brand-900/30 px-2 py-0.5 rounded uppercase">Official Reply</span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap">{comment.adminReply}</p>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-4">
                      <button 
                        onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                        className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        <CornerDownRight className="w-3 h-3" /> {replyingTo === comment._id ? 'Cancel Reply' : 'Reply'}
                      </button>
                      <button 
                        onClick={() => handleAdminDelete(comment._id)}
                        className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  )}

                  {isAdmin && replyingTo === comment._id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <textarea 
                        rows="2"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Type your official reply..."
                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all resize-none mb-2"
                      />
                      <button 
                        onClick={() => handleAdminReply(comment._id)}
                        className="text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-lg"
                      >
                        Post Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No comments yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </div>
        )}

      </article>
    </div>
  );
}
