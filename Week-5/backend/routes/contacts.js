const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const fallbackDb = require('../models/fallbackDb');
const { authMiddleware } = require('./auth');

// GET all contact messages (Admin only)
router.get('/', authMiddleware, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const contacts = await Contact.find({}).sort({ createdAt: -1 });
      res.json(contacts);
    } else {
      res.json(fallbackDb.contacts);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving contact messages.', error: error.message });
  }
});

// POST submit contact message
router.post('/', async (req, res) => {
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

  try {
    const contactData = {
      id: 'contact-' + Date.now(),
      name,
      email: email.toLowerCase(),
      phone,
      message,
      createdAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      const newContact = new Contact(contactData);
      await newContact.save();
    } else {
      fallbackDb.contacts.push(contactData);
    }

    res.status(201).json(contactData);
  } catch (error) {
    res.status(400).json({ message: 'Failed to save message.', error: error.message });
  }
});

module.exports = router;
