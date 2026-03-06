// server.js
// Entry point for the Event Planner API (Day 1 - basic setup)
// This file starts the Express app and mounts your routes.

const express = require('express');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: parse JSON request bodies
app.use(express.json());

// Health check / root route
app.get('/', (req, res) => {
  res.json({
    message: 'Event Planner API is running',
    endpoints: {
      events: '/api/events',
      eventById: '/api/events/:id',
    },
  });
});

// Mount event routes under /api/events
app.use('/api/events', eventRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Event Planner API running at http://localhost:${PORT}`);
});
