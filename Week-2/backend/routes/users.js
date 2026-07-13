const express = require('express');
const router = express.Router();
const data = require('../data');
const { authMiddleware } = require('./auth');

// GET all registered users (Admin only)
router.get('/', authMiddleware, (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }

  res.json(data.users);
});

// PUT update user role (Admin action)
router.put('/:id/role', authMiddleware, (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }

  const user = data.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const { role } = req.body;
  const validRoles = ['student', 'faculty', 'admin', 'college_rep'];

  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ message: `Invalid user role. Choose one of: ${validRoles.join(', ')}` });
  }

  user.role = role;
  res.json(user);
});

module.exports = router;
