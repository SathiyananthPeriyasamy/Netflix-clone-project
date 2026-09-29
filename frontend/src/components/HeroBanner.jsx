import React, { useState } from 'react';
import { Play, Info, Volume2, VolumeX, Star, Sparkles } from 'lucide-react';

export const HeroBanner = ({ movie, onSelectMovie }) => {
  const [isMuted, setIsMuted] = useState(true);

  if (!movie) return null;

  return (
    <div className="relative w-full h-[70vh] md:h-[82vh] text-white">
      {/* Background Image with Dark Vignette Gradients */}
      <div className="absolute inset-0">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
        />
        {/* Left Shadow Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent w-full md:w-3/5" />
        {/* Bottom Fade Gradient into page */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl pt-36 md:pt-48 px-6 md:px-12 flex flex-col justify-end h-full pb-16">
        {/* Badge */}
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1 bg-[#E50914] text-white text-xs font-bold px-2.5 py-1 rounded shadow-lg uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            #1 IN MOVIES TODAY
          </span>
          <span className="text-emerald-400 font-bold text-sm">
            {movie.matchPercentage}% Match
          </span>
          <span className="border border-gray-500 text-gray-300 text-xs px-1.5 py-0.5 rounded">
            {movie.rating}
          </span>
          <span className="text-gray-300 text-xs">{movie.releaseYear}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-lg mb-4 max-w-2xl leading-tight">
          {movie.title}
        </h1>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-200 line-clamp-3 max-w-2xl font-normal leading-relaxed mb-6 drop-shadow">
          {movie.overview}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectMovie(movie)}
            className="prime-btn-red hover:shadow-[0_0_20px_rgba(229,9,20,0.6)]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Play Trailer</span>
          </button>

          <button
            onClick={() => onSelectMovie(movie)}
            className="prime-btn-gray"
          >
            <Info className="w-5 h-5" />
            <span>More Info</span>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="ml-auto p-2.5 rounded-full border border-white/30 bg-black/40 hover:bg-white/20 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};
