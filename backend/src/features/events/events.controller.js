const {
  getAllEvents,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent,
} = require('./events.model');

function getEvents(req, res) {
  try {
    const events = getAllEvents();
    res.status(200).json(events);
  } catch (err) {
    console.error('Error in getEvents:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

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

function createEvent(req, res) {
  try {
    const { name, date, location, description } = req.body;

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

function updateEventHandler(req, res) {
  try {
    const { id } = req.params;
    const { name, date, location, description } = req.body;

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
