const bcrypt = require('bcryptjs');
const { loadJsonFile, saveJsonFile, persistEnabled } = require('../../shared/jsonPersistence');

const USERS_FILE = 'users.json';

const SEED_USERS = [
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

const users = [];

function persistUsers() {
  saveJsonFile(USERS_FILE, users);
}

function bootstrapUsers() {
  if (!persistEnabled()) {
    SEED_USERS.forEach((u) => users.push({ ...u }));
    return;
  }
  const loaded = loadJsonFile(USERS_FILE, null);
  if (Array.isArray(loaded) && loaded.length > 0) {
    users.push(...loaded);
  } else {
    SEED_USERS.forEach((u) => users.push({ ...u }));
    persistUsers();
  }
}

bootstrapUsers();

function findUserByUsername(username) {
  return users.find((u) => u.username === username);
}

function findUserById(id) {
  return users.find((u) => u.id === id);
}

function addUser(username, password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return reject(err);

      const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newUser = {
        id: newId,
        username,
        password: hashedPassword,
      };

      users.push(newUser);
      persistUsers();
      resolve(newUser);
    });
  });
}

module.exports = {
  users,
  findUserByUsername,
  findUserById,
  addUser,
};
