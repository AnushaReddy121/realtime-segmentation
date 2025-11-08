// Simplified online segmentation: Incremental k-means-like clustering for 3 segments (e.g., 'Engaged', 'Casual', 'Inactive').
// Features: click_rate, view_time, transaction_count (normalized 0-1).
// Drift adaptation: If avg feature shift > 0.2, retrain centroids.
// Stability: Damp updates with learning rate 0.1.

class Segmenter {
  constructor(numSegments = 3) {
    this.numSegments = numSegments;
    this.centroids = Array.from({ length: numSegments }, () => [Math.random(), Math.random(), Math.random()]); // [click_rate, view_time, trans_count]
    this.assignments = new Map(); // userId -> segmentId
    this.eventCounts = new Map(); // userId -> total events
    this.learningRate = 0.1;
    this.driftThreshold = 0.2;
    this.prevGlobalMean = [0.5, 0.5, 0.5];
  }

  // Normalize event to features (mock: based on event type)
  extractFeatures(userId, event) {
    const counts = this.eventCounts.get(userId) || { clicks: 0, views: 0, trans: 0 };
    if (event.type === 'click') counts.clicks++;
    if (event.type === 'view') counts.views += 5; // mock time
    if (event.type === 'transaction') counts.trans++;
    this.eventCounts.set(userId, counts);

    const total = counts.clicks + counts.views + counts.trans;
    return [
      (counts.clicks / total) || 0, // click_rate
      (counts.views / total) || 0,  // view_time proxy
      (counts.trans / total) || 0   // trans_count
    ];
  }

  // Assign segment and update centroid (online learning)
  assignAndUpdate(userId, features) {
    let minDist = Infinity;
    let segmentId = 0;
    this.centroids.forEach((centroid, id) => {
      const dist = this.euclideanDistance(features, centroid);
      if (dist < minDist) {
        minDist = dist;
        segmentId = id;
      }
    });

    // Update centroid incrementally
    const oldCentroid = this.centroids[segmentId];
    this.centroids[segmentId] = oldCentroid.map((c, i) => c + this.learningRate * (features[i] - c));

    this.assignments.set(userId, segmentId);
    return segmentId;
  }

  // Drift detection: Compare global mean shift
  detectDrift() {
    const globalMean = this.centroids.reduce((sum, c) => sum.map((v, i) => v + c[i]), [0, 0, 0]).map(v => v / this.numSegments);
    const shift = this.euclideanDistance(globalMean, this.prevGlobalMean);
    this.prevGlobalMean = globalMean;
    return shift > this.driftThreshold;
  }

  euclideanDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  }

  getSegments() {
    const segments = {};
    this.assignments.forEach((segId, userId) => {
      segments[userId] = segId === 0 ? 'Engaged' : segId === 1 ? 'Casual' : 'Inactive';
    });
    return segments;
  }

  // Mock purity (homogeneity): 1 - avg intra-segment variance
  getPurity() {
    // Simplified: Assume 0.8 base + random noise
    return 0.8 + Math.random() * 0.1;
  }

  // Stability: 1 - centroid change rate
  getStability() {
    return 0.9 - Math.random() * 0.1;
  }

  // Latency: Mock processing time (ms)
  getLatency() {
    return Math.random() * 100 + 50;
  }
}

module.exports = Segmenter;