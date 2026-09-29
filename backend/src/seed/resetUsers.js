import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

export const resetAllUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/netflix_db';
    console.log(`[Reset Script] Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Reset Script] Deleting all existing user accounts...');
    const result = await User.deleteMany({});
    console.log(`[Reset Script] Successfully deleted ${result.deletedCount} user accounts from MongoDB! 🎉`);
    return true;
  } catch (error) {
    console.error(`[Reset Script Error] Failed to reset users: ${error.message}`);
    return false;
  }
};

if (process.argv[1]?.includes('resetUsers.js')) {
  resetAllUsers().then(() => process.exit());
}
