// routes/authRoutes.js
// Defines authentication routes for the Event Planner API (Day 5).

const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// POST /login - authenticate a user and receive a JWT
router.post('/login', login);

// POST /register - create a new user
router.post('/register', register);

module.exports = router;
