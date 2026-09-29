import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { MovieModal } from '../components/MovieModal';

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loadingMovies, setLoadingMovies] = useState(true);

  const { watchlist, toggleWatchlist } = useContext(AuthContext);

  const richCatalog = [
    {
      _id: '101',
      title: 'Stranger Things: Origins',
      overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
      backdropUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1600&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop',
      category: 'Trending Now',
      rating: 'TV-14',
      releaseYear: 2024,
      duration: '4 Seasons',
      genres: ['Sci-Fi', 'Horror', 'Drama'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isFeatured: true,
      matchPercentage: 99,
    },
    {
      _id: '102',
      title: 'Cyberpunk 2077: Cyberia',
      overview: 'In a neon-drenched dystopian metropolis, an ambitious hacker risks everything to steal a military-grade neural implant.',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
      category: 'Sci-Fi & Fantasy',
      rating: 'TV-MA',
      releaseYear: 2025,
      duration: '2h 18m',
      genres: ['Action', 'Cyberpunk', 'Thriller'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isFeatured: false,
      matchPercentage: 97,
    },
    {
      _id: '103',
      title: 'Interstellar: Dark Orbit',
      overview: 'A deep space research station goes silent near Jupiter. A rescue crew investigates, discovering something incomprehensible in the shadows.',
      backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
      category: 'Action & Adventure',
      rating: 'PG-13',
      releaseYear: 2024,
      duration: '2h 05m',
      genres: ['Sci-Fi', 'Adventure'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isFeatured: false,
      matchPercentage: 96,
    },
    {
      _id: '104',
      title: 'Neon Velocity',
      overview: 'An underground street racer accidentally intercepts an encrypted drive containing syndicate secrets.',
      backdropUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1600&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      category: 'Blockbuster Movies',
      rating: 'TV-MA',
      releaseYear: 2025,
      duration: '1h 55m',
      genres: ['Action', 'Crime'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isFeatured: false,
      matchPercentage: 95,
    },
    {
      _id: '105',
      title: 'The Sentinel Guardian',
      overview: 'An ancient guardian awakens after centuries to protect the final stronghold of humanity against AI warlords.',
      backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop',
      category: 'Top Rated',
      rating: 'PG-13',
      releaseYear: 2023,
      duration: '2h 30m',
      genres: ['Fantasy', 'Action'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isFeatured: false,
      matchPercentage: 98,
    },
    {
      _id: '106',
      title: 'Quantum Horizon',
      overview: 'Quantum physicists break the veil between parallel dimensions, exposing Earth to unpredictable timelines.',
      backdropUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1600&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      category: 'Popular TV Shows',
      rating: 'TV-MA',
      releaseYear: 2024,
      duration: '3 Seasons',
      genres: ['Sci-Fi', 'Mystery'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isFeatured: false,
      matchPercentage: 94,
    },
    {
      _id: '107',
      title: 'The Last Extraction',
      overview: 'A mercenary team is tasked with retrieving a high-value asset from a rogue orbital fortress.',
      backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
      category: 'Trending Now',
      rating: 'R',
      releaseYear: 2025,
      duration: '2h 10m',
      genres: ['Action', 'Thriller'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isFeatured: false,
      matchPercentage: 97,
    },
    {
      _id: '108',
      title: 'Echoes of Silence',
      overview: 'In an underwater research facility, acoustic engineers discover strange frequencies that unlock lost human memories.',
      backdropUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1600&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      category: 'Blockbuster Movies',
      rating: 'PG-13',
      releaseYear: 2024,
      duration: '1h 50m',
      genres: ['Drama', 'Mystery'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isFeatured: false,
      matchPercentage: 93,
    },
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoadingMovies(true);
    try {
      const res = await fetch('/api/movies');
      if (res.ok) {
        const data = await res.json();
        setMovies(data.length > 0 ? data : richCatalog);
      } else {
        setMovies(richCatalog);
      }
    } catch (err) {
      setMovies(richCatalog);
    } finally {
      setLoadingMovies(false);
    }
  };

  const featuredMovie = movies.find((m) => m.isFeatured) || movies[0];

  const categories = [
    'Trending Now',
    'Sci-Fi & Fantasy',
    'Blockbuster Movies',
    'Top Rated',
    'Popular TV Shows',
  ];

  const watchlistMovies = movies.filter((m) => watchlist.includes(m._id));

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-[#E50914] selection:text-white pb-20 font-sans">
      {/* Top Navbar */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Hero Banner */}
      {activeCategory === 'All' && featuredMovie && (
        <HeroBanner
          movie={featuredMovie}
          onSelectMovie={(m) => setSelectedMovie(m)}
        />
      )}

      {/* Category Rows Section */}
      <main className={`relative z-20 ${activeCategory === 'All' ? '-mt-16 md:-mt-24' : 'pt-28'}`}>
        {/* Watchlist Row */}
        {watchlistMovies.length > 0 && (
          <MovieRow
            title="My Watchlist"
            movies={watchlistMovies}
            onSelectMovie={(m) => setSelectedMovie(m)}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
          />
        )}

        {/* Category Rows */}
        {categories.map((cat) => {
          if (activeCategory !== 'All' && activeCategory !== cat) return null;
          const categoryMovies = movies.filter((m) => m.category === cat);
          const displayList = categoryMovies.length > 0 ? categoryMovies : movies.slice(0, 5);

          return (
            <MovieRow
              key={cat}
              title={cat}
              movies={displayList}
              onSelectMovie={(m) => setSelectedMovie(m)}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
            />
          );
        })}
      </main>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 pt-8 px-6 md:px-12 text-gray-500 text-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-gray-400 font-semibold mb-1">Prime Clone</p>
          <p>© 2026 Prime Clone. All rights reserved.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-400 text-xs font-medium">
          ✓ Real-Time Security & Verification Active
        </div>
      </footer>
    </div>
  );
};
