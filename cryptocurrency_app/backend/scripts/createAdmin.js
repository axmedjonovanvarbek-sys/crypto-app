require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const [, , email, password, ...nameParts] = process.argv;
const name = nameParts.join(' ') || 'Admin';

const run = async () => {
  if (!email || !password) {
    console.error('Usage: npm run create-admin -- <email> <password> [name]');
    process.exit(1);
  }

  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    existingUser.role = 'admin';
    await existingUser.save();
    console.log(`Admin role assigned to ${normalizedEmail}`);
  } else {
    await User.create({
      name,
      email: normalizedEmail,
      password,
      role: 'admin',
    });
    console.log(`Admin user created: ${normalizedEmail}`);
  }

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error(error.message);
  await mongoose.connection.close();
  process.exit(1);
});
