// routes/chat.js
const express = require("express");
const router = express.Router();

/**
 * messages: in-memory store for demo purposes.
 * Each message = { id, user, text, time, choices? }
 * - choices: optional array of strings for multiple-choice questions
 */
let messages = [
  { id: 1, user: "system", text: "Welcome to FunChat!", time: Date.now() },
];

// Simple helper to push messages with incremental id
let nextId = 2;
function pushMessage(msg) {
  const out = {
    id: nextId++,
    user: msg.user || "system",
    text: msg.text || "",
    time: Date.now(),
  };
  if (msg.choices) out.choices = msg.choices;
  messages.push(out);
  return out;
}

// GET all messages
router.get("/messages", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(messages);
});

// POST a new message from client
// body: { user: "me", text: "some text" }  OR { user: "me", text:"", choice: "A" }
router.post("/messages", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const body = req.body;

  if (!body || !body.user) {
    return res.status(400).json({ error: "Invalid request: missing user" });
  }

  // If the client selected a choice (answering a question)
  if (body.choice) {
    // create a user message that shows their choice
    pushMessage({ user: body.user, text: `Selected: ${body.choice}` });

    // Simple evaluation logic (demo):
    // We'll pretend the last question's correct answer is the last choice in msg.choices
    const lastQuestion = [...messages].reverse().find((m) => m.choices);
    let replyText = "Thanks — answer recorded.";
    if (lastQuestion) {
      // For demo: correct if choice equals last choice text
      const correct = lastQuestion.choices[lastQuestion.choices.length - 1];
      if (String(body.choice).trim() === String(correct).trim()) {
        replyText = "✅ Correct! Well done.";
      } else {
        replyText = `❌ Not quite. The correct answer was: ${correct}`;
      }
    }

    const botMsg = pushMessage({ user: "bot", text: replyText });
    return res.json(botMsg);
  }

  // Normal text message
  if (!body.text || String(body.text).trim() === "") {
    return res.status(400).json({ error: "Message text required" });
  }

  // Save user message
  const userMsg = pushMessage({ user: body.user, text: body.text });

  // Demo bot behavior:
  // If user sends "quiz" or "question", send a multiple-choice question
  const txt = String(body.text).toLowerCase();
  if (txt.includes("quiz") || txt.includes("question") || txt.includes("mcq")) {
    const question = {
      user: "bot",
      text: "What is 2 + 2?",
      choices: ["1", "2", "3", "4"], // last choice "4" is considered correct in our simple evaluator
    };
    const botQuestion = pushMessage(question);
    return res.json(botQuestion);
  }

  // Otherwise, respond with a simple echo/bot reply
  const botReply = pushMessage({
    user: "bot",
    text: `I received: "${body.text}". Send "quiz" to get a multiple-choice question.`,
  });

  return res.json(userMsg); // return the saved user message (client already displayed it)
});

module.exports = router;
