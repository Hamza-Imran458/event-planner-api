const bcrypt = require('bcryptjs');

const users = [
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
