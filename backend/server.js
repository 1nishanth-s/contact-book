const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const contactRoutes = require("./routes/ContactRoutes");

const app = express();
const port = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("Backend startup failed: MONGO_URI is not configured.");
  process.exit(1);
}

// Middleware
const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://contact-book-pink.vercel.app",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
  })
);
app.use(express.json());

// Routes
app.use("/api/contacts", contactRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Contact Book API is running");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Backend startup failed: MongoDB connection failed:", error.message);
    process.exitCode = 1;
  });