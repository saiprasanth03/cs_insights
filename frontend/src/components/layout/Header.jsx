import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import { User, Search, Code2, Menu, X, Sun, Moon, Bookmark } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeProvider";
import SearchBar from "../ui/SearchBar";

export default function Header() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-gray-200/20 dark:border-gray-800/20 shadow-sm backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/cs_insights.png" 
              alt="CS Insights Logo" 
              className="h-14 rounded-xl w-auto group-hover:scale-105 transition-transform drop-shadow-md dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
            />
          </Link>
          
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link to="/articles" className="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Articles</Link>
            <Link to="/topics" className="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Topics</Link>
            {isAuthenticated && user?.roles?.includes('ADMIN') && (
              <Link to="/admin" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors font-bold">Admin Portal</Link>
            )}
          </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:block w-64">
              <SearchBar placeholder="Search articles..." className="!py-2" />
            </div>

            <button 
              onClick={toggleTheme} 
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2 hidden sm:block"></div>
            
            <div className="hidden sm:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/reading-list" className="p-2 text-gray-500 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" aria-label="Reading List">
                    <Bookmark className="w-5 h-5" />
                  </Link>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hi, {user?.name || 'User'}</span>
                  <button onClick={logout} className="text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-full transition-all">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Log in</Link>
                  <Link to="/register" className="text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-full transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">Sign up</Link>
                </>
              )}
          </div>
          
          <button 
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
            {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-xl py-4 px-4 flex flex-col gap-4 z-50">
            <Link to="/articles" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Articles</Link>
          <Link to="/topics" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Topics</Link>
          {isAuthenticated && user?.roles?.includes('ADMIN') && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-brand-600 dark:text-brand-400 font-bold p-2 hover:bg-brand-50 dark:hover:bg-gray-800 rounded-lg">Admin Portal</Link>
          )}
          
          <div className="h-px bg-gray-200 dark:bg-gray-800 my-2"></div>
                    {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <Link to="/reading-list" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2">
                  <Bookmark className="w-5 h-5" /> Reading List
                </Link>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">Hi, {user?.name || 'User'}</span>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-center font-medium bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center font-medium border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">Log in</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center font-medium bg-brand-600 text-white px-4 py-3 rounded-xl">Sign up</Link>
            </div>
          )}
        </div>
      )}
      </header>
  );
}
