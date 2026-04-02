import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Role from './models/Role.js';
import Transaction from './models/Transaction.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    console.log('Wiping database...');
    // Full wipe
    await Transaction.deleteMany({});
    await User.deleteMany({});
    await Role.deleteMany({});

    console.log('Creating roles...');
    const roles = await Role.insertMany([
      { name: 'viewer', permissions: ['read_analytics'] },
      { name: 'analyst', permissions: ['read_analytics', 'read_transactions'] },
      { name: 'admin', permissions: ['read_analytics', 'read_transactions', 'write_transactions', 'delete_transactions', 'manage_users'] }
    ]);

    const adminRole = roles.find(r => r.name === 'admin');

    console.log('Creating root admin...');
    await User.create({
      name: 'Admin User',
      email: 'admin@finance.com',
      password: 'admin123',
      role: adminRole._id,
      status: 'active'
    });

    console.log('Admin user seeded successfully. Email: admin@finance.com, Password: admin123');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
