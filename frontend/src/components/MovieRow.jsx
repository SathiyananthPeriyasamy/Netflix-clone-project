import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, ThumbsUp, ChevronDown } from 'lucide-react';

export const MovieRow = ({
  title,
  movies,
  onSelectMovie,
  watchlist = [],
  onToggleWatchlist,
  isContinueWatching = false,
  showCollectionBanner = false,
}) => {
  const rowRef = useRef(null);
  const [hoveredMovieId, setHoveredMovieId] = useState(null);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount =
        direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="my-8 group relative px-4 md:px-12">
      {/* Category Title Header (Matches Screenshot 2 & 3) */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-3">
          <span>{title}</span>
        </h2>
      </div>

      {/* Row Container with Navigation Arrows */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute -left-4 top-0 bottom-0 z-40 w-10 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-[#E50914] rounded-r-lg text-white shadow-2xl backdrop-blur-sm"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* Scrollable Cards Rail */}
        <div
          ref={rowRef}
          className="movie-row-container flex gap-3.5 overflow-x-auto py-3 scroll-smooth no-scrollbar"
        >
          {movies.map((movie, index) => {
            const inWatchlist = watchlist.includes(movie._id);
            const isHovered = hoveredMovieId === movie._id;

            return (
              <div
                key={movie._id || movie.title}
                onMouseEnter={() => setHoveredMovieId(movie._id)}
                onMouseLeave={() => setHoveredMovieId(null)}
                onClick={() => onSelectMovie(movie)}
                className="relative flex-none w-44 sm:w-56 md:w-64 bg-[#181818] rounded-md overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:z-40 hover:scale-105"
              >
                {/* Poster / Backdrop Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-900">
                  <img
                    src={movie.backdropUrl || movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* TOP 10 Red Badge (Top Right) */}
                  {movie.isTop10 && (
                    <div className="absolute top-0 right-0 bg-[#E50914] text-white font-black text-[9px] px-1.5 py-0.5 rounded-bl shadow uppercase tracking-tighter">
                      TOP 10
                    </div>
                  )}

                  {/* Recently Added Red Badge (Bottom Left) */}
                  {movie.isRecentlyAdded && (
                    <div className="absolute bottom-2 left-2 bg-[#E50914] text-white font-bold text-[9px] px-2 py-0.5 rounded shadow uppercase">
                      Recently added
                    </div>
                  )}

                  {/* Continue Watching Red Progress Bar (Matches Screenshot 2) */}
                  {isContinueWatching && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div
                        className="h-full bg-[#E50914]"
                        style={{ width: `${movie.progress || (index % 2 === 0 ? 65 : 40)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Card Title Footer */}
                <div className="p-2.5 bg-[#181818] flex items-center justify-between">
                  <span className="font-semibold text-xs text-white truncate max-w-[80%]">
                    {movie.title}
                  </span>
                </div>

                {/* Interactive Card Hover Modal Popup (Matches Screenshot 4) */}
                {isHovered && (
                  <div className="absolute top-0 left-0 w-full bg-[#181818] rounded-md shadow-2xl border border-white/20 z-50 animate-fade-in p-3 flex flex-col gap-2 pointer-events-auto">
                    {/* Image Preview */}
                    <div className="relative aspect-[16/9] w-full rounded overflow-hidden">
                      <img
                        src={movie.backdropUrl || movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Action Circle Buttons */}
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        {/* Play Circle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMovie(movie);
                          }}
                          className="w-8 h-8 rounded-full bg-white hover:bg-white/80 text-black flex items-center justify-center transition-transform hover:scale-110"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>

                        {/* Add to Watchlist Circle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist && onToggleWatchlist(movie._id);
                          }}
                          className="w-8 h-8 rounded-full bg-black/60 border border-white/40 hover:border-white text-white flex items-center justify-center transition-all"
                        >
                          {inWatchlist ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                        </button>

                        {/* Like Circle */}
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-full bg-black/60 border border-white/40 hover:border-white text-white flex items-center justify-center transition-all"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Expand Info Circle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMovie(movie);
                        }}
                        className="w-8 h-8 rounded-full bg-black/60 border border-white/40 hover:border-white text-white flex items-center justify-center transition-all ml-auto"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Metadata Specs Line */}
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-300 mt-1">
                      <span className="text-emerald-400 font-bold">{movie.matchPercentage || 98}% Match</span>
                      <span className="border border-gray-500 px-1 py-0.2 rounded text-white text-[9px]">
                        {movie.rating || 'U/A 13+'}
                      </span>
                      <span>{movie.duration || '7 Episodes'}</span>
                      <span className="border border-white/40 px-1 py-0.2 rounded text-[9px]">HD</span>
                    </div>

                    {/* Genre Tags */}
                    <div className="text-[10px] text-gray-400 flex items-center gap-1.5 truncate">
                      {movie.genres ? movie.genres.join(' • ') : 'Drama • Romance • Comedy'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute -right-4 top-0 bottom-0 z-40 w-10 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-[#E50914] rounded-l-lg text-white shadow-2xl backdrop-blur-sm"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* WATCH YOUR FAVORITE BOOKS - FEATURED COLLECTION BANNER (Matches Screenshot 2) */}
      {showCollectionBanner && (
        <div className="my-10 relative rounded-xl overflow-hidden bg-gradient-to-r from-amber-950/80 via-neutral-900 to-stone-900 border border-amber-500/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-xl text-left">
            <span className="text-xs font-black tracking-widest text-amber-400 uppercase mb-1 block">
              FEATURED COLLECTION
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase mb-2 font-serif">
              WATCH YOUR FAVORITE BOOKS
            </h3>
            <p className="text-xs md:text-sm text-gray-300">
              For the book-obsessed, explore adaptations that fit your personality and mood.
            </p>
          </div>

          <button className="bg-white hover:bg-gray-200 text-black font-bold px-6 py-2.5 rounded-md text-sm transition-all shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap">
            Explore All
          </button>
        </div>
      )}
    </div>
  );
};
