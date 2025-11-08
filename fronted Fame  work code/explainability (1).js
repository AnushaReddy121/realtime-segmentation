 const express = require('express');
const http = require('http');
gconst socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const Segmenter = require('./segmenter');
const Explainability = require('./explainability');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] } });

app.use(cors());
app.use(bodyParser.json());

const segmenter = new Segmenter();
const explainer = new Explainability();
let metrics = {};

// Simulate event stream (for demo; in prod, use Kafka/Redis)
setInterval(() => {
  // Mock events for users 1-5
  for (let userId = 1; userId <= 5; userId++) {
    const mockEvent = {
      userId,
      type: ['click', 'view', 'transaction'][Math.floor(Math.random() * 3)],
      item: 'product' + Math.floor(Math.random() * 10)
    };
    processEvent(mockEvent);
  }
  broadcastUpdates();
}, 5000); // Every 5s

function processEvent(event) {
  const features = segmenter.extractFeatures(event.userId, event);
  const segmentId = segmenter.assignAndUpdate(event.userId, features);
  if (segmenter.detectDrift()) {
    console.log('Drift detected! Adapting segments.');
  }
  metrics = {
    purity: segmenter.getPurity(),
    stability: segmenter.getStability(),
    latency: segmenter.getLatency(),
    interpretability: explainer.getInterpretability(),
    kpis: explainer.getKPIs(),
    audit: explainer.getAuditLog()
  };
}

function broadcastUpdates() {
  const segments = segmenter.getSegments();
  io.emit('segmentsUpdate', { segments, metrics });
}

// API endpoint for manual events (for testing)
app.post('/events', (req, res) => {
  processEvent(req.body);
  res.json({ status: 'Event processed', segment: segmenter.assignments.get(req.body.userId) });
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('initialData', { segments: segmenter.getSegments(), metrics });
});

server.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
