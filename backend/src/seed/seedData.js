import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Movie } from '../models/Movie.js';
import { User } from '../models/User.js';

dotenv.config();

const sampleMovies = [
  {
    title: 'Stranger Things: Origins',
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    backdropUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop',
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
    title: 'Cyberpunk Cyberia',
    overview: 'In a neon-drenched dystopian metropolis, an ambitious hacker risks everything to steal a military-grade neural implant.',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
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
    title: 'Dark Orbit',
    overview: 'A deep space research station goes silent near Jupiter. A rescue crew investigates, discovering something incomprehensible in the shadows.',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600&auto=format&fit=crop',
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
    title: 'Neon Velocity',
    overview: 'An underground street racer accidentally intercepts an encrypted drive containing syndicate secrets.',
    backdropUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
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
    title: 'The Sentinel',
    overview: 'An ancient guardian awakens after centuries to protect the final stronghold of humanity against AI warlords.',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=600&auto=format&fit=crop',
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
    title: 'Quantum Horizon',
    overview: 'Quantum physicists break the veil between parallel dimensions, exposing Earth to unpredictable timelines.',
    backdropUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
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
    title: 'The Last Extraction',
    overview: 'A mercenary team is tasked with retrieving a high-value asset from a rogue orbital fortress.',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
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
    title: 'Echoes of Silence',
    overview: 'In an underwater research facility, acoustic engineers discover strange frequencies that unlock lost human memories.',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop',
    category: 'Blockbuster Movies',
    rating: 'PG-13',
    releaseYear: 2024,
    duration: '1h 50m',
    genres: ['Drama', 'Mystery'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isFeatured: false,
    matchPercentage: 93,
  }
];

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/netflix_db';
    console.log(`[Seed Script] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed Script] Clearing existing movie catalog...');
    await Movie.deleteMany({});

    console.log('[Seed Script] Inserting rich sample Netflix movie catalog...');
    await Movie.insertMany(sampleMovies);

    console.log('[Seed Script] Seeding demo Netflix user account (devops@netflix.com / devops123)...');
    const existingDevUser = await User.findOne({ email: 'devops@netflix.com' });
    if (!existingDevUser) {
      await User.create({
        name: 'DevOps Engineer',
        email: 'devops@netflix.com',
        password: 'devops123',
      });
    }

    console.log('[Seed Script] Database Seeding Completed Successfully! 🎉');
    return true;
  } catch (error) {
    console.error(`[Seed Script Error] Database seeding failed: ${error.message}`);
    return false;
  }
};

// Execute if run directly via `npm run seed`
if (process.argv[1]?.includes('seedData.js')) {
  seedDatabase().then(() => process.exit());
}
