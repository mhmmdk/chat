// models/UserProgress.js
const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  todayWords: [{ type: mongoose.Schema.Types.ObjectId, ref: "Word" }],
  reviewWords: [{ type: mongoose.Schema.Types.ObjectId, ref: "Word" }],

  streak: { type: Number, default: 0 },
  lastSeen: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserProgress", progressSchema);
