// models/SRSQueue.js
const mongoose = require("mongoose");

const srsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  wordId: { type: mongoose.Schema.Types.ObjectId, ref: "Word", required: true },

  interval: { type: Number, default: 1 }, // days
  nextReview: { type: Date, default: Date.now() },
  easiness: { type: Number, default: 2.5 }, // SM2
  repetitions: { type: Number, default: 0 },
});

module.exports = mongoose.model("SRSQueue", srsSchema);
