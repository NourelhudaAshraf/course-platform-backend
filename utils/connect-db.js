const mongoose = require("mongoose");
const env = require("../config/env");
const connectDB = async () => {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
