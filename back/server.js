const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const chatRoutes = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// API routes
app.use("/api/chat", chatRoutes);

// Default route
app.get("/", (req, res) => res.send("FunChat backend running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
