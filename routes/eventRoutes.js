// routes/eventRoutes.js
// Defines URL routes for event resources (Day 1 - read-only).

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// GET /api/events - get all events
router.get('/', eventController.getEvents);

// GET /api/events/:id - get one event by id
router.get('/:id', eventController.getEvent);

module.exports = router;
