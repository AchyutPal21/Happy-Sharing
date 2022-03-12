// Module Imports
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env",
});

// Connecting the database
const DB = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

function connectDB() {
  mongoose.connect(DB).then((connection) => {
    console.log("MongoDB Connection is successful");
  });
}

module.exports = connectDB;
