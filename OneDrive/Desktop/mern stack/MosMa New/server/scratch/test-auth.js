// Scratch script to test User model pre-save hook and auth logic
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const run = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected.');

    // Attempt to create a test user
    const testEmail = `test_${Date.now()}@test.com`;
    console.log(`Creating test user with email: ${testEmail}...`);
    
    const user = await User.create({
      name: 'Test User',
      email: testEmail,
      password: 'password123',
    });
    
    console.log('✅ User created successfully:', user);
    
    // Test password comparison
    const isMatch = await user.comparePassword('password123');
    console.log('Password comparison match:', isMatch);
    
    // Clean up
    await User.deleteOne({ _id: user._id });
    console.log('Cleanup done.');
  } catch (error) {
    console.error('❌ Error during auth test:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

run();
