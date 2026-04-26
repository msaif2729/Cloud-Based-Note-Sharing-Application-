const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: "*", // for now (later restrict to your Vercel URL)
  credentials: true
}));
app.use(express.json());


//Routes
app.use("/api/files", require("./routes/fileRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;