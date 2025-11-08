// backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let metrics = {
  purity: 0.8,
  stability: 0.75,
  latency: 0.5,
  interpretability: 0.9
};

let segments = {
  "Segment A": {
    users: 120,
    behavior: "Frequent buyers",
    explanation: "Driven by discount sensitivity and prior purchases"
  },
  "Segment B": {
    users: 85,
    behavior: "High clickers, low conversion",
    explanation: "Influenced by ad engagement, but low intent"
  },
  "Segment C": {
    users: 60,
    behavior: "New visitors",
    explanation: "Exploring site; no purchase history yet"
  }
};

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);
  socket.emit("initialData", { metrics, segments });

  // Periodically update data
  const interval = setInterval(() => {
    // Randomize metrics
    metrics = {
      purity: Math.random().toFixed(2),
      stability: Math.random().toFixed(2),
      latency: Math.random().toFixed(2),
      interpretability: Math.random().toFixed(2)
    };

    // Simulate small changes to user counts
    Object.keys(segments).forEach(seg => {
      segments[seg].users += Math.floor(Math.random() * 5 - 2);
    });

    socket.emit("segmentsUpdate", { metrics, segments });
  }, 5000);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    clearInterval(interval);
  });
});

server.listen(5000, () => console.log("🚀 Server running on port 5000"));
