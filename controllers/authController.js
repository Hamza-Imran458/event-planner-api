// controllers/authController.js
// Handles authentication logic for the Event Planner API (Day 5).
//
// POST /login
//   Body : { username, password }
//   200  : { token: "<jwt>" }
//   400  : { message: "Username and password are required" }
//   401  : { message: "Invalid credentials" }

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByUsername } = require('../models/userModel');

/**
 * POST /login
 * Validates username + password, then returns a signed JWT on success.
 */
function login(req, res) {
    try {
        const { username, password } = req.body;

        // ── 1. Basic input validation ───────────────────────────────────────────
        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required',
            });
        }

        // ── 2. Look up the user ─────────────────────────────────────────────────
        const user = findUserByUsername(username);

        if (!user) {
            // Return the same generic message to prevent username enumeration
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // ── 3. Verify the password ──────────────────────────────────────────────
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // ── 4. Create and sign the JWT ──────────────────────────────────────────
        // Payload includes only non-sensitive fields (never include the password!)
        const payload = {
            id: user.id,
            username: user.username,
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,   // loaded from .env via dotenv
            { expiresIn: '1h' }       // token expires in 1 hour
        );

        // ── 5. Return the token ─────────────────────────────────────────────────
        return res.status(200).json({ token });

    } catch (err) {
        console.error('Error in login:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { login };
