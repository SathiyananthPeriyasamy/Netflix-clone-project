import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, Star, Sparkles } from 'lucide-react';

export const MovieRow = ({ title, movies, onSelectMovie, watchlist = [], onToggleWatchlist }) => {
  const rowRef = useRef(null);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-6 md:px-12 my-8 group relative">
      {/* Category Title Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-3">
          <span>{title}</span>
          <span className="text-xs font-bold text-[#E50914] bg-[#E50914]/15 px-2.5 py-0.5 rounded-full border border-[#E50914]/30">
            {movies.length} titles
          </span>
        </h2>
      </div>

      {/* Row Container with Navigation Arrows */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute -left-4 top-0 bottom-0 z-30 w-12 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-[#E50914] rounded-r-xl text-white shadow-2xl backdrop-blur-sm"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Scrollable Cards Rail */}
        <div
          ref={rowRef}
          className="movie-row-container flex gap-4 overflow-x-auto py-4 scroll-smooth"
        >
          {movies.map((movie) => {
            const inWatchlist = watchlist.includes(movie._id);
            return (
              <div
                key={movie._id || movie.title}
                onClick={() => onSelectMovie(movie)}
                className="prime-card flex-none w-48 sm:w-56 md:w-64 bg-[#181818] border border-white/10 rounded-xl overflow-hidden shadow-xl group/card transition-all duration-300"
              >
                {/* Poster Cover */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-900">
                  <img
                    src={movie.backdropUrl || movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Dark Fade Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-center">
                      <span className="bg-[#E50914] text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                        {movie.rating}
                      </span>
                      <span className="text-emerald-400 font-extrabold text-xs">
                        {movie.matchPercentage}% Match
                      </span>
                    </div>

                    <div>
                      <h3 className="text-white font-bold text-sm md:text-base leading-snug line-clamp-1 drop-shadow">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-gray-300 line-clamp-2 mt-1">
                        {movie.overview}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Base Info Bar */}
                <div className="p-3 bg-[#181818] flex items-center justify-between border-t border-white/5 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{movie.title}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist && onToggleWatchlist(movie._id);
                    }}
                    className={`p-1.5 rounded-full transition-colors ${
                      inWatchlist
                        ? 'bg-[#E50914] text-white'
                        : 'bg-white/10 hover:bg-white/30 text-white'
                    }`}
                    title={inWatchlist ? 'Remove from My List' : 'Add to My List'}
                  >
                    {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute -right-4 top-0 bottom-0 z-30 w-12 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-[#E50914] rounded-l-xl text-white shadow-2xl backdrop-blur-sm"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
