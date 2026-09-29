import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/netflix_db';
    console.log(`[Database] Attempting connection to MongoDB at: ${connStr}`);
    
    // Set short buffer timeout so API fails fast if MongoDB is not active
    mongoose.set('bufferTimeoutMS', 2500);

    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000,
    });
    
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.warn('[Database Warning] MongoDB is not running locally. Auth & catalog will run in fallback mock mode.');
    return false;
  }
};
