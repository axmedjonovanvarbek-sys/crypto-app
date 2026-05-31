require('dotenv').config();
const mongoose = require('mongoose');

console.log('URI:', process.env.MONGO_URI); // ← MONGO_URI

mongoose.connect(process.env.MONGO_URI) // ← MONGO_URI
  .then(() => {
    console.log('✅ MongoDB ga ulandi!');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ Xato:', err.message);
    process.exit(1);
  });