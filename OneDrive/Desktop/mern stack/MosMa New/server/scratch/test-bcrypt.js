// Scratch script to test bcryptjs
import bcrypt from 'bcryptjs';

const test = async () => {
  try {
    console.log('Testing bcryptjs...');
    const salt = await bcrypt.genSalt(12);
    console.log('Salt generated:', salt);
    const hash = await bcrypt.hash('password123', salt);
    console.log('Hash generated:', hash);
    const match = await bcrypt.compare('password123', hash);
    console.log('Compare works:', match);
  } catch (err) {
    console.error('Bcrypt test failed:', err);
  }
};

test();
