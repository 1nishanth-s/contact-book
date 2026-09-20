const express = require("express");
const cors = require("cors");
require("dotenv").config();

const contactRoutes = require("./routes/ContactRoutes");

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use("/api/contacts", contactRoutes);

app.get("/", (req, res) => {
  res.send("Contact Book API is running");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});