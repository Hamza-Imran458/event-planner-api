// routes/eventRoutes.js
// Defines URL routes for event resources (updated Day 5 - Authentication).
//
// Public routes  (no token needed): GET /events, GET /events/:id
// Protected routes (JWT required) : POST, PUT, DELETE /events

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

// ── Public routes ───────────────────────────────────────────────────────────
// Anyone can READ events without a token.

// GET /events - return all events (200 + JSON array)
router.get('/', eventController.getEvents);

// GET /events/:id - return single event by id (200 + object, or 404)
router.get('/:id', eventController.getEventById);

// ── Protected routes (require valid JWT) ────────────────────────────────────
// Pass `auth` as the second argument; it runs before the controller function.

// POST /events - create a new event (201 + new event object)
router.post('/', auth, eventController.createEvent);

// PUT /events/:id - update an event by id (200 + updated object, 400, or 404)
router.put('/:id', auth, eventController.updateEvent);

// DELETE /events/:id - remove an event by id (200 + message, or 404)
router.delete('/:id', auth, eventController.deleteEvent);

module.exports = router;
