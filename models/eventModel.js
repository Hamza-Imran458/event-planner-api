// models/eventModel.js
// In-memory storage for events (Day 1 - no database).
// Each event has: id, name, date, location, description.
// Updated Day 4: added updateEvent and deleteEvent.

let nextId = 4;

const events = [
  {
    id: 1,
    name: "Sam's Birthday Bash",
    date: "2025-06-15",
    location: "The Golden Hall",
    description: "A party with a magician and a bouncy castle!",
  },
  {
    id: 2,
    name: "Tech Meetup 2025",
    date: "2025-07-20",
    location: "Downtown Conference Center",
    description: "Monthly meetup for developers and tech enthusiasts.",
  },
  {
    id: 3,
    name: "Summer BBQ",
    date: "2025-08-01",
    location: "Riverside Park",
    description: "Family-friendly BBQ with games and live music.",
  },
];

// Export the array and a way to get the next id for creating new events later
function getAllEvents() {
  return events;
}

function getEventById(id) {
  const numericId = parseInt(id, 10);
  return events.find((e) => e.id === numericId);
}

function getNextId() {
  return nextId++;
}

function addEvent(event) {
  const newEvent = { id: getNextId(), ...event };
  events.push(newEvent);
  return newEvent;
}

/**
 * Update an existing event by ID.
 * Only the fields provided in `fields` are overwritten (partial update).
 * Returns the updated event, or null if not found.
 */
function updateEvent(id, fields) {
  const numericId = parseInt(id, 10);
  const event = events.find((e) => e.id === numericId);
  if (!event) return null;

  // Merge only the allowed fields (ignore unknown keys and id)
  const allowed = ['name', 'date', 'location', 'description'];
  allowed.forEach((key) => {
    if (fields[key] !== undefined) {
      event[key] = fields[key];
    }
  });

  return event;
}

/**
 * Delete an event by ID.
 * Returns the deleted event object, or null if not found.
 */
function deleteEvent(id) {
  const numericId = parseInt(id, 10);
  const index = events.findIndex((e) => e.id === numericId);
  if (index === -1) return null;

  const [deleted] = events.splice(index, 1);
  return deleted;
}

module.exports = {
  events,
  getAllEvents,
  getEventById,
  getNextId,
  addEvent,
  updateEvent,
  deleteEvent,
};
