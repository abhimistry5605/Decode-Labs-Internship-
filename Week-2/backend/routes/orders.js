const express = require('express');
const router = express.Router();
const data = require('../data');
const { authMiddleware } = require('./auth');

// GET all orders
router.get('/', authMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized - invalid session credentials.' });
  }

  // Admin sees all orders; normal users only see their own orders
  if (req.user.role === 'admin') {
    res.json(data.orders);
  } else {
    const userOrders = data.orders.filter(o => o.userId === req.user.id);
    res.json(userOrders);
  }
});

// POST submit a new order
router.post('/', authMiddleware, (req, res) => {
  const { items, shippingAddress, contactPhone } = req.body;
  const currentUser = req.user; // Can be Guest or logged-in user

  // Syntactic validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invalid payload. Items list must be a non-empty array.' });
  }

  if (!shippingAddress || typeof shippingAddress !== 'string' || shippingAddress.trim().length === 0) {
    return res.status(400).json({ message: 'Shipping address is required.' });
  }

  if (!contactPhone || typeof contactPhone !== 'string' || contactPhone.trim().length === 0) {
    return res.status(400).json({ message: 'Contact phone number is required.' });
  }

  // Semantic Validation: Verify products & calculate total price on backend (avoids client-side tampering)
  let computedTotal = 0;
  const processedItems = [];

  for (const item of items) {
    const product = data.products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ message: `Semantic Error: Product ID "${item.productId}" does not exist in our catalog.` });
    }

    const qty = parseInt(item.quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: `Quantity for item "${product.name}" must be a positive integer.` });
    }

    // Check stock availability
    if (product.stock < qty) {
      return res.status(400).json({ 
        message: `Inventory failure. Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${qty}.` 
      });
    }

    // Reduce product inventory levels (server-side logic)
    product.stock -= qty;

    computedTotal += product.price * qty;
    processedItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: qty
    });
  }

  const newOrder = {
    id: 'order-' + Date.now(),
    userId: currentUser ? currentUser.id : 'guest',
    userName: currentUser ? currentUser.name : 'Guest User',
    items: processedItems,
    totalAmount: computedTotal,
    shippingAddress,
    contactPhone,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  data.orders.push(newOrder);
  res.status(201).json(newOrder);
});

// PUT update order status (Admin action)
router.put('/:id', authMiddleware, (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }

  const order = data.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  const { status } = req.body;
  const validStatuses = ['pending', 'shipped', 'cancelled', 'completed'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Choose one of: ${validStatuses.join(', ')}` });
  }

  order.status = status;
  res.json(order);
});

module.exports = router;
