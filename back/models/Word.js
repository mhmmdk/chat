// models/Word.js
const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  english: { type: String, required: true, unique: true },
  oromo: { type: String, required: true },
  partOfSpeech: String,
  level: Number, // e.g. 1–3000 order
  exampleSentenceEn: String,
  exampleSentenceOm: String,
});

module.exports = mongoose.model("Word", wordSchema);
