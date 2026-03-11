// controllers/eventController.js
// Handles HTTP logic for event endpoints (updated Day 4 - PUT + DELETE).

const { getAllEvents, getEventById, addEvent, updateEvent, deleteEvent } = require('../models/eventModel');

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

/**
 * PUT /events/:id - Update an EXISTING event (partial update supported).
 * Accepts any combination of: name, date, location, description.
 * Returns 200 with updated event, 400 if no valid fields given, 404 if not found.
 */
function updateEventHandler(req, res) {
  try {
    const { id } = req.params;
    const { name, date, location, description } = req.body;

    // Check at least one field was provided
    const hasFields = [name, date, location, description].some(
      (v) => v !== undefined
    );
    if (!hasFields) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const updated = updateEvent(id, { name, date, location, description });

    if (!updated) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error in updateEvent:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * DELETE /events/:id - Remove an event by ID.
 * Returns 200 with success message, 404 if not found.
 */
function deleteEventHandler(req, res) {
  try {
    const { id } = req.params;
    const deleted = deleteEvent(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error in deleteEvent:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getEvents,
  getEventById: getEventByIdHandler,
  createEvent,
  updateEvent: updateEventHandler,
  deleteEvent: deleteEventHandler,
};
