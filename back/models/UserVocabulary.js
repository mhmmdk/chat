// models/UserVocabulary.js
const mongoose = require("mongoose");

const vocabSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  wordId: { type: mongoose.Schema.Types.ObjectId, ref: "Word", required: true },

  // how well user knows it
  mastery: { type: Number, default: 0 }, // 0–100

  // when first learned
  learnedAt: { type: Date, default: Date.now },

  // used in sentence by user
  usedInSentence: { type: Boolean, default: false },
});

module.exports = mongoose.model("UserVocabulary", vocabSchema);
