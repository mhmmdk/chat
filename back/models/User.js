// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  nativeLanguage: { type: String, default: "om" }, // "om" = Oromo
  level: { type: Number, default: 1 }, // beginner
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
