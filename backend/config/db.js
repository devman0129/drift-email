require('dotenv').config();
const mongoose = require('mongoose');
const db = process.env.MONGO_URI;

const connectDB = async () => {
  console.log(db);
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
