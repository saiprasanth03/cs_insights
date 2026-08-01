import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';

export default function OurAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await api.get('/authors');
        if (res.data.success) {
          setAuthors(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch authors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Helmet>
        <title>Our Authors | CS Insights</title>
      </Helmet>
      
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Meet Our Authors</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">The brilliant minds behind CS Insights.</p>
      </div>
      
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading authors...</div>
      ) : (
        <div className={`grid grid-cols-1 ${authors.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-1 max-w-lg mx-auto'} gap-8`}>
          {authors.map((author) => (
            <div key={author._id} className="glass p-8 rounded-3xl border border-gray-200 dark:border-gray-800 text-center flex flex-col items-center">
              {author.avatar ? (
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 overflow-hidden border-4 border-brand-500/20 shadow-lg hover:scale-105 transition-transform">
                  <img 
                    src={author.avatar} 
                    alt={author.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-brand-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg hover:scale-105 transition-transform">
                  {author.name.charAt(0)}
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{author.name}</h3>
              <p className="text-brand-600 dark:text-brand-400 font-medium text-sm mb-4">{author.title}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {author.bio}
              </p>
            </div>
          ))}

          {authors.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              Our authors are currently writing amazing content. Check back soon!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
