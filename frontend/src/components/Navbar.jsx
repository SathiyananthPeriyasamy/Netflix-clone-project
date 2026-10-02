import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ProfileManagerModal } from './ProfileManagerModal';
import { Search, Bell, LogOut, Edit3, ArrowLeftRight, User, HelpCircle, ChevronDown, Smile, Plus } from 'lucide-react';

export const Navbar = ({ onSearch, activeCategory, setActiveCategory }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const { user, logout, profiles, activeProfile, switchProfile } = useContext(AuthContext);

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
    { label: 'Shows', value: 'Shows' },
    { label: 'Movies', value: 'Movies' },
    { label: 'Games', value: 'Games' },
    { label: 'New & Popular', value: 'New & Popular' },
    { label: 'My Netflix', value: 'My Netflix' },
    { label: 'Browse by Languages', value: 'Languages' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-12 py-3 flex items-center justify-between ${
          isScrolled
            ? 'bg-[#141414] shadow-2xl border-b border-white/5'
            : 'bg-gradient-to-b from-black/95 via-black/60 to-transparent'
        }`}
      >
        {/* Left section: Netflix Red Logo & Navigation Bar */}
        <div className="flex items-center gap-6">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => setActiveCategory('All')}
          >
            <span className="text-[#E50914] font-black text-2xl md:text-3xl tracking-tighter drop-shadow-md group-hover:scale-105 transition-transform uppercase">
              NETFLIX
            </span>
          </div>

          {/* Navigation Bar Links */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium">
            {navLinks.map((link) => {
              const isActive = activeCategory === link.value;
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
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-black/90 border border-white/40 rounded-md px-2 py-1 transition-all">
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
          <button
            onClick={() => {
              const kidsP = profiles.find((p) => p.isKids);
              if (kidsP) switchProfile(kidsP);
            }}
            className="hidden sm:flex items-center gap-1 bg-[#2b2b2b] hover:bg-[#383838] px-2.5 py-1 rounded text-xs font-bold text-white transition-colors border border-white/10"
          >
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
              {/* Active Profile Avatar Box */}
              <div className={`w-8 h-8 rounded ${activeProfile?.avatarColor || 'bg-red-600'} flex items-center justify-center font-bold text-white text-sm shadow-md overflow-hidden border border-white/20`}>
                {activeProfile?.avatarUrl ? (
                  <img src={activeProfile.avatarUrl} alt={activeProfile.name} className="w-full h-full object-cover" />
                ) : activeProfile?.isKids ? (
                  <span className="text-[10px] font-black uppercase">kids</span>
                ) : (
                  <Smile className="w-5 h-5 text-white" />
                )}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-300 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dynamic Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#141414]/95 backdrop-blur-xl rounded-md shadow-2xl p-2 border border-white/15 text-xs text-gray-200 animate-fade-in z-50">
                {/* Dynamic Profiles List */}
                <div className="flex flex-col gap-1 pb-2 mb-2 border-b border-white/10">
                  {profiles.map((p) => {
                    const isCurrent = activeProfile?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          switchProfile(p);
                          setShowProfileMenu(false);
                        }}
                        className={`flex items-center justify-between p-1.5 hover:bg-white/10 rounded cursor-pointer transition-colors ${
                          isCurrent ? 'bg-white/10 font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded ${p.avatarColor || 'bg-red-600'} flex items-center justify-center font-bold text-white text-xs shadow overflow-hidden`}>
                            {p.avatarUrl ? (
                              <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                            ) : p.isKids ? (
                              <span className="text-[9px] font-black uppercase">kids</span>
                            ) : (
                              <Smile className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="text-white truncate max-w-[120px]">{p.name}</span>
                        </div>

                        {isCurrent && <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>}
                      </div>
                    );
                  })}

                  {/* Add New Profile Trigger */}
                  <div
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowProfileModal(true);
                    }}
                    className="flex items-center gap-3 p-1.5 hover:bg-white/10 rounded cursor-pointer transition-colors text-gray-400 hover:text-white mt-1 border-t border-white/5 pt-2"
                  >
                    <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold">Add Profile</span>
                  </div>
                </div>

                {/* Profile Settings & Account Actions */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowProfileModal(true);
                    }}
                    className="flex items-center gap-3 w-full px-2 py-2 hover:bg-white/10 rounded transition-colors text-left text-gray-300 hover:text-white"
                  >
                    <Edit3 className="w-4 h-4 text-gray-400" />
                    <span>Manage Profiles</span>
                  </button>

                  <button className="flex items-center gap-3 w-full px-2 py-2 hover:bg-white/10 rounded transition-colors text-left text-gray-300 hover:text-white">
                    <ArrowLeftRight className="w-4 h-4 text-gray-400" />
                    <span>Transfer Profile</span>
                  </button>

                  <button className="flex items-center gap-3 w-full px-2 py-2 hover:bg-white/10 rounded transition-colors text-left text-gray-300 hover:text-white">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="truncate">Account ({user?.email || user?.name || 'sathiya'})</span>
                  </button>

                  <button className="flex items-center gap-3 w-full px-2 py-2 hover:bg-white/10 rounded transition-colors text-left text-gray-300 hover:text-white">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
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

      {/* Interactive Profile Management Modal */}
      <ProfileManagerModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};
