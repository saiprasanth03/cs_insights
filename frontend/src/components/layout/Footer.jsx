import React from 'react';
import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200/20 dark:border-gray-800/20 bg-white/50 dark:bg-black/20 backdrop-blur-md pt-16 pb-8 z-10 relative">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img 
                src="/cs_insights.png" 
                alt="CS Insights Logo" 
                className="h-14 rounded-xl w-auto drop-shadow-md dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
              />
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Master Computer Science, one concept at a time. High-quality educational content for developers of all levels.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/about" className="hover:text-brand-500 transition-colors">About Us</Link></li>
              <li><Link to="/authors" className="hover:text-brand-500 transition-colors">Our Authors</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/privacy" className="hover:text-brand-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-gray-200/20 dark:border-gray-800/20 text-center text-sm text-gray-500 dark:text-gray-500">
          &copy; {new Date().getFullYear()} S Sai Prasanth. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
