import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Movie } from '../models/Movie.js';
import { User } from '../models/User.js';

dotenv.config();

const sampleMovies = [
  {
    title: 'VOICEMAILS FOR Isabelle',
    overview:
      'A San Francisco dessert chef leaves voicemails for her late sister, unaware the number now belongs to a guy charmed by updates about her chaotic life.',
    backdropUrl:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    category: 'Top 10 Movies Today',
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
    title: 'The Half of It',
    overview:
      'Shy, straight-A student Ellie helps sweet athlete Paul woo his crush, but their secret bond is tested when Ellie falls for the same girl.',
    backdropUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    category: 'Continue Watching',
    rating: 'U/A 13+',
    releaseYear: 2024,
    duration: '1h 45m',
    genres: ['Drama', 'Romance', 'Comedy'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 97,
    progress: 75,
  },
  {
    title: 'MODHA RATHRI',
    overview:
      'A hilarious and heartwarming comedy following a newlywed couple navigating chaotic family expectations and unexpected village events.',
    backdropUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    category: 'Continue Watching',
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
    title: 'The Middle',
    overview:
      'A quirky Midwestern family of five navigates daily life, school struggles, and working-class parenthood with endless heart.',
    backdropUrl:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop',
    category: 'Continue Watching',
    rating: 'TV-PG',
    releaseYear: 2023,
    duration: '9 Seasons',
    genres: ['Sitcom', 'Comedy'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 94,
    progress: 90,
  },
  {
    title: 'Wake Up Dead Man - Knives Out',
    overview:
      'Benoit Blanc returns for his most perilous mystery yet in a seaside cathedral town fraught with secrets and betrayal.',
    backdropUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    category: 'Continue Watching',
    rating: 'TV-MA',
    releaseYear: 2025,
    duration: '2h 20m',
    genres: ['Mystery', 'Crime', 'Thriller'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 99,
    progress: 60,
  },
  {
    title: 'AYALVAASHI',
    overview:
      'A petty dispute between two lifelong friends escalates into an all-out neighborhood feud filled with laughter and chaos.',
    backdropUrl:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    category: 'Continue Watching',
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
    title: 'Twenty Five Twenty One',
    overview:
      'In a time when dreams seem out of reach, a teenage fencer pursues big ambitions and meets a hardworking young man who seeks to rebuild his life.',
    backdropUrl:
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=800&auto=format&fit=crop',
    category: 'Bring the (TV) Drama',
    rating: 'TV-14',
    releaseYear: 2022,
    duration: '16 Episodes',
    genres: ['K-Drama', 'Romance', 'Youth'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 98,
  },
  {
    title: 'Hospital Playlist',
    overview:
      'Five doctors who have been friends since medical school navigate the ups and downs of life, music, and emergency hospital care.',
    backdropUrl:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
    category: 'Bring the (TV) Drama',
    rating: 'TV-14',
    releaseYear: 2021,
    duration: '2 Seasons',
    genres: ['Medical Drama', 'Friendship'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 99,
  },
  {
    title: 'Stranger Things',
    overview:
      'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    backdropUrl:
      'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop',
    category: 'Bring the (TV) Drama',
    rating: 'TV-14',
    releaseYear: 2024,
    duration: '4 Seasons',
    genres: ['Sci-Fi', 'Horror', 'Drama'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 99,
    isTop10: true,
  },
  {
    title: 'A Virtuous Business',
    overview:
      'In a rural 1990s Korean village, four women start a door-to-door adult product business, finding independence and sisterhood along the way.',
    backdropUrl:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    category: 'Bring the (TV) Drama',
    rating: 'TV-MA',
    releaseYear: 2024,
    duration: '12 Episodes',
    genres: ['Comedy', 'Drama'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 96,
  },
  {
    title: 'AIR - All India Rank',
    overview:
      'In 1990s India, a 16-year-old boy is sent to a intense coaching institute to crack the competitive IIT entrance exams.',
    backdropUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    category: 'Gems for You',
    rating: 'U/A 13+',
    releaseYear: 2024,
    duration: '7 Episodes',
    genres: ['Series', 'Drama', 'Youth'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 98,
  },
  {
    title: 'Twinkling Watermelon',
    overview:
      'A musically gifted child of deaf parents time-travels to 1995 and forms a band with his teenage father.',
    backdropUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    category: 'Gems for You',
    rating: 'TV-14',
    releaseYear: 2023,
    duration: '16 Episodes',
    genres: ['Music', 'Fantasy', 'Romance'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 97,
  },
  {
    title: 'Resident Playbook',
    overview:
      'Rookie obstetrics and gynecology residents learn to balance grueling shifts with friendships at Yulje Medical Center.',
    backdropUrl:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop',
    category: 'Gems for You',
    rating: 'TV-14',
    releaseYear: 2025,
    duration: '12 Episodes',
    genres: ['Medical', 'Drama'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 95,
  },
  {
    title: 'The Mentalist',
    overview:
      'A former psychic medium uses his keen observational skills to solve complex crimes for the California Bureau of Investigation.',
    backdropUrl:
      'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=800&auto=format&fit=crop',
    category: 'Because you watched Crew Girl',
    rating: 'TV-14',
    releaseYear: 2015,
    duration: '7 Seasons',
    genres: ['Crime', 'Mystery'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 96,
  },
  {
    title: 'XO, Kitty',
    overview:
      'Teen matchmaker Kitty Song Covey moves to Seoul to reunite with her long-distance boyfriend, discovering love is far more complicated.',
    backdropUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    category: 'Because you watched Crew Girl',
    rating: 'TV-14',
    releaseYear: 2024,
    duration: '2 Seasons',
    genres: ['Romance', 'Comedy', 'Teen'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 94,
  },
  {
    title: 'The Four Seasons',
    overview:
      'Three couples spend four vacations together each year, examining life, marriage, and aging across changing seasons.',
    backdropUrl:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
    category: 'When Nostalgia Calls',
    rating: 'PG-13',
    releaseYear: 2024,
    duration: '1h 48m',
    genres: ['Comedy', 'Drama'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 91,
  },
  {
    title: '#Love',
    overview:
      'A romantic multi-story modern love tale capturing couples in urban cities through social media connections.',
    backdropUrl:
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1600&auto=format&fit=crop',
    posterUrl:
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    category: 'When Nostalgia Calls',
    rating: 'U/A 13+',
    releaseYear: 2025,
    duration: '2h 05m',
    genres: ['Romance', 'Drama'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    matchPercentage: 93,
    isRecentlyAdded: true,
  },
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
