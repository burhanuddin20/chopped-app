const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/analyze', (req, res) => {
  // Mock response for testing
  res.json({
    score: 75,
    breakdown: {
      face: 18,
      hair: 16,
      skin: 15,
      style: 13,
      body: 13
    },
    suggestions: {
      face: "Great facial features! Consider different lighting angles.",
      hair: "Your hair style suits you well. A trim could enhance it further.",
      skin: "Good skin condition. A moisturizer could add extra glow.",
      style: "Nice style choices. Experiment with different fits.",
      body: "Good posture! Standing tall makes a big difference."
    }
  });
});

app.listen(PORT, () => {
  console.log(`Simple test server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});