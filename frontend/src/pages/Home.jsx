import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { MovieModal } from '../components/MovieModal';
import { Play, Sparkles, Heart, Clock, Film, Tv, Gamepad2, Globe } from 'lucide-react';

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loadingMovies, setLoadingMovies] = useState(true);

  const { user, watchlist, toggleWatchlist, likedMovies, toggleLike, activeProfile } = useContext(AuthContext);

  // Master Rich Netflix Catalog
  const richNetflixCatalog = [
    {
      _id: 'n101',
      title: 'VOICEMAILS FOR Isabelle',
      overview:
        'A San Francisco dessert chef leaves voicemails for her late sister, unaware the number now belongs to a guy charmed by updates about her chaotic life.',
      backdropUrl:
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
      category: 'Top 10 Movies Today',
      type: 'Movie',
      language: 'English',
      rating: 'A',
      releaseYear: 2026,
      duration: '1h 58m',
      genres: ['Film', 'Comedy', 'Romance'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isFeatured: true,
      matchPercentage: 99,
      isTop10: true,
    },
    {
      _id: 'n102',
      title: 'The Half of It',
      overview:
        'Shy, straight-A student Ellie helps sweet athlete Paul woo his crush, but their secret bond is tested when Ellie falls for the same girl.',
      backdropUrl:
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
      category: 'Continue Watching',
      type: 'Movie',
      language: 'English',
      rating: 'U/A 13+',
      releaseYear: 2024,
      duration: '1h 45m',
      genres: ['Drama', 'Romance', 'Comedy'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 97,
      progress: 75,
    },
    {
      _id: 'n103',
      title: 'MODHA RATHRI',
      overview:
        'A hilarious and heartwarming comedy following a newlywed couple navigating chaotic family expectations and unexpected village events.',
      backdropUrl:
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      category: 'Continue Watching',
      type: 'Movie',
      language: 'Tamil',
      rating: 'U/A 13+',
      releaseYear: 2025,
      duration: '2h 10m',
      genres: ['Comedy', 'Drama'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 95,
      isRecentlyAdded: true,
      progress: 40,
    },
    {
      _id: 'n104',
      title: 'The Middle',
      overview:
        'A quirky Midwestern family of five navigates daily life, school struggles, and working-class parenthood with endless heart.',
      backdropUrl:
        'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop',
      category: 'Continue Watching',
      type: 'Show',
      language: 'English',
      rating: 'TV-PG',
      releaseYear: 2023,
      duration: '9 Seasons',
      genres: ['Sitcom', 'Comedy'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 94,
      progress: 90,
    },
    {
      _id: 'n105',
      title: 'Wake Up Dead Man - Knives Out',
      overview:
        'Benoit Blanc returns for his most perilous mystery yet in a seaside cathedral town fraught with secrets and betrayal.',
      backdropUrl:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      category: 'Continue Watching',
      type: 'Movie',
      language: 'English',
      rating: 'TV-MA',
      releaseYear: 2025,
      duration: '2h 20m',
      genres: ['Mystery', 'Crime', 'Thriller'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 99,
      progress: 60,
    },
    {
      _id: 'n106',
      title: 'AYALVAASHI',
      overview:
        'A petty dispute between two lifelong friends escalates into an all-out neighborhood feud filled with laughter and chaos.',
      backdropUrl:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
      category: 'Continue Watching',
      type: 'Movie',
      language: 'Malayalam',
      rating: 'U/A 13+',
      releaseYear: 2024,
      duration: '2h 15m',
      genres: ['Comedy', 'Drama'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 92,
      isTop10: true,
      progress: 25,
    },
    {
      _id: 'n107',
      title: 'Twenty Five Twenty One',
      overview:
        'In a time when dreams seem out of reach, a teenage fencer pursues big ambitions and meets a hardworking young man who seeks to rebuild his life.',
      backdropUrl:
        'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=800&auto=format&fit=crop',
      category: 'Bring the (TV) Drama',
      type: 'Show',
      language: 'Korean',
      rating: 'TV-14',
      releaseYear: 2022,
      duration: '16 Episodes',
      genres: ['K-Drama', 'Romance', 'Youth'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 98,
    },
    {
      _id: 'n108',
      title: 'Hospital Playlist',
      overview:
        'Five doctors who have been friends since medical school navigate the ups and downs of life, music, and emergency hospital care.',
      backdropUrl:
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
      category: 'Bring the (TV) Drama',
      type: 'Show',
      language: 'Korean',
      rating: 'TV-14',
      releaseYear: 2021,
      duration: '2 Seasons',
      genres: ['Medical Drama', 'Friendship'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 99,
    },
    {
      _id: 'n109',
      title: 'Stranger Things',
      overview:
        'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
      backdropUrl:
        'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop',
      category: 'Bring the (TV) Drama',
      type: 'Show',
      language: 'English',
      rating: 'TV-14',
      releaseYear: 2024,
      duration: '4 Seasons',
      genres: ['Sci-Fi', 'Horror', 'Drama'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 99,
      isTop10: true,
    },
    {
      _id: 'n110',
      title: 'A Virtuous Business',
      overview:
        'In a rural 1990s Korean village, four women start a door-to-door adult product business, finding independence and sisterhood along the way.',
      backdropUrl:
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
      category: 'Bring the (TV) Drama',
      type: 'Show',
      language: 'Korean',
      rating: 'TV-MA',
      releaseYear: 2024,
      duration: '12 Episodes',
      genres: ['Comedy', 'Drama'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 96,
    },
    {
      _id: 'n111',
      title: 'AIR - All India Rank',
      overview:
        'In 1990s India, a 16-year-old boy is sent to a intense coaching institute to crack the competitive IIT entrance exams.',
      backdropUrl:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
      category: 'Gems for You',
      type: 'Show',
      language: 'Hindi',
      rating: 'U/A 13+',
      releaseYear: 2024,
      duration: '7 Episodes',
      genres: ['Series', 'Drama', 'Youth'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 98,
    },
    {
      _id: 'n112',
      title: 'Twinkling Watermelon',
      overview:
        'A musically gifted child of deaf parents time-travels to 1995 and forms a band with his teenage father.',
      backdropUrl:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
      category: 'Gems for You',
      type: 'Show',
      language: 'Korean',
      rating: 'TV-14',
      releaseYear: 2023,
      duration: '16 Episodes',
      genres: ['Music', 'Fantasy', 'Romance'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 97,
    },
    {
      _id: 'n113',
      title: 'Resident Playbook',
      overview:
        'Rookie obstetrics and gynecology residents learn to balance grueling shifts with friendships at Yulje Medical Center.',
      backdropUrl:
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop',
      category: 'Gems for You',
      type: 'Show',
      language: 'Korean',
      rating: 'TV-14',
      releaseYear: 2025,
      duration: '12 Episodes',
      genres: ['Medical', 'Drama'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 95,
    },
    {
      _id: 'n114',
      title: 'The Mentalist',
      overview:
        'A former psychic medium uses his keen observational skills to solve complex crimes for the California Bureau of Investigation.',
      backdropUrl:
        'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=800&auto=format&fit=crop',
      category: 'Because you watched Crew Girl',
      type: 'Show',
      language: 'English',
      rating: 'TV-14',
      releaseYear: 2015,
      duration: '7 Seasons',
      genres: ['Crime', 'Mystery'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 96,
    },
    {
      _id: 'n115',
      title: 'XO, Kitty',
      overview:
        'Teen matchmaker Kitty Song Covey moves to Seoul to reunite with her long-distance boyfriend, discovering love is far more complicated.',
      backdropUrl:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      category: 'Because you watched Crew Girl',
      type: 'Show',
      language: 'English',
      rating: 'TV-14',
      releaseYear: 2024,
      duration: '2 Seasons',
      genres: ['Romance', 'Comedy', 'Teen'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 94,
    },
    {
      _id: 'n116',
      title: 'The Four Seasons',
      overview:
        'Three couples spend four vacations together each year, examining life, marriage, and aging across changing seasons.',
      backdropUrl:
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
      category: 'When Nostalgia Calls',
      type: 'Movie',
      language: 'English',
      rating: 'PG-13',
      releaseYear: 2024,
      duration: '1h 48m',
      genres: ['Comedy', 'Drama'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 91,
    },
    {
      _id: 'n117',
      title: '#Love',
      overview:
        'A romantic multi-story modern love tale capturing couples in urban cities through social media connections.',
      backdropUrl:
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1600&auto=format&fit=crop',
      posterUrl:
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
      category: 'When Nostalgia Calls',
      type: 'Movie',
      language: 'Tamil',
      rating: 'U/A 13+',
      releaseYear: 2025,
      duration: '2h 05m',
      genres: ['Romance', 'Drama'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      matchPercentage: 93,
      isRecentlyAdded: true,
    },
  ];

  // Netflix Games Catalog
  const gamesCatalog = [
    {
      _id: 'g1',
      title: 'GTA: San Andreas – Definitive',
      overview: 'Explore the vast state of San Andreas in this classic open-world crime epic, remastered for mobile.',
      backdropUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
      rating: '17+',
      duration: 'Action Game',
      genres: ['Open World', 'Action'],
      matchPercentage: 99,
    },
    {
      _id: 'g2',
      title: 'Stranger Things 1984',
      overview: 'Join Hopper and the kids for retro action-adventure missions across Hawkins and the Upside Down.',
      backdropUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1600&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop',
      rating: '12+',
      duration: 'Retro Arcade',
      genres: ['Pixel', 'Adventure'],
      matchPercentage: 98,
    },
    {
      _id: 'g3',
      title: 'Hades – Mobile Edition',
      overview: 'Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler.',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      rating: '16+',
      duration: 'Roguelike',
      genres: ['Action', 'RPG'],
      matchPercentage: 97,
    },
    {
      _id: 'g4',
      title: 'Monument Valley 2+',
      overview: 'Guide a mother and child through sacred geometry and optical illusion architecture in a surreal journey.',
      backdropUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1600&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=800&auto=format&fit=crop',
      rating: '3+',
      duration: 'Puzzle',
      genres: ['Indie', 'Relaxing'],
      matchPercentage: 96,
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
        const rawList = data.length > 0 ? data : richNetflixCatalog;
        const normalized = rawList.map((m) => ({
          ...m,
          id: m.id || m._id,
          _id: m._id || m.id,
        }));
        setMovies(normalized);
      } else {
        const normalized = richNetflixCatalog.map((m) => ({ ...m, id: m._id }));
        setMovies(normalized);
      }
    } catch (err) {
      const normalized = richNetflixCatalog.map((m) => ({ ...m, id: m._id }));
      setMovies(normalized);
    } finally {
      setLoadingMovies(false);
    }
  };

  const activeName = activeProfile?.name || user?.name || 'sathiya';
  const featuredMovie = movies.find((m) => m.isFeatured) || movies[0] || richNetflixCatalog[0];

  const watchlistMovies = movies.filter((m) => watchlist.includes(m.id) || watchlist.includes(m._id));
  const likedListMovies = movies.filter((m) => likedMovies.includes(m.id) || likedMovies.includes(m._id));

  // Dynamic Row Renderer based on selected Nav Tab
  const renderDynamicContent = () => {
    if (activeCategory === 'Shows') {
      const showsOnly = movies.filter((m) => m.type === 'Show' || m.duration?.includes('Season') || m.duration?.includes('Episode'));
      return (
        <div className="pt-24 space-y-6">
          <div className="px-6 md:px-12 flex items-center gap-3">
            <Tv className="w-8 h-8 text-[#E50914]" />
            <h1 className="text-3xl font-black text-white">TV Shows & Series</h1>
          </div>
          <MovieRow title="Top TV Shows Today" movies={showsOnly} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
          <MovieRow title="K-Drama & Asian Hits" movies={showsOnly.filter((m) => m.language === 'Korean')} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
          <MovieRow title="Bingeable TV Dramas" movies={showsOnly.filter((m) => m.genres?.includes('Drama'))} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
        </div>
      );
    }

    if (activeCategory === 'Movies') {
      const moviesOnly = movies.filter((m) => m.type === 'Movie' || m.duration?.includes('m') || m.duration?.includes('h'));
      return (
        <div className="pt-24 space-y-6">
          <div className="px-6 md:px-12 flex items-center gap-3">
            <Film className="w-8 h-8 text-[#E50914]" />
            <h1 className="text-3xl font-black text-white">Blockbuster Movies</h1>
          </div>
          <MovieRow title="Top 10 Feature Films" movies={moviesOnly} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
          <MovieRow title="Comedy & Romance" movies={moviesOnly.filter((m) => m.genres?.includes('Comedy') || m.genres?.includes('Romance'))} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
          <MovieRow title="Action & Thrillers" movies={moviesOnly.filter((m) => m.genres?.includes('Thriller') || m.genres?.includes('Crime'))} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
        </div>
      );
    }

    if (activeCategory === 'Games') {
      return (
        <div className="pt-24 space-y-6 px-6 md:px-12">
          <div className="flex items-center gap-3 mb-6">
            <Gamepad2 className="w-8 h-8 text-[#E50914]" />
            <div>
              <h1 className="text-3xl font-black text-white">Netflix Games</h1>
              <p className="text-xs text-gray-400">Unlimited access to exclusive mobile games included with your subscription.</p>
            </div>
          </div>
          <MovieRow title="Popular Mobile Games" movies={gamesCatalog} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
        </div>
      );
    }

    if (activeCategory === 'New & Popular') {
      return (
        <div className="pt-24 space-y-6">
          <div className="px-6 md:px-12 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#E50914]" />
            <h1 className="text-3xl font-black text-white">New & Popular</h1>
          </div>
          <MovieRow title="Top 10 Today" movies={movies.filter((m) => m.isTop10)} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
          <MovieRow title="New Releases This Week" movies={movies.filter((m) => m.isRecentlyAdded || m.releaseYear >= 2025)} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
        </div>
      );
    }

    if (activeCategory === 'My Netflix' || activeCategory === 'My List') {
      return (
        <div className="pt-24 space-y-8">
          <div className="px-6 md:px-12 flex items-center gap-4 border-b border-white/10 pb-6">
            <div className={`w-16 h-16 rounded-xl ${activeProfile?.avatarColor || 'bg-[#E50914]'} flex items-center justify-center font-bold text-white text-2xl shadow-xl overflow-hidden`}>
              {activeProfile?.avatarUrl ? (
                <img src={activeProfile.avatarUrl} alt={activeName} className="w-full h-full object-cover" />
              ) : (
                activeName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">{activeName}'s Profile</h1>
              <p className="text-xs text-gray-400">Manage your saved watchlist, liked shows, and recommendations.</p>
            </div>
          </div>

          {watchlistMovies.length > 0 ? (
            <MovieRow title="My Saved Watchlist" movies={watchlistMovies} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
          ) : (
            <div className="px-6 md:px-12 text-center py-12 bg-white/5 mx-6 rounded-xl border border-white/10">
              <p className="text-gray-400 text-sm mb-2">Your watchlist is currently empty.</p>
              <p className="text-xs text-gray-500">Click the '+' button on any movie card to save it here!</p>
            </div>
          )}

          {likedListMovies.length > 0 && (
            <MovieRow title="Shows & Movies You Liked 👍" movies={likedListMovies} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
          )}

          <MovieRow title={`Continue Watching for ${activeName}`} movies={movies.filter((m) => m.category === 'Continue Watching')} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} isContinueWatching={true} />
        </div>
      );
    }

    if (activeCategory === 'Languages') {
      return (
        <div className="pt-24 space-y-6">
          <div className="px-6 md:px-12 flex items-center gap-3">
            <Globe className="w-8 h-8 text-[#E50914]" />
            <h1 className="text-3xl font-black text-white">Browse by Languages</h1>
          </div>
          <MovieRow title="Tamil Hits" movies={movies.filter((m) => m.language === 'Tamil')} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
          <MovieRow title="Korean Dramas & Movies" movies={movies.filter((m) => m.language === 'Korean')} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
          <MovieRow title="Hindi Releases" movies={movies.filter((m) => m.language === 'Hindi')} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
          <MovieRow title="Malayalam Cinema" movies={movies.filter((m) => m.language === 'Malayalam')} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
        </div>
      );
    }

    // Default 'All' Home View
    const categories = [
      'Continue Watching',
      'Bring the (TV) Drama',
      'Gems for You',
      'Because you watched Crew Girl',
      'When Nostalgia Calls',
      'Top 10 Movies Today',
    ];

    return (
      <main className="-mt-16 md:-mt-24 relative z-20">
        {watchlistMovies.length > 0 && (
          <MovieRow title="My List" movies={watchlistMovies} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
        )}

        {categories.map((cat, idx) => {
          const categoryMovies = movies.filter((m) => m.category === cat);
          const displayList = categoryMovies.length > 0 ? categoryMovies : movies.slice(0, 6);

          const isContinue = cat === 'Continue Watching';
          const rowTitle = isContinue ? `Continue Watching for ${activeName}` : cat;

          return (
            <MovieRow
              key={cat}
              title={rowTitle}
              movies={displayList}
              onSelectMovie={setSelectedMovie}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
              isContinueWatching={isContinue}
              showCollectionBanner={idx === 1}
            />
          );
        })}
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-[#E50914] selection:text-white pb-20 font-sans">
      {/* Top Navbar */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onSearch={(query) => {
          if (!query.trim()) {
            fetchMovies();
            return;
          }
          const filtered = richNetflixCatalog.filter(
            (m) =>
              m.title.toLowerCase().includes(query.toLowerCase()) ||
              m.genres.some((g) => g.toLowerCase().includes(query.toLowerCase()))
          );
          setMovies(filtered);
        }}
      />

      {/* Hero Banner (Only on Home View) */}
      {activeCategory === 'All' && featuredMovie && (
        <HeroBanner movie={featuredMovie} onSelectMovie={setSelectedMovie} />
      )}

      {/* Dynamic Content Body based on Selected Navbar Tab */}
      {renderDynamicContent()}

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {/* Official Netflix Footer */}
      <footer className="mt-20 border-t border-white/10 pt-10 px-6 md:px-12 text-gray-500 text-xs max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 text-gray-400">
          <div className="flex flex-col gap-2">
            <a href="#" className="hover:underline">Audio Description</a>
            <a href="#" className="hover:underline">Investor Relations</a>
            <a href="#" className="hover:underline">Legal Notices</a>
          </div>
          <div className="flex flex-col gap-2">
            <a href="#" className="hover:underline">Help Centre</a>
            <a href="#" className="hover:underline">Jobs</a>
            <a href="#" className="hover:underline">Cookie Preferences</a>
          </div>
          <div className="flex flex-col gap-2">
            <a href="#" className="hover:underline">Gift Cards</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Corporate Information</a>
          </div>
          <div className="flex flex-col gap-2">
            <a href="#" className="hover:underline">Media Centre</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Contact Us</a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6 text-gray-400">
          <div>
            <p className="text-gray-300 font-semibold mb-1">Netflix Clone DevSecOps</p>
            <p>© 2026 Netflix Clone. All rights reserved.</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-400 text-xs font-medium">
            ✓ Dynamic Navigation & Interactive Profiles Active
          </div>
        </div>
      </footer>
    </div>
  );
};
