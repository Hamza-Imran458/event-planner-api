// routes/eventRoutes.js
// Defines URL routes for event resources (Day 2 - GET endpoints).

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// GET /events - return all events (200 + JSON array)
router.get('/', eventController.getEvents);

// GET /events/:id - return single event by id (200 + object, or 404)
router.get('/:id', eventController.getEventById);

module.exports = router;
