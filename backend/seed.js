"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./src/models/User");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cs-insights';
const SEED_ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@csinsights.test';
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'securepassword123';
const seedAdmin = async () => {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to database for seeding...');
        const existingAdmin = await User_1.User.findOne({ email: SEED_ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('Admin already exists.');
            process.exit(0);
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(SEED_ADMIN_PASSWORD, salt);
        await User_1.User.create({
            name: 'Super Admin',
            email: SEED_ADMIN_EMAIL,
            passwordHash,
            roles: [User_1.UserRole.SUPER_ADMIN, User_1.UserRole.ADMIN, User_1.UserRole.AUTHOR, User_1.UserRole.READER],
            authProviders: [User_1.AuthProvider.LOCAL],
        });
        console.log('Super Admin created successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};
seedAdmin();
