// controllers/eventController.js
// Handles HTTP logic for event endpoints (Day 2 - GET with error handling).

const { getAllEvents, getEventById, addEvent } = require('../models/eventModel');

/**
 * GET /events - Return ALL events from the in-memory array.
 * Returns 200 with JSON array (empty array if no events).
 */
function getEvents(req, res) {
  try {
    const events = getAllEvents();
    res.status(200).json(events);
  } catch (err) {
    console.error('Error in getEvents:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * GET /events/:id - Return a SINGLE event by its ID.
 * Returns 200 with event object if found, 404 with "Event not found" if not.
 */
function getEventByIdHandler(req, res) {
  try {
    const id = req.params.id;
    const event = getEventById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error('Error in getEventById:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * POST /events - Create a NEW event.
 * Expects JSON body: { name, date, location, description }
 * Returns 201 with the newly created event object.
 * Returns 400 if any required field is missing.
 */
function createEvent(req, res) {
  try {
    const { name, date, location, description } = req.body;

    // Validate required fields
    if (!name || !date || !location || !description) {
      return res.status(400).json({
        message: 'All fields are required: name, date, location, description',
      });
    }

    const newEvent = addEvent({ name, date, location, description });
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Error in createEvent:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getEvents,
  getEventById: getEventByIdHandler,
  createEvent,
};
