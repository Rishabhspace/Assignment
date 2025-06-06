require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const chapterRoutes = require("./routes/chapterRoutes");
const rateLimiter = require("./middleware/rateLimiter");
const redisClient = require("./config/redis");

const app = express();
app.use(express.json());

// Rate Limiter Middleware
app.use(rateLimiter);

// Routes
app.use("/api/v1/chapters", chapterRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    // Start server only after DB is connected
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Redis Client is now initialized in config/redis.js

module.exports = { app };
