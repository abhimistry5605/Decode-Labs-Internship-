const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const fallbackDb = require('../models/fallbackDb');
const { authMiddleware } = require('./auth');

// GET all registered users (Admin only)
router.get('/', authMiddleware, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find({}).sort({ createdAt: -1 });
      res.json(users);
    } else {
      res.json(fallbackDb.users);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user index.', error: error.message });
  }
});

// PUT update user role (Admin action)
router.put('/:id/role', authMiddleware, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }

  const { role } = req.body;
  const validRoles = ['student', 'faculty', 'admin', 'college_rep'];

  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ message: `Invalid user role. Choose one of: ${validRoles.join(', ')}` });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const updatedUser = await User.findOneAndUpdate(
        { id: req.params.id },
        { $set: { role } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found.' });
      }
      res.json(updatedUser);
    } else {
      const user = fallbackDb.users.find(u => u.id === req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      user.role = role;
      res.json(user);
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user role.', error: error.message });
  }
});

module.exports = router;
