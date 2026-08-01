import React, { useEffect, useState, useContext } from 'react';
import { Users, FileText, MessageSquare, Mail, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { getDashboardStats } from '../../api/admin';
import { AuthContext } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalArticles: 0,
    activeUsers: 0,
    pendingComments: 0,
    newsletterSubs: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const result = await getDashboardStats();
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    if (isAuthenticated && user?.roles?.includes('ADMIN')) {
      fetchStats();
    }
  }, [isAuthenticated, user]);

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user?.roles?.includes('ADMIN')) {
    return <Navigate to="/login" replace state={{ from: '/admin' }} />;
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 relative">
        <div className="absolute -inset-10 bg-brand-500/10 blur-3xl rounded-full opacity-50 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.name}. Here's what's happening with CS Insights today.</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
        <StatCard title="Total Articles" value={stats.totalArticles} icon={<FileText className="w-6 h-6 text-brand-500" />} trend="Total published" />
        <StatCard title="Active Users" value={stats.activeUsers} icon={<Users className="w-6 h-6 text-accent-cyan" />} trend="Registered members" />
        <StatCard title="Pending Comments" value={stats.pendingComments} icon={<MessageSquare className="w-6 h-6 text-accent-violet" />} trend={stats.pendingComments > 0 ? "Needs attention" : "All caught up"} alert={stats.pendingComments > 0} />
        <StatCard title="Newsletter Subs" value={stats.newsletterSubs} icon={<Mail className="w-6 h-6 text-brand-400" />} trend="Total subscribers" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 glass rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Traffic Overview</h2>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4" /> Live
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-black/20">
            <span className="text-gray-500 font-medium flex items-center gap-2 animate-pulse-slow">
              <Sparkles className="w-5 h-5 text-brand-500" /> Chart Visualization Coming Soon
            </span>
          </div>
        </div>
        
        <div className="glass rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <Link to="/admin/subscribers" className="px-6 py-4 glass bg-gradient-to-r from-brand-600 to-accent-cyan hover:from-brand-500 hover:to-brand-400 text-white rounded-2xl text-left font-medium transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl">
              View Subscribers List
            </Link>
            <Link to="/admin/articles/new" className="px-6 py-4 glass bg-white dark:bg-black/40 hover:bg-gray-50 dark:hover:bg-black/60 text-gray-900 dark:text-white rounded-2xl text-left font-medium transition-all hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50">
              Write New Article
            </Link>
            <Link to="/admin/articles" className="px-6 py-4 glass bg-white dark:bg-black/40 hover:bg-gray-50 dark:hover:bg-black/60 text-gray-900 dark:text-white rounded-2xl text-left font-medium transition-all hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50">
              Manage Articles
            </Link>
            <Link to="/admin/topics" className="px-6 py-4 glass bg-white dark:bg-black/40 hover:bg-gray-50 dark:hover:bg-black/60 text-gray-900 dark:text-white rounded-2xl text-left font-medium transition-all hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50">
              Manage Topics (Categories)
            </Link>
            <button className="px-6 py-4 glass bg-white dark:bg-black/40 hover:bg-gray-50 dark:hover:bg-black/60 text-gray-900 dark:text-white rounded-2xl text-left font-medium transition-all hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50">
              Review Comments ({stats.pendingComments})
            </button>
            <Link to="/admin/authors" className="px-6 py-4 glass bg-white dark:bg-black/40 hover:bg-gray-50 dark:hover:bg-black/60 text-gray-900 dark:text-white rounded-2xl text-left font-medium transition-all hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50">
              Manage Authors
            </Link>
            <Link to="/admin/settings" className="px-6 py-4 glass bg-white dark:bg-black/40 hover:bg-gray-50 dark:hover:bg-black/60 text-gray-900 dark:text-white rounded-2xl text-left font-medium transition-all hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50">
              Manage Admins (Settings)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, alert = false }) {
  return (
    <div className="glass rounded-3xl p-6 border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
        <div className="p-3 bg-white dark:bg-black/40 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          {icon}
        </div>
      </div>
      <div className="mt-auto">
        <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">{value}</div>
        <p className={`text-sm ${alert ? "text-red-500 font-medium" : "text-gray-500 dark:text-gray-400"}`}>{trend}</p>
      </div>
    </div>
  );
}
