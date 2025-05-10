// index.ts
import express from "express";
import { Request, Response } from "express";
import { configDotenv } from "dotenv";
import { publishMessage, subscribeToChannel } from "./config/redis";

configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON requests

// Root route
app.get("/", (_req, res) => {
  res.send("Hello from Bun + Express!");
});

// Pub/Sub routes



// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
