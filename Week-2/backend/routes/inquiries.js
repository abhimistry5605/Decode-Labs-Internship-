const express = require('express');
const router = express.Router();
const data = require('../data');
const { authMiddleware } = require('./auth');

// GET all inquiries (Faculty and Admin only)
router.get('/', authMiddleware, (req, res) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'faculty')) {
    return res.status(403).json({ message: 'Access denied. Only institution representatives or administrators can view inquiries.' });
  }

  res.json(data.inquiries);
});

// POST register a new inquiry
router.post('/', (req, res) => {
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

  // Verify that the requested training kit is part of our products list
  const kitExists = data.products.some(p => p.name.toLowerCase() === kitName.toLowerCase());
  if (!kitExists) {
    return res.status(400).json({ message: `Semantic Error: The requested kit "${kitName}" is not cataloged in our system.` });
  }

  const newInquiry = {
    id: 'inquiry-' + Date.now(),
    name,
    email,
    phone,
    institutionName,
    kitName,
    quantity: parsedQty,
    message: message || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  data.inquiries.push(newInquiry);
  res.status(201).json(newInquiry);
});

// PUT update inquiry status (Admin or Faculty action)
router.put('/:id/status', authMiddleware, (req, res) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'faculty')) {
    return res.status(403).json({ message: 'Access denied. Restricted to faculty or admins.' });
  }

  const inquiry = data.inquiries.find(i => i.id === req.params.id);
  if (!inquiry) {
    return res.status(404).json({ message: 'Inquiry not found.' });
  }

  const { status } = req.body;
  const validStatuses = ['pending', 'contacted', 'resolved', 'cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Choose one of: ${validStatuses.join(', ')}` });
  }

  inquiry.status = status;
  res.json(inquiry);
});

module.exports = router;
