const mongoose = require('mongoose');
require('dotenv').config();
const { User, UserRole, AuthProvider } = require('./src/models/User');

const emailToPromote = 'ssaiprasanth333@gmail.com';
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cs-insights";

async function makeAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    let user = await User.findOne({ email: emailToPromote });

    if (!user) {
      console.log(`User ${emailToPromote} not found. Creating user...`);
      // Since password hashing logic is in auth controller (which is compiled),
      // we'll just create a dummy account. It's better if the user registers first.
      user = new User({
        name: 'Admin User',
        email: emailToPromote,
        passwordHash: 'dummyhash', // In reality, they should register from UI first, or we use bcrypt here
        roles: ['ADMIN'],
        authProviders: ['LOCAL'],
        status: 'ACTIVE'
      });
      await user.save();
      console.log(`User ${emailToPromote} created as ADMIN.`);
    } else {
      console.log(`User ${emailToPromote} found. Updating roles...`);
      if (!user.roles.includes('ADMIN')) {
        user.roles.push('ADMIN');
        await user.save();
        console.log(`Successfully promoted ${emailToPromote} to ADMIN.`);
      } else {
        console.log(`User ${emailToPromote} is already an ADMIN.`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

makeAdmin();
