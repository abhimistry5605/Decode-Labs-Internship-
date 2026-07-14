const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');
const fallbackDb = require('../models/fallbackDb');
const { authMiddleware } = require('./auth');

// GET all inquiries (Faculty and Admin only)
router.get('/', authMiddleware, async (req, res) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'faculty')) {
    return res.status(403).json({ message: 'Access denied. Only institution representatives or administrators can view inquiries.' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
      res.json(inquiries);
    } else {
      res.json(fallbackDb.inquiries);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inquiries.', error: error.message });
  }
});

// POST register a new inquiry
router.post('/', async (req, res) => {
  const { name, email, phone, institutionName, kitName, quantity, message } = req.body;

  // Syntactic Validation
  if (!name || !email || !phone || !institutionName || !kitName || quantity === undefined) {
    return res.status(400).json({ message: 'All mandatory fields (name, email, phone, institutionName, kitName, and quantity) are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid format. Please supply a valid email address.' });
  }

  const parsedQty = parseInt(quantity);
  if (isNaN(parsedQty)) {
    return res.status(400).json({ message: 'Quantity must be a numeric integer.' });
  }

  // Semantic Validation
  if (parsedQty <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive integer greater than zero.' });
  }

  try {
    // Verify that the requested training kit is part of our products list
    let kitExists;
    if (mongoose.connection.readyState === 1) {
      kitExists = await Product.findOne({ name: { $regex: new RegExp(`^${kitName}$`, 'i') } });
    } else {
      kitExists = fallbackDb.products.some(p => p.name.toLowerCase() === kitName.toLowerCase());
    }

    if (!kitExists) {
      return res.status(400).json({ message: `Semantic Error: The requested kit "${kitName}" is not cataloged in our database.` });
    }

    const inquiryData = {
      id: 'inquiry-' + Date.now(),
      name,
      email: email.toLowerCase(),
      phone,
      institutionName,
      kitName,
      quantity: parsedQty,
      message: message || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      const newInquiry = new Inquiry(inquiryData);
      await newInquiry.save();
    } else {
      fallbackDb.inquiries.push(inquiryData);
    }

    res.status(201).json(inquiryData);
  } catch (error) {
    res.status(400).json({ message: 'Failed to submit inquiry.', error: error.message });
  }
});

// PUT update inquiry status (Admin or Faculty action)
router.put('/:id/status', authMiddleware, async (req, res) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'faculty')) {
    return res.status(403).json({ message: 'Access denied. Restricted to faculty or admins.' });
  }

  const { status } = req.body;
  const validStatuses = ['pending', 'contacted', 'resolved', 'cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Choose one of: ${validStatuses.join(', ')}` });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const updatedInquiry = await Inquiry.findOneAndUpdate(
        { id: req.params.id },
        { $set: { status } },
        { new: true }
      );
      if (!updatedInquiry) {
        return res.status(404).json({ message: 'Inquiry not found.' });
      }
      res.json(updatedInquiry);
    } else {
      const inquiry = fallbackDb.inquiries.find(i => i.id === req.params.id);
      if (!inquiry) {
        return res.status(404).json({ message: 'Inquiry not found.' });
      }
      inquiry.status = status;
      res.json(inquiry);
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update inquiry status.', error: error.message });
  }
});

module.exports = router;
