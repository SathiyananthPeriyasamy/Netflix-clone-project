import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, Plus, Trash2, Check, Smile, Edit2 } from 'lucide-react';

export const ProfileManagerModal = ({ isOpen, onClose }) => {
  const { profiles, activeProfile, addProfile, switchProfile, deleteProfile } = useContext(AuthContext);

  const [isAdding, setIsAdding] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isKids, setIsKids] = useState(false);
  const [selectedColor, setSelectedColor] = useState('bg-red-600');

  if (!isOpen) return null;

  const colorOptions = [
    { name: 'Red', class: 'bg-[#E50914]' },
    { name: 'Sky Blue', class: 'bg-sky-500' },
    { name: 'Amber Yellow', class: 'bg-amber-400' },
    { name: 'Emerald Green', class: 'bg-emerald-500' },
    { name: 'Purple', class: 'bg-purple-600' },
    { name: 'Kids Gradient', class: 'bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500' },
  ];

  const handleCreateProfile = (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    addProfile(newProfileName, isKids, selectedColor);
    setNewProfileName('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#141414] border border-white/15 rounded-xl p-6 md:p-8 text-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAdding ? (
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-center mb-2 tracking-tight">
              Who's watching?
            </h2>
            <p className="text-xs text-center text-gray-400 mb-8">
              Select or create a profile to customize recommendations.
            </p>

            {/* Profile Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {profiles.map((p) => {
                const isActive = activeProfile?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      switchProfile(p);
                      onClose();
                    }}
                    className={`group relative flex flex-col items-center cursor-pointer p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'border-[#E50914] bg-white/5 shadow-[0_0_15px_rgba(229,9,20,0.4)] scale-105'
                        : 'border-transparent hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {/* Avatar Box */}
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-lg ${p.avatarColor || 'bg-red-600'} flex items-center justify-center font-bold text-white text-xl shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform`}>
                      {p.avatarUrl ? (
                        <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : p.isKids ? (
                        <span className="text-xs font-black uppercase">kids</span>
                      ) : (
                        <Smile className="w-8 h-8 text-white" />
                      )}

                      {isActive && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Profile Name */}
                    <span className="mt-2 text-xs font-semibold text-gray-200 group-hover:text-white truncate max-w-full">
                      {p.name}
                    </span>

                    {/* Delete Icon (Allowed if profiles > 1) */}
                    {profiles.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProfile(p.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-opacity"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Add Profile Button */}
              {profiles.length < 6 && (
                <div
                  onClick={() => setIsAdding(true)}
                  className="flex flex-col items-center justify-center cursor-pointer p-3 rounded-xl border border-dashed border-white/30 hover:border-white hover:bg-white/5 transition-all text-gray-400 hover:text-white"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-white/5 flex items-center justify-center mb-2">
                    <Plus className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-semibold">Add Profile</span>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-white/40 text-gray-300 hover:text-white hover:border-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Create Profile Form */
          <form onSubmit={handleCreateProfile} className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-1">Add Profile</h2>
            <p className="text-xs text-gray-400 mb-6">
              Add a new profile for another person watching Netflix.
            </p>

            <div className="flex items-center gap-4 mb-6">
              {/* Avatar Preview */}
              <div className={`w-16 h-16 rounded-lg ${selectedColor} flex items-center justify-center font-bold text-white shadow-lg shrink-0`}>
                {isKids ? <span className="text-xs font-black">kids</span> : <Smile className="w-8 h-8" />}
              </div>

              {/* Name Input */}
              <input
                type="text"
                placeholder="Name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="w-full bg-[#2F2F2F] text-white text-sm px-4 py-3 rounded outline-none border border-transparent focus:border-white"
                autoFocus
                required
              />
            </div>

            {/* Avatar Color Picker */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-300 block mb-2">Choose Avatar Color:</label>
              <div className="flex items-center gap-3">
                {colorOptions.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.class)}
                    className={`w-8 h-8 rounded-full ${c.class} transition-transform ${
                      selectedColor === c.class ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Kids Option */}
            <div className="flex items-center gap-3 mb-8 bg-white/5 p-3 rounded border border-white/10">
              <input
                type="checkbox"
                id="kidsCheck"
                checked={isKids}
                onChange={(e) => setIsKids(e.target.checked)}
                className="w-4 h-4 accent-[#E50914] cursor-pointer"
              />
              <label htmlFor="kidsCheck" className="text-xs font-medium cursor-pointer">
                Kids Profile? (Show content for ages 12 & under only)
              </label>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="bg-white text-black font-bold px-6 py-2 rounded text-xs hover:bg-gray-200 transition-colors"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="border border-white/40 text-gray-300 hover:text-white px-6 py-2 rounded text-xs font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
