const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const chatRoutes = require("./routes/chat");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use("/api/chat", chatRoutes);
const testRoutes = require("./routes/test");
app.use("/api", testRoutes);

// Default route
app.get("/", (req, res) => res.send("FunChat backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
