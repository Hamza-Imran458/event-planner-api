// routes/eventRoutes.js
// Defines URL routes for event resources (updated Day 4 - PUT + DELETE).

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// GET /events - return all events (200 + JSON array)
router.get('/', eventController.getEvents);

// POST /events - create a new event (201 + new event object)
router.post('/', eventController.createEvent);

// GET /events/:id - return single event by id (200 + object, or 404)
router.get('/:id', eventController.getEventById);

// PUT /events/:id - update an event by id (200 + updated object, 400, or 404)
router.put('/:id', eventController.updateEvent);

// DELETE /events/:id - remove an event by id (200 + message, or 404)
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
