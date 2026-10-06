import express from 'express';
import { prisma } from '../config/prisma.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// High-resolution clean movie catalog fallback
const cleanMovieCatalog = [
  {
    id: '101',
    title: 'Stranger Things: Origins',
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    backdropUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop',
    category: 'Trending Now',
    rating: 8.7,
    releaseYear: 2024,
    duration: '4 Seasons',
    genres: ['Sci-Fi', 'Horror', 'Drama'],
    isFeatured: true,
    matchPercentage: 99,
  },
  {
    id: '102',
    title: 'Cyberpunk 2077: Cyberia',
    overview: 'In a neon-drenched dystopian metropolis, an ambitious hacker risks everything to steal a military-grade neural implant.',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    category: 'Sci-Fi & Fantasy',
    rating: 8.9,
    releaseYear: 2025,
    duration: '2h 18m',
    genres: ['Action', 'Cyberpunk', 'Thriller'],
    isFeatured: false,
    matchPercentage: 97,
  },
  {
    id: '103',
    title: 'Interstellar: Dark Orbit',
    overview: 'A deep space research station goes silent near Jupiter. A rescue crew investigates, discovering something incomprehensible in the shadows.',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
    category: 'Action & Adventure',
    rating: 9.1,
    releaseYear: 2024,
    duration: '2h 05m',
    genres: ['Sci-Fi', 'Adventure'],
    isFeatured: false,
    matchPercentage: 96,
  },
  {
    id: '104',
    title: 'Neon Velocity',
    overview: 'An underground street racer accidentally intercepts an encrypted drive containing syndicate secrets.',
    backdropUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    category: 'Blockbuster Movies',
    rating: 8.4,
    releaseYear: 2025,
    duration: '1h 55m',
    genres: ['Action', 'Crime'],
    isFeatured: false,
    matchPercentage: 95,
  },
  {
    id: '105',
    title: 'The Sentinel Guardian',
    overview: 'An ancient guardian awakens after centuries to protect the final stronghold of humanity against AI warlords.',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop',
    category: 'Top Rated',
    rating: 9.3,
    releaseYear: 2023,
    duration: '2h 30m',
    genres: ['Fantasy', 'Action'],
    isFeatured: false,
    matchPercentage: 98,
  },
  {
    id: '106',
    title: 'Quantum Horizon',
    overview: 'Quantum physicists break the veil between parallel dimensions, exposing Earth to unpredictable timelines.',
    backdropUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    category: 'Popular TV Shows',
    rating: 8.8,
    releaseYear: 2024,
    duration: '3 Seasons',
    genres: ['Sci-Fi', 'Mystery'],
    isFeatured: false,
    matchPercentage: 94,
  },
];

// @route   GET /api/movies
router.get('/', async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();
    if (movies && movies.length > 0) {
      return res.json(movies);
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
    if (featured) return res.json(featured);
    res.json(cleanMovieCatalog[0]);
  } catch (error) {
    res.json(cleanMovieCatalog[0]);
  }
});

// @route   GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await prisma.movie.findUnique({ where: { id: req.params.id } });
    if (movie) return res.json(movie);
    const fallback = cleanMovieCatalog.find((m) => m.id === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(404).json({ message: 'Movie not found' });
  } catch (error) {
    const fallback = cleanMovieCatalog.find((m) => m.id === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(404).json({ message: 'Movie not found' });
  }
});

// @route   POST /api/movies/watchlist/toggle
router.post('/watchlist/toggle', protect, async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.id;

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
