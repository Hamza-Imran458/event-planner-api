// Coursework 2 requirement: citation included for Justin Fletcher (see README).
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const eventRoutes = require('./src/features/events/events.routes');
const authRoutes = require('./src/features/auth/auth.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Manual CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

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

app.use('/', authRoutes);
app.use('/events', eventRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Event Planner API running at http://localhost:${PORT}`);
  });
}

module.exports = app;
