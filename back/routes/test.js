const express = require("express");
const Test = require("../models/Test");
const router = express.Router();

router.get("/pingdb", async (req, res) => {
  try {
    const doc = await Test.create({ message: "Hello DB!" });
    res.json({ ok: true, saved: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
