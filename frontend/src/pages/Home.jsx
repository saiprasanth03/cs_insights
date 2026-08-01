import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Layers, Code, BrainCircuit, Sparkles, Clock, Tag } from "lucide-react";
import { Helmet } from 'react-helmet-async';
import SearchBar from "@/components/ui/SearchBar";
import { getFeaturedArticles } from '../api/articles';
import api from '../api/axios';
import ParticleNetwork from "../components/ui/ParticleNetwork";

const iconMap = {
  'data-structures': Layers,
  'algorithms': BrainCircuit,
  'system-design': Code,
  'core-concepts': BookOpen,
  'dbms': Layers,
  'computer-networks': Code
};

export default function Home() {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getFeaturedArticles();
        if (response && response.data) {
          setFeaturedArticles(response.data);
        }
      } catch (err) {
        console.error("Failed to load featured articles", err);
      }
    };
    
    const fetchTopics = async () => {
      try {
        const response = await api.get('/categories');
        if (response.data.success) {
          let sortedTopics = response.data.data;
          sortedTopics.sort((a, b) => {
            if (a.slug === 'core-concepts') return 1;
            if (b.slug === 'core-concepts') return -1;
            return 0;
          });
          setTopics(sortedTopics);
        }
      } catch (err) {
        console.error("Failed to fetch topics", err);
      }
    };

    fetchArticles();
    fetchTopics();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value;
    if (query) {
      navigate(`/articles?q=${query}`);
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>CS Insights | Mastering Software Engineering & System Design</title>
        <meta name="description" content="Premium newsletter and blog focusing on software engineering, system design, and computer science concepts." />
      </Helmet>

      <section className="relative pt-24 pb-32 border-b border-gray-200/10 dark:border-gray-800/20 overflow-hidden">
        
        <div className="absolute inset-0 z-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
          <ParticleNetwork />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/50 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-cyan/50 rounded-full filter blur-[100px] animate-bounce" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-violet/40 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPPHBhdGggZD0iTTAgMGgxdjQwaC0xem0wIDM5aDQwdjFIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4nKV0gW21hc2staW1hZ2U6bGluZWFyLWdyYWRpZW50KHRvX2JvdHRvbSx0cmFuc3BhcmVudCxibGFjayx0cmFuc3BhcmVudCld" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-brand-600 dark:text-brand-400 text-sm font-medium mb-8 animate-float">
              <Sparkles className="w-4 h-4" />
              <span>Version 1.0 is now live</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
              Computer Science, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 via-accent-violet to-accent-cyan animate-pulse-slow">
                Explained Clearly.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl leading-relaxed">
              Master complex topics with high-quality articles, visual diagrams, and code examples. Built for developers who want to dive deeper.
            </p>
            
            <form onSubmit={handleSearch} className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-4 relative">
              <div className="absolute -inset-4 bg-brand-500/20 blur-xl rounded-full opacity-50" />
              <div className="flex-1 w-full relative">
                 <SearchBar name="search" placeholder="Search algorithms, data structures..." className="w-full" />
              </div>
              <Link 
                to="/articles" 
                className="relative group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-white bg-brand-600 font-medium overflow-hidden w-full sm:w-auto hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                  Browse <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </form>
            
          </div>
        </div>
      </section>

      {featuredArticles.length > 0 && (
        <section className="py-24 bg-gray-50 dark:bg-transparent z-10 relative">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-end justify-between mb-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Featured Articles
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                  Check out our latest and most popular deep dives.
                </p>
              </div>
              <Link to="/articles" className="hidden md:flex items-center text-brand-600 dark:text-brand-400 font-medium hover:underline">
                View all <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredArticles.map((article, i) => (
                <div key={article._id || i} className="group flex flex-col rounded-3xl glass overflow-hidden border border-gray-200/50 dark:border-gray-800/50 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                  <div className="p-8 flex flex-col flex-1 relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-brand-500 transition-colors leading-tight">
                      <Link to={`/articles/${article.slug}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-1">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 bg-white dark:bg-transparent z-10 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore by Topic
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Structured learning paths designed to take you from basics to advanced architecture.
            </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topics.map(topic => {
                const IconComponent = iconMap[topic.slug] || Layers;
                return (
                  <TopicCard 
                    key={topic._id}
                    title={topic.name} 
                    description={topic.description} 
                    icon={<IconComponent className={`w-8 h-8 ${topic.slug === 'algorithms' ? 'text-accent-violet' : topic.slug === 'system-design' ? 'text-accent-cyan' : 'text-brand-500'}`} />} 
                    to={`/topics/${topic.slug}`} 
                  />
                );
              })}
            </div>
          </div>
        </section>
    </div>
  );
}

function TopicCard({ title, description, icon, to }) {
  return (
    <Link 
      to={to} 
      className="group flex flex-col p-8 rounded-3xl glass hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] border border-gray-200/50 dark:border-gray-800/50 relative overflow-hidden"
    >
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed relative z-10">{description}</p>
    </Link>
  );
}
