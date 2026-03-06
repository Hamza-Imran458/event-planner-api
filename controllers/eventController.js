// controllers/eventController.js
// Handles HTTP logic for event endpoints (Day 1 - basic get all / get by id).

const {
  getAllEvents,
  getEventById,
} = require('../models/eventModel');

// GET /api/events - list all events
function getEvents(req, res) {
  const events = getAllEvents();
  res.json(events);
}

// GET /api/events/:id - get one event by id
function getEvent(req, res) {
  const event = getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(event);
}

// Placeholder for later days (create, update, delete)
// function createEvent(req, res) { ... }
// function updateEvent(req, res) { ... }
// function deleteEvent(req, res) { ... }

module.exports = {
  getEvents,
  getEvent,
};
