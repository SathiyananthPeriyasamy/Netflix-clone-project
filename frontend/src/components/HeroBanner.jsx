import React, { useState } from 'react';
import { Play, Info, ThumbsUp, Lightbulb, Volume2, VolumeX } from 'lucide-react';

export const HeroBanner = ({ movie, onSelectMovie }) => {
  const [isMuted, setIsMuted] = useState(true);

  if (!movie) return null;

  // Use fallback values matching official Netflix Screenshot 1 if defaults are blank
  const title = movie.title || 'VOICEMAILS FOR Isabelle';
  const overview =
    movie.overview ||
    'A San Francisco dessert chef leaves voicemails for her late sister, unaware the number now belongs to a guy charmed by updates about her chaotic life.';
  const backdrop =
    movie.backdropUrl ||
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop';

  return (
    <div className="relative w-full h-[75vh] md:h-[85vh] text-white overflow-hidden">
      {/* Background Image with Official Netflix Dark Gradients */}
      <div className="absolute inset-0">
        <img
          src={backdrop}
          alt={title}
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 brightness-90"
        />
        {/* Left Edge Shadow Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/65 to-transparent w-full md:w-3/5 z-10" />
        {/* Bottom Fade Gradient seamlessly blending into rows */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-black/40 z-10" />
      </div>

      {/* Hero Content Overlay (Matches Screenshot 1) */}
      <div className="relative z-20 max-w-5xl pt-32 md:pt-44 px-6 md:px-12 flex flex-col justify-end h-full pb-16">
        {/* Big Title Typography */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-2xl mb-3 max-w-3xl leading-tight font-serif uppercase">
          {title}
        </h1>

        {/* Metadata Details Pill Line: Film • Comedy • 2026 • 1h 58m • A */}
        <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-200 mb-4 flex-wrap">
          <span className="font-bold text-white">Film</span>
          <span>•</span>
          <span className="text-gray-300">Comedy</span>
          <span>•</span>
          <span className="text-gray-300">{movie.releaseYear || 2026}</span>
          <span>•</span>
          <span className="text-gray-300">{movie.duration || '1h 58m'}</span>
          <span>•</span>
          <span className="border border-white/40 px-1.5 py-0.5 rounded text-[11px] font-bold text-white bg-black/40">
            {movie.rating || 'A'}
          </span>
        </div>

        {/* Overview Description Text */}
        <p className="text-sm md:text-base text-gray-200 line-clamp-3 max-w-2xl font-normal leading-relaxed mb-6 drop-shadow-md">
          {overview}
        </p>

        {/* Action Buttons & Feedback Badges (Matches Screenshot 1) */}
        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-3">
            {/* White Play Button */}
            <button
              onClick={() => onSelectMovie(movie)}
              className="bg-white hover:bg-white/80 text-black font-bold px-6 py-2.5 rounded-md flex items-center gap-2 text-base transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Play</span>
            </button>

            {/* Gray More Info Button */}
            <button
              onClick={() => onSelectMovie(movie)}
              className="bg-gray-500/50 hover:bg-gray-500/30 text-white font-semibold px-6 py-2.5 rounded-md flex items-center gap-2 text-base backdrop-blur-md transition-all hover:scale-105 border border-white/20"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>
          </div>

          {/* Right Bottom Feedback Badges & Mute Button */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Badge 1: We think you'll love this! */}
            <div className="hidden sm:flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/15 text-xs font-semibold px-3 py-1.5 rounded-md text-gray-200">
              <ThumbsUp className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span>We think you'll love this!</span>
            </div>

            {/* Badge 2: Wrong number. Right connection. */}
            <div className="hidden lg:flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/15 text-xs font-semibold px-3 py-1.5 rounded-md text-gray-200">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Wrong number. Right connection.</span>
            </div>

            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full border border-white/30 bg-black/50 hover:bg-white/20 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-gray-300" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
