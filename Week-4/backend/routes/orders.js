const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const fallbackDb = require('../models/fallbackDb');
const { authMiddleware } = require('./auth');

// GET all orders
router.get('/', authMiddleware, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized - invalid session credentials.' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      if (req.user.role === 'admin') {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
      } else {
        const userOrders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(userOrders);
      }
    } else {
      if (req.user.role === 'admin') {
        res.json(fallbackDb.orders);
      } else {
        const userOrders = fallbackDb.orders.filter(o => o.userId === req.user.id);
        res.json(userOrders);
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders.', error: error.message });
  }
});

// GET user orders
router.get('/user', authMiddleware, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized - invalid session credentials.' });
  }
  try {
    if (mongoose.connection.readyState === 1) {
      const userOrders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
      res.json(userOrders);
    } else {
      const userOrders = fallbackDb.orders.filter(o => o.userId === req.user.id);
      res.json(userOrders);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user orders.', error: error.message });
  }
});

// GET admin orders
router.get('/admin', authMiddleware, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      res.json(orders);
    } else {
      res.json(fallbackDb.orders);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving admin orders.', error: error.message });
  }
});

// POST submit a new order
router.post('/', authMiddleware, async (req, res) => {
  const { items, shippingAddress, contactPhone } = req.body;
  const currentUser = req.user;

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

  try {
    let computedTotal = 0;
    const processedItems = [];

    // Semantic Validation: Verify products & calculate total price on backend (avoids client-side tampering)
    for (const item of items) {
      let product;
      if (mongoose.connection.readyState === 1) {
        product = await Product.findOne({ id: item.productId });
      } else {
        product = fallbackDb.products.find(p => p.id === item.productId);
      }

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
      if (mongoose.connection.readyState === 1) {
        await product.save();
      }

      computedTotal += product.price * qty;
      processedItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty
      });
    }

    const orderData = {
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

    if (mongoose.connection.readyState === 1) {
      const newOrder = new Order(orderData);
      await newOrder.save();
    } else {
      fallbackDb.orders.push(orderData);
    }

    res.status(201).json(orderData);
  } catch (error) {
    res.status(400).json({ message: 'Failed to place order.', error: error.message });
  }
});

// PUT update order status (Admin action)
router.put('/:id', authMiddleware, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }

  const { status } = req.body;
  const validStatuses = ['pending', 'shipped', 'cancelled', 'completed'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Choose one of: ${validStatuses.join(', ')}` });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const updatedOrder = await Order.findOneAndUpdate(
        { id: req.params.id },
        { $set: { status } },
        { new: true }
      );
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found.' });
      }
      res.json(updatedOrder);
    } else {
      const order = fallbackDb.orders.find(o => o.id === req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }
      order.status = status;
      res.json(order);
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update order.', error: error.message });
  }
});

module.exports = router;
