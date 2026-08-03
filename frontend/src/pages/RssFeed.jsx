import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Rss, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function RssFeed() {
  const rssUrl = "https://cs-insights-frontend.vercel.app/feed.xml";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rssUrl);
    toast.success('RSS URL copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Helmet>
        <title>RSS Feed | CS Insights</title>
      </Helmet>
      
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500">
          <Rss className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Subscribe via RSS</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Add our RSS feed to your favorite reader and never miss a new article.
        </p>
      </div>
      
      <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-gray-800 max-w-2xl mx-auto flex items-center justify-between gap-4">
        <code className="text-gray-800 dark:text-gray-200 bg-black/5 dark:bg-white/5 px-4 py-3 rounded-lg flex-1 overflow-hidden text-ellipsis">
          {rssUrl}
        </code>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          <Copy className="w-4 h-4" /> Copy
        </button>
      </div>
    </div>
  );
}
