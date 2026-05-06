const {
  getAllEvents,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent,
} = require('./events.model');

function getEvents(req, res) {
  try {
    const userId = req.user ? req.user.id : null;
    const events = getAllEvents(userId);
    res.status(200).json(events);
  } catch (err) {
    console.error('Error in getEvents:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function getEventByIdHandler(req, res) {
  try {
    const userId = req.user ? req.user.id : null;
    const id = req.params.id;
    const event = getEventById(id, userId);

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
    const { name, date, time, location, description } = req.body;
    const userId = req.user.id;

    // Field validations
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!date || date.trim() === '') {
      return res.status(400).json({ message: 'Date is required' });
    }
    if (!time || String(time).trim() === '') {
      return res.status(400).json({ message: 'Time is required' });
    }
    if (!location || location.trim() === '') {
      return res.status(400).json({ message: 'Location is required' });
    }
    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Description is required' });
    }

    const newEvent = addEvent(
      { name, date, time: String(time).trim(), location, description },
      userId
    );
    
    console.log(`[TERMINAL] Event Created: ID ${newEvent.id} by User ${userId}`);
    
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Error in createEvent:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function updateEventHandler(req, res) {
  try {
    const { id } = req.params;
    const { name, date, time, location, description } = req.body;
    const userId = req.user.id;

    const hasFields = [name, date, time, location, description].some(
      (v) => v !== undefined
    );
    if (!hasFields) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const updated = updateEvent(
      id,
      {
        name,
        date,
        time: time !== undefined ? String(time).trim() : undefined,
        location,
        description,
      },
      userId
    );

    if (!updated) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    console.log(`[TERMINAL] Event Updated: ID ${id} by User ${userId}`);

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error in updateEvent:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function deleteEventHandler(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const deleted = deleteEvent(id, userId);

    if (!deleted) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    console.log(`[TERMINAL] Event Deleted: ID ${id} by User ${userId}`);

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
