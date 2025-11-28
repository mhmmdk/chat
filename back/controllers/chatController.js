const Message = require("../models/message");
const sanitize = require("../utils/sanitize");

// In-memory store for demo purposes
let messages = [
  { id: 1, user: "system", text: "Welcome to FunChat!", time: "09:00" },
];

exports.getMessages = (req, res) => {
  res.json(messages);
};

exports.sendMessage = (req, res) => {
  const { user, text } = req.body;
  if (!text || !user) return res.status(400).json({ error: "Invalid data" });

  const newMsg = {
    id: messages.length + 1,
    user,
    text: sanitize(text),
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  messages.push(newMsg);
  res.json(newMsg);
};
