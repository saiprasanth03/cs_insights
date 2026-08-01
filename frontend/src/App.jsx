import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Articles from "@/pages/Articles";
import ArticleView from "@/pages/ArticleView";
import Dashboard from "@/pages/admin/Dashboard";
import Topics from "@/pages/Topics";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import ReadingList from "@/pages/ReadingList";
import Settings from "@/pages/admin/Settings";
import AdminTopics from "@/pages/admin/topics/AdminTopics";
import AdminTopicForm from "@/pages/admin/topics/AdminTopicForm";
import AdminArticles from "@/pages/admin/articles/AdminArticles";
import AdminArticleForm from "@/pages/admin/articles/AdminArticleForm";
import AdminSubscribers from "@/pages/admin/newsletter/AdminSubscribers";
import AdminAuthors from "@/pages/admin/authors/AdminAuthors";
import AdminAuthorForm from "@/pages/admin/authors/AdminAuthorForm";
import FloatingSubscribe from "@/components/layout/FloatingSubscribe";
import Unsubscribe from "@/pages/Unsubscribe";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import AboutUs from "@/pages/AboutUs";
import OurAuthors from "@/pages/OurAuthors";
import NewsletterPage from "@/pages/NewsletterPage";
import RssFeed from "@/pages/RssFeed";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import AdminRoute from './components/auth/AdminRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="relative flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-500 blur-3xl opacity-20 animate-pulse rounded-full"></div>
            <img src="/cs_insights.png" alt="CS Insights" className="w-24 h-24 animate-pulse relative z-10 drop-shadow-xl" />
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-accent-violet animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white">
      <ScrollToTop />
      <Header />
      <main className="flex-1 flex flex-col relative z-0 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleView />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/settings" element={<Settings />} />
          
          <Route path="/admin/topics" element={<AdminTopics />} />
          <Route path="/admin/topics/new" element={<AdminTopicForm />} />
          <Route path="/admin/topics/edit/:id" element={<AdminTopicForm />} />
          
          <Route path="/admin/authors" element={<AdminAuthors />} />
          <Route path="/admin/authors/new" element={<AdminAuthorForm />} />
          <Route path="/admin/authors/:id/edit" element={<AdminAuthorForm />} />
          
          <Route path="/admin/articles" element={<AdminArticles />} />
          <Route path="/admin/articles/new" element={<AdminArticleForm />} />
          <Route path="/admin/articles/edit/:id" element={<AdminArticleForm />} />
          
          <Route path="/admin/subscribers" element={<AdminSubscribers />} />

          <Route path="/topics" element={<Topics />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/reading-list" element={<ReadingList />} />

          {/* Static Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/authors" element={<OurAuthors />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/rss" element={<RssFeed />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </main>
      <Footer />
      <FloatingSubscribe />
      <ScrollToTopButton />
    </div>
  );
}
