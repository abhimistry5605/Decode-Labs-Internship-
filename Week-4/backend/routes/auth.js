const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const fallbackDb = require('../models/fallbackDb');

// Middleware to mock authentication via Bearer Token (where token is user's email)
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  const email = authHeader.split(' ')[1];
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase() });
      req.user = user || null;
    } else {
      const user = fallbackDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      req.user = user || null;
    }
  } catch (error) {
    req.user = null;
  }
  next();
};

// GET current profile
router.get('/profile', authMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized - invalid session credentials.' });
  }
  res.json(req.user);
});

// POST Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Syntactic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: email.toLowerCase(), password });
    } else {
      user = fallbackDb.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. Password or email is incorrect.' });
    }

    res.json({
      token: email,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking credentials.', error: error.message });
  }
});

// POST Register
router.post('/register', async (req, res) => {
  const { name, email, password, role, institutionName } = req.body;

  // Syntactic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required fields.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address format.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const validRoles = ['student', 'faculty', 'admin', 'college_rep'];
  const userRole = role || 'student';
  if (!validRoles.includes(userRole)) {
    return res.status(400).json({ message: 'Invalid user role specified.' });
  }

  // Faculty specific verification
  if (userRole === 'faculty' && !institutionName) {
    return res.status(400).json({ message: 'Faculty registration requires specifying your Institution Name.' });
  }

  try {
    // Semantic validation - Check duplicate email
    let existingUser;
    if (mongoose.connection.readyState === 1) {
      existingUser = await User.findOne({ email: email.toLowerCase() });
    } else {
      existingUser = fallbackDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please sign in instead.' });
    }

    const userData = {
      id: 'user-' + Date.now(),
      name,
      email: email.toLowerCase(),
      password,
      role: userRole,
      institutionName: institutionName || ''
    };

    if (mongoose.connection.readyState === 1) {
      const dbUser = new User(userData);
      await dbUser.save();
    } else {
      fallbackDb.users.push(userData);
    }

    res.status(201).json({
      token: email,
      user: userData
    });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed.', error: error.message });
  }
});

module.exports = {
  router,
  authMiddleware
};
