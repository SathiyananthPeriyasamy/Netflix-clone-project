import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, Bell, User, LogOut, Edit3, ArrowLeftRight, HelpCircle, ChevronDown, Smile } from 'lucide-react';

export const Navbar = ({ onSearch, activeCategory, setActiveCategory }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', value: 'All' },
    { label: 'Shows', value: 'TV Shows' },
    { label: 'Movies', value: 'Movies' },
    { label: 'Games', value: 'Games' },
    { label: 'New & Popular', value: 'New & Popular' },
    { label: 'My Netflix', value: 'My List' },
    { label: 'Browse by Languages', value: 'Languages' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-12 py-3 flex items-center justify-between ${
        isScrolled
          ? 'bg-[#141414] shadow-2xl border-b border-white/5'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'
      }`}
    >
      {/* Left section: Netflix Red Logo & Rounded Pill Navigation */}
      <div className="flex items-center gap-6">
        <div 
          className="flex items-center cursor-pointer group"
          onClick={() => setActiveCategory('All')}
        >
          {/* Official Style Netflix Red N / Brand */}
          <span className="text-[#E50914] font-black text-2xl md:text-3xl tracking-tighter drop-shadow-md group-hover:scale-105 transition-transform uppercase">
            NETFLIX
          </span>
        </div>

        {/* Navigation Bar Links */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium">
          {navLinks.map((link) => {
            const isActive = activeCategory === link.value || (link.value === 'All' && activeCategory === 'All');
            return (
              <button
                key={link.label}
                onClick={() => setActiveCategory(link.value)}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2b2b2b] text-white font-bold shadow'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right section: Search, Notifications, Kids Badge, Profile Dropdown */}
      <div className="flex items-center gap-4 text-gray-200">
        {/* Search Bar */}
        <div className="relative flex items-center">
          {showSearchInput ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-black/80 border border-white/40 rounded-md px-2 py-1 transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Titles, people, genres"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
                className="bg-transparent text-white text-xs outline-none w-36 md:w-48 placeholder-gray-500"
                autoFocus
              />
            </form>
          ) : (
            <button
              onClick={() => setShowSearchInput(true)}
              className="p-1.5 hover:text-white transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Notifications Bell */}
        <button className="relative p-1.5 hover:text-white transition-colors hidden sm:block" title="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#E50914] rounded-full ring-2 ring-[#141414]" />
        </button>

        {/* Kids Badge Button */}
        <button className="hidden sm:flex items-center gap-1 bg-[#2b2b2b] hover:bg-[#383838] px-2.5 py-1 rounded text-xs font-bold text-white transition-colors border border-white/10">
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text font-black text-[11px]">
            kids
          </span>
          <span className="text-[11px]">Children</span>
        </button>

        {/* Profile Avatar Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1.5 p-1 rounded hover:opacity-90 transition-opacity"
          >
            {/* Red Profile Avatar Box */}
            <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center font-bold text-white text-sm shadow-md overflow-hidden border border-white/20">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="fallback-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'S'}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-300 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Official Netflix Profile Dropdown Menu (Matches Screenshot 1) */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-[#141414]/95 backdrop-blur-xl rounded-md shadow-2xl p-2 border border-white/15 text-xs text-gray-200 animate-fade-in z-50">
              {/* Profile Switching List */}
              <div className="flex flex-col gap-1.5 pb-2 mb-2 border-b border-white/10">
                {/* Profile 1: Gokul */}
                <div className="flex items-center gap-3 p-1.5 hover:bg-white/10 rounded cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded bg-sky-500 flex items-center justify-center font-bold text-white shadow">
                    <Smile className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-white">Gokul</span>
                </div>

                {/* Profile 2: Yash */}
                <div className="flex items-center gap-3 p-1.5 hover:bg-white/10 rounded cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded bg-amber-400 flex items-center justify-center font-bold text-gray-900 shadow">
                    <Smile className="w-5 h-5 text-gray-900" />
                  </div>
                  <span className="font-semibold text-white">Yash</span>
                </div>

                {/* Profile 3: Kids */}
                <div className="flex items-center gap-3 p-1.5 hover:bg-white/10 rounded cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow text-[10px]">
                    kids
                  </div>
                  <span className="font-semibold text-white">Kids</span>
                </div>
              </div>

              {/* Action Menu Items */}
              <div className="flex flex-col gap-1">
                <button className="flex items-center gap-3 w-full px-2 py-2 hover:bg-white/10 rounded transition-colors text-left text-gray-300 hover:text-white">
                  <Edit3 className="w-4 h-4" />
                  <span>Manage Profiles</span>
                </button>

                <button className="flex items-center gap-3 w-full px-2 py-2 hover:bg-white/10 rounded transition-colors text-left text-gray-300 hover:text-white">
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Transfer Profile</span>
                </button>

                <button className="flex items-center gap-3 w-full px-2 py-2 hover:bg-white/10 rounded transition-colors text-left text-gray-300 hover:text-white">
                  <User className="w-4 h-4" />
                  <span>Account ({user?.email || user?.name || 'User'})</span>
                </button>

                <button className="flex items-center gap-3 w-full px-2 py-2 hover:bg-white/10 rounded transition-colors text-left text-gray-300 hover:text-white">
                  <HelpCircle className="w-4 h-4" />
                  <span>Help Centre</span>
                </button>

                <div className="pt-2 mt-1 border-t border-white/10">
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-2 py-2 text-gray-300 hover:text-white hover:bg-red-600/20 rounded transition-colors text-left font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign out of Netflix</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
