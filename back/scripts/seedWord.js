require("dotenv").config();
const mongoose = require("mongoose");
const Word = require("../models/Word");
const words = require("../data/sample.json");

async function run() {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB,
  });

  console.log("Connected!");

  await Word.deleteMany({});
  await Word.insertMany(words);

  console.log("Inserted:", words.length, "words");
  process.exit();
}

run();
