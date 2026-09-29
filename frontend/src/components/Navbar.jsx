import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, Bell, User, LogOut, CheckCircle2 } from 'lucide-react';

export const Navbar = ({ onSearch, activeCategory, setActiveCategory }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 md:px-12 py-3 flex items-center justify-between ${
        isScrolled
          ? 'bg-[#141414]/95 backdrop-blur-md shadow-2xl border-b border-white/5'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      {/* Left section: Netflix Brand & Navigation Links */}
      <div className="flex items-center gap-8">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setActiveCategory('All')}
        >
          <span className="text-[#E50914] font-extrabold text-2xl md:text-3xl tracking-tighter drop-shadow-md group-hover:scale-105 transition-transform">
            NETFLIX
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          {['Home', 'Trending Now', 'Sci-Fi & Fantasy', 'Blockbuster Movies', 'My List'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === 'Home' ? 'All' : cat)}
              className={`hover:text-white transition-colors duration-200 ${
                activeCategory === cat || (cat === 'Home' && activeCategory === 'All')
                  ? 'text-white font-bold border-b-2 border-[#E50914] pb-1'
                  : ''
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Right section: Profile Dropdown */}
      <div className="flex items-center gap-4">
        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center font-bold text-white text-sm shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 netflix-glass rounded-lg shadow-2xl p-3 border border-white/15 text-sm animate-fade-in z-50">
              <div className="pb-3 mb-2 border-b border-white/10">
                <p className="font-semibold text-white">{user?.name || 'Netflix User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
              </div>

              <div className="flex flex-col gap-1 text-gray-300">
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-emerald-400 bg-emerald-500/10 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Account Authenticated</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-2 py-2 text-red-400 hover:bg-red-500/10 rounded transition-colors text-left font-medium mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of Netflix
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
