// routes/learning.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Word = require("../models/Word");
const Lesson = require("../models/Lesson");

// ------------------ STUB ------------------
async function simpleGrammarCheck(sentence) {
  // simple stub for demo; replace with AI/rules if needed
  return { summary: "Looks good!" };
}

// ------------------ /sentence/check ------------------
router.post("/sentence/check", async (req, res) => {
  try {
    const { userId, sentence } = req.body;
    if (!userId || !sentence)
      return res.status(400).json({ error: "userId & sentence required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // tokenize
    const tokens = sentence
      .toLowerCase()
      .replace(/[^\w\s'-]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    const core3000Set = global.core3000Set || new Set();
    const userVocabSet = new Set(
      (user.userVocab || []).map((v) => v.word.toLowerCase())
    );
    const learnedSet = new Set(
      (user.learnedWords || []).map((w) => w.word.toLowerCase())
    );

    const unknown = [],
      known = [],
      usedTargets = [];
    for (const tok of tokens) {
      if (
        core3000Set.has(tok) ||
        userVocabSet.has(tok) ||
        learnedSet.has(tok)
      ) {
        known.push(tok);
        if (learnedSet.has(tok)) usedTargets.push(tok);
      } else {
        unknown.push(tok);
      }
    }

    const grammarFeedback = await simpleGrammarCheck(sentence);

    // For demo, no SRS updates here
    res.json({ unknown, known, usedTargets, srsUpdates: [], grammarFeedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// ------------------ /vocab/add ------------------
router.post("/vocab/add", async (req, res) => {
  try {
    const { userId, words } = req.body;
    if (!userId || !Array.isArray(words))
      return res.status(400).json({ error: "userId and words[] required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const now = new Date();
    let addedCount = 0;

    for (const w of words) {
      const lower = w.toLowerCase();
      if (!(user.userVocab || []).some((v) => v.word.toLowerCase() === lower)) {
        user.userVocab.push({ word: lower, addedAt: now });
        addedCount++;
      }
    }

    await user.save();
    res.json({ ok: true, added: addedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// ------------------ /lessons/generate ------------------
router.post("/lessons/generate", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    // For demo: generate dummy lesson
    const lesson = {
      userId,
      date: new Date(),
      items: ["apple", "banana", "cat", "dog"],
    };

    res.json({ lesson });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "generation failed" });
  }
});

// ------------------ /lessons/today ------------------
router.get("/lessons/today", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lesson = await Lesson.findOne({ userId, date: { $gte: today } });
    res.json({ lesson });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
