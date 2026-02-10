// server/config/database.config.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;

  // Check if the URI exists
  if (!mongoURI) {
    console.error('❌ MONGODB_URI is not defined in your .env file');
    console.error('   → Open your .env file and add: MONGODB_URI=mongodb://localhost:27017/yen_platform');
    process.exit(1);
  }

  try {
    // Attempt connection
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // wait 10 seconds before timing out
      connectTimeoutMS: 10000,         // wait 10 seconds to connect
    });

    // Print success message with details
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  ✅  MongoDB Connected Successfully');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  📦  Database : ${conn.connection.name}`);
    console.log(`  🖥️  Host     : ${conn.connection.host}`);
    console.log(`  🔌  Port     : ${conn.connection.port}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

  } catch (error: any) {
    console.error('');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('  ❌  MongoDB Connection FAILED');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Help the user based on what the error actually is
    if (error.message.includes('ECONNREFUSED') || error.message.includes('serverSelectionTimeout')) {
      console.error('  📌  Reason : MongoDB server is not running');
      console.error('');
      console.error('  🔧  Fix (Local MongoDB on Windows):');
      console.error('      1. Press Windows key → search "MongoDB"');
      console.error('      2. Click "MongoDB Server" → Start');
      console.error('      OR run this in a new terminal:');
      console.error('         mongod');
      console.error('');
      console.error('  🔧  Fix (MongoDB Atlas / Cloud):');
      console.error('      1. Go to https://www.mongodb.com/cloud/atlas');
      console.error('      2. Check your MONGODB_URI in .env is correct');
      console.error('      3. Make sure your IP is whitelisted in Atlas');
    } else if (error.message.includes('authentication')) {
      console.error('  📌  Reason : Wrong username or password');
      console.error('  🔧  Fix   : Check your MONGODB_URI in .env file');
    } else {
      console.error(`  📌  Error  : ${error.message}`);
    }

    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('');
    process.exit(1);
  }
};

export default connectDB;