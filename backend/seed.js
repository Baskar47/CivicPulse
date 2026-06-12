/**
 * Seed Script - Creates default admin user
 * Run: node seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  phone: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create admin
    const adminExists = await User.findOne({ email: 'admin@civic.com' });
    if (!adminExists) {
      const hashed = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@civic.com',
        password: hashed,
        role: 'admin',
        phone: '+91 99999 00000'
      });
      console.log('✅ Admin created: admin@civic.com / admin123');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    // Create demo user
    const userExists = await User.findOne({ email: 'user@civic.com' });
    if (!userExists) {
      const hashed = await bcrypt.hash('user123', 10);
      await User.create({
        name: 'Demo Citizen',
        email: 'user@civic.com',
        password: hashed,
        role: 'user',
        phone: '+91 98765 43210'
      });
      console.log('✅ Demo user created: user@civic.com / user123');
    } else {
      console.log('ℹ️  Demo user already exists');
    }

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
