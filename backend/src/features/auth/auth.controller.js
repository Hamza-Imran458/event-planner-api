const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByUsername, addUser } = require('./auth.model');

async function login(req, res) {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for: ${username}`);

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      });
    }

    const user = findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      id: user.id,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Error in login:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      });
    }

    const existingUser = findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const newUser = await addUser(username, password);

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (err) {
    console.error('Error in register:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { login, register };
