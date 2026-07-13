const express = require('express');
const router = express.Router();
const data = require('../data');

// Middleware to mock authentication via Bearer Token (where token is user's email)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  const email = authHeader.split(' ')[1];
  const user = data.users.find(u => u.email === email);
  req.user = user || null;
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
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Syntactic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Semantic check - search user
  const user = data.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials. Password or email is incorrect.' });
  }

  // Success - return user and email as token
  res.json({
    token: email,
    user
  });
});

// POST Register
router.post('/register', (req, res) => {
  const { name, email, password, role, institutionName } = req.body;

  // Syntactic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required fields.' });
  }

  // Email format regex check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address format.' });
  }

  // Password length syntactic validation
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  // Role validation
  const validRoles = ['student', 'faculty', 'admin', 'college_rep'];
  const userRole = role || 'student';
  if (!validRoles.includes(userRole)) {
    return res.status(400).json({ message: 'Invalid user role specified.' });
  }

  // Semantic validation - Check duplicate email
  const existingUser = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered. Please sign in instead.' });
  }

  // Faculty specific verification
  if (userRole === 'faculty' && !institutionName) {
    return res.status(400).json({ message: 'Faculty registration requires specifying your Institution Name.' });
  }

  // Create new user record
  const newUser = {
    id: 'user-' + Date.now(),
    name,
    email,
    password,
    role: userRole,
    institutionName: institutionName || ''
  };

  data.users.push(newUser);

  res.status(201).json({
    token: email,
    user: newUser
  });
});

module.exports = {
  router,
  authMiddleware
};
