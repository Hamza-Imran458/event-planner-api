// models/userModel.js
// In-memory user store for the Event Planner API (Day 5 - Authentication).
//
// Passwords are pre-hashed with bcrypt (cost factor 10) so we never store
// plain-text credentials — even in a demo / in-memory setup.
//
// How the hashes were generated (for reference):
//   const bcrypt = require('bcryptjs');
//   bcrypt.hashSync('password123', 10)  →  hash for admin
//   bcrypt.hashSync('user123',     10)  →  hash for user

const bcrypt = require('bcryptjs');

// ---------------------------------------------------------------------------
// In-memory "database" of users
// ---------------------------------------------------------------------------
// Passwords are hashed synchronously at startup so the hashes are always
// valid for the current bcrypt version installed.
const users = [
    {
        id: 1,
        username: 'admin',
        // plain-text: password123
        password: bcrypt.hashSync('password123', 10),
    },
    {
        id: 2,
        username: 'user',
        // plain-text: user123
        password: bcrypt.hashSync('user123', 10),
    },
];

// ---------------------------------------------------------------------------
// Model helper functions
// ---------------------------------------------------------------------------

/**
 * Find a user by their username (case-sensitive).
 * Returns the user object (including hashed password) or undefined.
 */
function findUserByUsername(username) {
    return users.find((u) => u.username === username);
}

/**
 * Find a user by their numeric id.
 * Returns the user object or undefined.
 */
function findUserById(id) {
    return users.find((u) => u.id === id);
}

/**
 * Add a new user to the in-memory array.
 * Password will be hashed before storing.
 */
function addUser(username, password) {
    // Generate a new sequential ID based on the highest existing ID
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    
    // Hash the plain-text password
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const newUser = {
        id: newId,
        username: username,
        password: hashedPassword,
    };
    
    users.push(newUser);
    return newUser;
}

module.exports = {
    users,
    findUserByUsername,
    findUserById,
    addUser,
};
