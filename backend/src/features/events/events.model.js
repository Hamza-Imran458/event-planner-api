const { loadJsonFile, saveJsonFile, persistEnabled } = require('../../shared/jsonPersistence');

const EVENTS_FILE = 'events.json';

const SEED_EVENTS = [
  {
    id: 1,
    userId: 1,
    name: "Sam's Birthday Bash",
    date: '2025-06-15',
    time: '18:00',
    location: 'The Golden Hall',
    description: 'A party with a magician and a bouncy castle!',
  },
  {
    id: 2,
    userId: 2,
    name: 'Tech Meetup 2025',
    date: '2025-07-20',
    time: '19:30',
    location: 'Downtown Conference Center',
    description: 'Monthly meetup for developers and tech enthusiasts.',
  },
  {
    id: 3,
    userId: 1,
    name: 'Summer BBQ',
    date: '2025-08-01',
    time: '12:00',
    location: 'Riverside Park',
    description: 'Family-friendly BBQ with games and live music.',
  },
];

const events = [];

function persistEvents() {
  saveJsonFile(EVENTS_FILE, events);
}

function bootstrapEvents() {
  if (!persistEnabled()) {
    return;
  }
  const loaded = loadJsonFile(EVENTS_FILE, null);
  if (Array.isArray(loaded) && loaded.length > 0) {
    events.push(...loaded);
  } else {
    SEED_EVENTS.forEach((e) => events.push({ ...e }));
    persistEvents();
  }
}

bootstrapEvents();

function getAllEvents(userId) {
  if (userId) {
    return events.filter((e) => e.userId === userId);
  }
  return events;
}

function getEventById(id, userId) {
  const numericId = parseInt(id, 10);
  const event = events.find((e) => e.id === numericId);
  if (event && userId && event.userId !== userId) {
    return null;
  }
  return event;
}

function getNextId() {
  const maxId = events.reduce((max, e) => {
    const id = Number(e.id);
    return Number.isFinite(id) ? Math.max(max, id) : max;
  }, 0);
  return maxId + 1;
}

function addEvent(event, userId) {
  const newEvent = { id: getNextId(), userId, ...event };
  events.push(newEvent);
  persistEvents();
  return newEvent;
}

function updateEvent(id, fields, userId) {
  const numericId = parseInt(id, 10);
  const event = events.find((e) => e.id === numericId);
  if (!event) return null;
  if (userId && event.userId !== userId) return null;

  const allowed = ['name', 'date', 'time', 'location', 'description'];
  allowed.forEach((key) => {
    if (fields[key] !== undefined) {
      event[key] = fields[key];
    }
  });

  persistEvents();
  return event;
}

function deleteEvent(id, userId) {
  const numericId = parseInt(id, 10);
  const index = events.findIndex((e) => e.id === numericId);
  if (index === -1) return null;
  if (userId && events[index].userId !== userId) return null;

  const [deleted] = events.splice(index, 1);
  persistEvents();
  return deleted;
}

module.exports = {
  events,
  getAllEvents,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent,
};
