// middleware/auth.js
// JWT authentication middleware for the Event Planner API (Day 5).
//
// Usage in routes:
//   const auth = require('../middleware/auth');
//   router.post('/', auth, createEvent);
//
// Expected request header:
//   Authorization: Bearer <jwt-token>
//
// On success  : attaches decoded token payload to req.user and calls next()
// On failure  : returns 401 { message: "Unauthorized" }

const jwt = require('jsonwebtoken');

/**
 * Verifies the JWT token from the Authorization header.
 * Attaches the decoded user payload to req.user if valid.
 */
function auth(req, res, next) {
    try {
        // ── 1. Read the Authorization header ───────────────────────────────────
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // ── 2. Expect the format: "Bearer <token>" ─────────────────────────────
        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = parts[1];

        // ── 3. Verify the token ─────────────────────────────────────────────────
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ── 4. Attach user info to the request object ───────────────────────────
        req.user = decoded;   // { id, username, iat, exp }

        // ── 5. Pass control to the next middleware / route handler ──────────────
        next();

    } catch (err) {
        // jwt.verify throws if the token is expired, malformed, or has a bad sig
        console.error('Auth middleware error:', err.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = auth;
