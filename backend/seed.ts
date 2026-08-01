import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User, UserRole, AuthProvider } from './src/models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cs-insights';
const SEED_ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@csinsights.test';
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'securepassword123';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database for seeding...');

    const existingAdmin = await User.findOne({ email: SEED_ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(SEED_ADMIN_PASSWORD, salt);

    await User.create({
      name: 'Super Admin',
      email: SEED_ADMIN_EMAIL,
      passwordHash,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.AUTHOR, UserRole.READER],
      authProviders: [AuthProvider.LOCAL],
    });

    console.log('Super Admin created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
