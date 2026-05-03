const bcrypt = require('bcryptjs');
const eventModel = require('../features/events/events.model');
const userModel = require('../features/auth/auth.model');

const testEvents = [
  {
    id: 1,
    name: 'Test Event 1',
    date: '2025-01-01',
    location: 'Test Location 1',
    description: 'Description 1',
  },
  {
    id: 2,
    name: 'Test Event 2',
    date: '2025-02-02',
    location: 'Test Location 2',
    description: 'Description 2',
  },
  {
    id: 3,
    name: 'Test Event 3',
    date: '2025-03-03',
    location: 'Test Location 3',
    description: 'Description 3',
  },
];

const testUsers = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('password123', 10),
  },
  {
    id: 2,
    username: 'user',
    password: bcrypt.hashSync('user123', 10),
  },
];

function resetTestData() {
  eventModel.events.length = 0;
  userModel.users.length = 0;

  testEvents.forEach((e) => eventModel.events.push({ ...e }));
  testUsers.forEach((u) => userModel.users.push({ ...u }));
}

module.exports = {
  testEvents,
  testUsers,
  resetTestData,
};
