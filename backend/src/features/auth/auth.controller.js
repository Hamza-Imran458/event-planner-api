const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByUsername, addUser, updatePassword } = require('./auth.model');

async function login(req, res) {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for: ${username}`);

    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'Username is required' });
    }
    if (!password || password.trim() === '') {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = findUserByUsername(username.trim());

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

    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        message: 'Username must be at least 3 characters long',
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    const existingUser = findUserByUsername(username.trim());
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const newUser = await addUser(username.trim(), password);

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (err) {
    console.error('Error in register:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function forgotPassword(req, res) {
  try {
    const { username, newPassword } = req.body;

    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'Username is required' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = findUserByUsername(username.trim());
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await updatePassword(username.trim(), newPassword);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error in forgotPassword:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { login, register, forgotPassword };
