// routes/authRoutes.js
// Defines authentication routes for the Event Planner API (Day 5).

const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// POST /login - authenticate a user and receive a JWT
router.post('/login', login);

module.exports = router;
