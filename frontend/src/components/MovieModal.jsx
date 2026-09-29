import React, { useState } from 'react';
import { X, Play, Plus, Check, Star, Film, Volume2, VolumeX } from 'lucide-react';

export const MovieModal = ({ movie, onClose, watchlist = [], onToggleWatchlist }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!movie) return null;

  const inWatchlist = watchlist.includes(movie._id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl border border-white/10 text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/60 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Video Player or Poster Backdrop Header */}
        <div className="relative aspect-video w-full bg-black">
          {isPlaying ? (
            <video
              src={movie.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'}
              autoPlay
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={movie.backdropUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30" />
              
              {/* Play Overlay Button */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3 z-10">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="netflix-btn-red shadow-lg"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Play Stream</span>
                </button>

                <button
                  onClick={() => onToggleWatchlist(movie._id)}
                  className="netflix-btn-gray"
                >
                  {inWatchlist ? <Check className="w-5 h-5 text-emerald-400" /> : <Plus className="w-5 h-5" />}
                  <span>{inWatchlist ? 'In My List' : 'Add to My List'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Movie Info Details */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">{movie.title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-300 mt-1">
                <span className="text-emerald-400 font-bold">{movie.matchPercentage}% Match</span>
                <span className="border border-gray-600 px-1.5 py-0.5 text-xs rounded">{movie.rating}</span>
                <span>{movie.releaseYear}</span>
                <span>{movie.duration}</span>
              </div>
            </div>

            <div className="bg-[#E50914]/10 border border-[#E50914]/30 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#E50914]">
              {movie.category}
            </div>
          </div>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            {movie.overview}
          </p>

          {/* Genre Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2">Genres:</span>
            {movie.genres?.map((genre) => (
              <span
                key={genre}
                className="bg-white/10 text-gray-200 text-xs px-2.5 py-1 rounded-full border border-white/5"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
