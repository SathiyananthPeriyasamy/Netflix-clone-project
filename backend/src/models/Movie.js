import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
    },
    backdropUrl: {
      type: String,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Trending Now', 'Action & Adventure', 'Sci-Fi & Fantasy', 'Blockbuster Movies', 'Top Rated', 'Popular TV Shows'],
    },
    rating: {
      type: String,
      default: 'TV-MA',
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      default: '2h 15m',
    },
    genres: [
      {
        type: String,
      },
    ],
    videoUrl: {
      type: String,
      default: 'https://www.w3schools.com/html/mov_bbb.mp4', // Demo video stream
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    matchPercentage: {
      type: Number,
      default: 98,
    },
  },
  {
    timestamps: true,
  }
);

export const Movie = mongoose.model('Movie', movieSchema);
