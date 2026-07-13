const express = require('express');
const router = express.Router();
const data = require('../data');
const { authMiddleware } = require('./auth');

// GET all contact messages (Admin only)
router.get('/', authMiddleware, (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }

  res.json(data.contacts);
});

// POST submit contact message
router.post('/', (req, res) => {
  const { name, email, phone, message } = req.body;

  // Syntactic Validation
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'Name, email, phone, and message are all required fields.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid format. Please supply a valid email address.' });
  }

  if (message.trim().length < 10) {
    return res.status(400).json({ message: 'Semantic Error: Message must be at least 10 characters long to ensure details are complete.' });
  }

  const newContact = {
    id: 'contact-' + Date.now(),
    name,
    email,
    phone,
    message,
    createdAt: new Date().toISOString()
  };

  data.contacts.push(newContact);
  res.status(201).json(newContact);
});

module.exports = router;
