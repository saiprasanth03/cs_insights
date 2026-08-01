import React, { useState, useEffect } from 'react';
import { Layers, Brain, Code2, BookOpen, Database, Network } from "lucide-react";
import { Link } from "react-router-dom";
import api from '../api/axios';

const iconMap = {
  'data-structures': Layers,
  'algorithms': Brain,
  'system-design': Code2,
  'core-concepts': BookOpen,
  'dbms': Database,
  'computer-networks': Network
};

export default function Topics() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
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
    fetchTopics();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-cyan/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">All Topics</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Explore our comprehensive library of computer science topics, broken down into digestible articles and interactive guides.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {topics.map((topic) => (
          <Link to={`/topics/${topic.slug}`} key={topic._id} className="group glass p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            {topic.image ? (
              <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <img src={topic.image} alt={topic.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black/50 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {(() => {
                  const IconComponent = iconMap[topic.slug] || Layers;
                  return <IconComponent className="w-8 h-8 text-brand-500" />;
                })()}
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{topic.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{topic.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
