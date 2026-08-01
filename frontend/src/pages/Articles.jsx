import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Clock, Tag, Sparkles, AlertCircle } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import { ArticleSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Helmet } from 'react-helmet-async';
import { getArticles } from '../api/articles';
import BookmarkButton from "../components/ui/BookmarkButton";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const search = queryParams.get('search');
        const response = await getArticles({ search: search || undefined });
        if (response && response.data) {
          setArticles(response.data);
        } else {
          setError('Failed to fetch articles format');
        }
      } catch (err) {
        setError('Could not load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [location.search]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <Helmet>
        <title>Articles | CS Insights</title>
        <meta name="description" content="Explore our latest articles on software engineering and system design." />
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative">
        <div className="absolute -inset-10 bg-brand-500/10 blur-3xl rounded-full opacity-50 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">All Articles</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
            Deep dive into technical concepts with clear explanations and comprehensive guides.
          </p>
        </div>
        <div className="relative w-full md:w-[400px] z-10">
          <SearchBar placeholder="Search articles..." />
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-6">
          <ArticleSkeleton />
          <ArticleSkeleton />
          <ArticleSkeleton />
        </div>
      ) : error ? (
        <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl flex flex-col items-center justify-center text-center gap-4 text-red-600 dark:text-red-400">
           <AlertCircle className="w-10 h-10" />
           <h3 className="text-xl font-bold">Oops!</h3>
           <p>{error}</p>
        </div>
      ) : articles.length === 0 ? (
        <EmptyState 
          title="No articles found"
          description="Check back later for more insights, or try searching for something else."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <div key={article._id || i} className="group flex flex-col relative rounded-3xl glass overflow-hidden border border-gray-200/50 dark:border-gray-800/50 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <Link to={`/articles/${article.slug}`} className="absolute inset-0 z-30 focus:outline-none">
                <span className="sr-only">Read {article.title}</span>
              </Link>
              
              <div className="aspect-[16/9] w-full relative overflow-hidden bg-gray-900">
                {article.coverImage ? (
                   <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${i % 2 === 0 ? "from-brand-600 to-accent-violet" : "from-accent-cyan to-brand-500"} opacity-80 group-hover:scale-110 transition-transform duration-700`} />
                  </>
                )}
                
                <div className="absolute top-4 right-4 z-40">
                  <BookmarkButton articleId={article._id} />
                </div>

                <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass bg-white/10 text-white text-xs font-medium backdrop-blur-md">
                    <Tag className="w-3 h-3" /> {article.category?.name || 'Programming'}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-brand-500 transition-colors leading-tight">
                    {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-brand-600 dark:text-brand-400 font-medium group-hover:translate-x-2 transition-transform">
                  Read Article <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
