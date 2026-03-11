// server.js
// Entry point for the Event Planner API (Day 5 - Authentication added)
// This file starts the Express app and mounts your routes.

// Load environment variables from .env FIRST (before other requires that
// need process.env values, e.g. JWT_SECRET).
require('dotenv').config();

const express = require('express');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parse JSON request bodies
app.use(express.json());

// Health check / root route
app.get('/', (req, res) => {
  res.json({
    message: 'Event Planner API is running',
    endpoints: {
      login: 'POST /login',
      allEvents: 'GET /events',
      eventById: 'GET /events/:id',
      createEvent: 'POST /events  (requires JWT)',
      updateEvent: 'PUT /events/:id  (requires JWT)',
      deleteEvent: 'DELETE /events/:id  (requires JWT)',
    },
  });
});

// Mount authentication routes (public - no JWT needed to reach /login)
app.use('/', authRoutes);

// Mount event routes at /events (Day 2+)
app.use('/events', eventRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Event Planner API running at http://localhost:${PORT}`);
});
