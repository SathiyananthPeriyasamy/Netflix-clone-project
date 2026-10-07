import express from 'express';
import { prisma } from '../config/prisma.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// High-resolution clean movie catalog matching frontend categories
const cleanMovieCatalog = [
  {
    id: 'n101',
    _id: 'n101',
    title: 'VOICEMAILS FOR Isabelle',
    overview: 'A San Francisco dessert chef leaves voicemails for her late sister, unaware the number now belongs to a guy charmed by updates about her chaotic life.',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    category: 'Top 10 Movies Today',
    rating: 9.9,
    releaseYear: 2026,
    duration: '1h 58m',
    genres: ['Film', 'Comedy', 'Romance'],
    isFeatured: true,
    matchPercentage: 99,
    isTop10: true,
  },
  {
    id: 'n102',
    _id: 'n102',
    title: 'The Half of It',
    overview: 'Shy, straight-A student Ellie helps sweet athlete Paul woo his crush, but their secret bond is tested when Ellie falls for the same girl.',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    category: 'Continue Watching',
    rating: 8.5,
    releaseYear: 2024,
    duration: '1h 45m',
    genres: ['Drama', 'Romance', 'Comedy'],
    isFeatured: false,
    matchPercentage: 97,
  },
  {
    id: 'n103',
    _id: 'n103',
    title: 'MODHA RATHRI',
    overview: 'A hilarious and heartwarming comedy following a newlywed couple navigating chaotic family expectations and unexpected village events.',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    category: 'Continue Watching',
    rating: 8.8,
    releaseYear: 2025,
    duration: '2h 10m',
    genres: ['Comedy', 'Drama'],
    isFeatured: false,
    matchPercentage: 95,
  },
  {
    id: 'n104',
    _id: 'n104',
    title: 'The Middle',
    overview: 'A quirky Midwestern family of five navigates daily life, school struggles, and working-class parenthood with endless heart.',
    backdropUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop',
    category: 'Continue Watching',
    rating: 8.9,
    releaseYear: 2023,
    duration: '9 Seasons',
    genres: ['Sitcom', 'Comedy'],
    isFeatured: false,
    matchPercentage: 94,
  },
  {
    id: 'n105',
    _id: 'n105',
    title: 'Wake Up Dead Man - Knives Out',
    overview: 'Benoit Blanc returns for his most perilous mystery yet in a seaside cathedral town fraught with secrets and betrayal.',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    category: 'Continue Watching',
    rating: 9.0,
    releaseYear: 2025,
    duration: '2h 20m',
    genres: ['Mystery', 'Crime', 'Thriller'],
    isFeatured: false,
    matchPercentage: 99,
  },
  {
    id: 'n106',
    _id: 'n106',
    title: 'AYALVAASHI',
    overview: 'A petty dispute between two lifelong friends escalates into an all-out neighborhood feud filled with laughter and chaos.',
    backdropUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    category: 'Continue Watching',
    rating: 8.3,
    releaseYear: 2024,
    duration: '2h 15m',
    genres: ['Comedy', 'Drama'],
    isFeatured: false,
    matchPercentage: 92,
  },
  {
    id: 'n107',
    _id: 'n107',
    title: 'Twenty Five Twenty One',
    overview: 'In a time when dreams seem out of reach, a teenage fencer pursues big ambitions and meets a hardworking young man who seeks to rebuild his life.',
    backdropUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=800&auto=format&fit=crop',
    category: 'Bring the (TV) Drama',
    rating: 9.2,
    releaseYear: 2022,
    duration: '16 Episodes',
    genres: ['K-Drama', 'Romance', 'Youth'],
    isFeatured: false,
    matchPercentage: 98,
  },
  {
    id: 'n108',
    _id: 'n108',
    title: 'Hospital Playlist',
    overview: 'Five doctors who have been friends since medical school navigate the ups and downs of life, music, and emergency hospital care.',
    backdropUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
    category: 'Bring the (TV) Drama',
    rating: 9.4,
    releaseYear: 2021,
    duration: '2 Seasons',
    genres: ['Medical Drama', 'Friendship'],
    isFeatured: false,
    matchPercentage: 99,
  },
  {
    id: 'n109',
    _id: 'n109',
    title: 'Stranger Things',
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    backdropUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop',
    category: 'Bring the (TV) Drama',
    rating: 8.7,
    releaseYear: 2024,
    duration: '4 Seasons',
    genres: ['Sci-Fi', 'Horror', 'Drama'],
    isFeatured: false,
    matchPercentage: 99,
    isTop10: true,
  },
  {
    id: 'n110',
    _id: 'n110',
    title: 'A Virtuous Business',
    overview: 'In a rural 1990s Korean village, four women start a door-to-door adult product business, finding independence and sisterhood along the way.',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    category: 'Bring the (TV) Drama',
    rating: 8.6,
    releaseYear: 2024,
    duration: '12 Episodes',
    genres: ['Comedy', 'Drama'],
    isFeatured: false,
    matchPercentage: 96,
  },
  {
    id: 'n111',
    _id: 'n111',
    title: 'AIR - All India Rank',
    overview: 'In 1990s India, a 16-year-old boy is sent to a intense coaching institute to crack the competitive IIT entrance exams.',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    category: 'Gems for You',
    rating: 8.9,
    releaseYear: 2024,
    duration: '7 Episodes',
    genres: ['Series', 'Drama', 'Youth'],
    isFeatured: false,
    matchPercentage: 98,
  },
  {
    id: 'n112',
    _id: 'n112',
    title: 'Twinkling Watermelon',
    overview: 'A musically gifted child of deaf parents time-travels to 1995 and forms a band with his teenage father.',
    backdropUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    category: 'Gems for You',
    rating: 9.0,
    releaseYear: 2023,
    duration: '16 Episodes',
    genres: ['Music', 'Fantasy', 'Romance'],
    isFeatured: false,
    matchPercentage: 97,
  },
  {
    id: 'n113',
    _id: 'n113',
    title: 'Resident Playbook',
    overview: 'Rookie obstetrics and gynecology residents learn to balance grueling shifts with friendships at Yulje Medical Center.',
    backdropUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop',
    category: 'Gems for You',
    rating: 8.7,
    releaseYear: 2025,
    duration: '12 Episodes',
    genres: ['Medical', 'Drama'],
    isFeatured: false,
    matchPercentage: 95,
  },
  {
    id: 'n114',
    _id: 'n114',
    title: 'The Mentalist',
    overview: 'A former psychic medium uses his keen observational skills to solve complex crimes for the California Bureau of Investigation.',
    backdropUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=800&auto=format&fit=crop',
    category: 'Because you watched Crew Girl',
    rating: 8.8,
    releaseYear: 2015,
    duration: '7 Seasons',
    genres: ['Crime', 'Mystery'],
    isFeatured: false,
    matchPercentage: 96,
  },
  {
    id: 'n115',
    _id: 'n115',
    title: 'XO, Kitty',
    overview: 'Teen matchmaker Kitty Song Covey moves to Seoul to reunite with her long-distance boyfriend, discovering love is far more complicated.',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    category: 'Because you watched Crew Girl',
    rating: 8.4,
    releaseYear: 2024,
    duration: '2 Seasons',
    genres: ['Romance', 'Comedy', 'Teen'],
    isFeatured: false,
    matchPercentage: 94,
  },
  {
    id: 'n116',
    _id: 'n116',
    title: 'The Four Seasons',
    overview: 'Three couples spend four vacations together each year, examining life, marriage, and aging across changing seasons.',
    backdropUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
    category: 'When Nostalgia Calls',
    rating: 8.2,
    releaseYear: 2024,
    duration: '1h 48m',
    genres: ['Comedy', 'Drama'],
    isFeatured: false,
    matchPercentage: 91,
  },
  {
    id: 'n117',
    _id: 'n117',
    title: '#Love',
    overview: 'A romantic multi-story modern love tale capturing couples in urban cities through social media connections.',
    backdropUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    category: 'When Nostalgia Calls',
    rating: 8.6,
    releaseYear: 2025,
    duration: '2h 05m',
    genres: ['Romance', 'Drama'],
    isFeatured: false,
    matchPercentage: 93,
  },
];

// @route   GET /api/movies
router.get('/', async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();
    if (movies && movies.length > 0) {
      const normalized = movies.map((m) => ({ ...m, _id: m.id }));
      return res.json(normalized);
    }
    res.json(cleanMovieCatalog);
  } catch (error) {
    res.json(cleanMovieCatalog);
  }
});

// @route   GET /api/movies/featured
router.get('/featured', async (req, res) => {
  try {
    const featured = await prisma.movie.findFirst({ where: { isFeatured: true } });
    if (featured) return res.json({ ...featured, _id: featured.id });
    res.json(cleanMovieCatalog[0]);
  } catch (error) {
    res.json(cleanMovieCatalog[0]);
  }
});

// @route   GET /api/movies/watchlist/user
router.get('/watchlist/user', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await prisma.watchlist.findMany({
      where: { userId },
      select: { movieId: true },
    });
    res.json({ watchlist: items.map((i) => i.movieId) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await prisma.movie.findUnique({ where: { id: req.params.id } });
    if (movie) return res.json({ ...movie, _id: movie.id });
    const fallback = cleanMovieCatalog.find((m) => m.id === req.params.id || m._id === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(404).json({ message: 'Movie not found' });
  } catch (error) {
    const fallback = cleanMovieCatalog.find((m) => m.id === req.params.id || m._id === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(404).json({ message: 'Movie not found' });
  }
});

// @route   POST /api/movies/watchlist/toggle
router.post('/watchlist/toggle', protect, async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.id;

    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }

    // Ensure movie exists in RDS Movie table to satisfy Foreign Key constraint
    const movieDetails = cleanMovieCatalog.find((m) => m.id === movieId || m._id === movieId);
    if (movieDetails) {
      const dbMovie = await prisma.movie.findUnique({ where: { id: movieId } });
      if (!dbMovie) {
        await prisma.movie.create({
          data: {
            id: movieId,
            title: movieDetails.title,
            overview: movieDetails.overview || '',
            backdropUrl: movieDetails.backdropUrl || '',
            posterUrl: movieDetails.posterUrl || '',
            category: movieDetails.category || 'Movies',
            rating: movieDetails.rating || 8.0,
            releaseYear: movieDetails.releaseYear || 2024,
            duration: movieDetails.duration || '2h',
            genres: movieDetails.genres || [],
            isFeatured: movieDetails.isFeatured || false,
            matchPercentage: movieDetails.matchPercentage || 95,
          },
        });
      }
    }

    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: { userId, movieId },
      },
    });

    if (existing) {
      await prisma.watchlist.delete({
        where: {
          userId_movieId: { userId, movieId },
        },
      });
    } else {
      await prisma.watchlist.create({
        data: { userId, movieId },
      });
    }

    const userWatchlist = await prisma.watchlist.findMany({
      where: { userId },
      select: { movieId: true },
    });

    const watchlistIds = userWatchlist.map((w) => w.movieId);
    res.json({ watchlist: watchlistIds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
