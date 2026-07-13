const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const fallbackDb = require('../models/fallbackDb');
const { authMiddleware } = require('./auth');

// GET all products
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const products = await Product.find({});
      res.json(products);
    } else {
      res.json(fallbackDb.products);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving catalog products.', error: error.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findOne({ id: req.params.id });
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      res.json(product);
    } else {
      const product = fallbackDb.products.find(p => p.id === req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product details.', error: error.message });
  }
});

// POST register a new product (Admin action)
router.post('/', authMiddleware, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }

  const { name, category, description, price, stock, difficultyLevel, componentsList, projectsList } = req.body;

  // Syntactic validation
  if (!name || !category || !description || price === undefined || stock === undefined) {
    return res.status(400).json({ message: 'Missing required product parameters. Name, category, description, price, and stock are mandatory.' });
  }

  const parsedPrice = parseFloat(price);
  const parsedStock = parseInt(stock);

  if (isNaN(parsedPrice) || isNaN(parsedStock)) {
    return res.status(400).json({ message: 'Invalid format. Price and stock must be numeric variables.' });
  }

  // Semantic validation
  if (parsedPrice <= 0) {
    return res.status(400).json({ message: 'Invalid product cost. Price must be a positive number greater than zero.' });
  }

  if (parsedStock < 0) {
    return res.status(400).json({ message: 'Invalid inventory level. Stock count cannot be negative.' });
  }

  try {
    // Check duplicate name (semantic check)
    let isDuplicate;
    if (mongoose.connection.readyState === 1) {
      isDuplicate = await Product.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    } else {
      isDuplicate = fallbackDb.products.some(p => p.name.toLowerCase() === name.toLowerCase());
    }

    if (isDuplicate) {
      return res.status(400).json({ message: 'A kit with this name already exists in the catalog.' });
    }

    const productData = {
      id: 'prod-' + Date.now(),
      name,
      category,
      description,
      price: parsedPrice,
      stock: parsedStock,
      difficultyLevel: difficultyLevel || 'Intermediate',
      imageUrl: req.body.imageUrl || '/photos/products/electronics_equipment.jpg',
      componentsList: componentsList || '[]',
      projectsList: projectsList || '[]'
    };

    if (mongoose.connection.readyState === 1) {
      const dbProduct = new Product(productData);
      await dbProduct.save();
    } else {
      fallbackDb.products.push(productData);
    }

    res.status(201).json(productData);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product.', error: error.message });
  }
});

// PUT edit product (Admin action)
router.put('/:id', authMiddleware, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }

  const { name, category, description, price, stock, difficultyLevel, componentsList, projectsList } = req.body;
  
  try {
    let product;
    if (mongoose.connection.readyState === 1) {
      product = await Product.findOne({ id: req.params.id });
    } else {
      product = fallbackDb.products.find(p => p.id === req.params.id);
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const updateData = {};
    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({ message: 'Price must be a positive numeric value.' });
      }
      updateData.price = parsedPrice;
      product.price = parsedPrice;
    }

    if (stock !== undefined) {
      const parsedStock = parseInt(stock);
      if (isNaN(parsedStock) || parsedStock < 0) {
        return res.status(400).json({ message: 'Stock must be a non-negative integer.' });
      }
      updateData.stock = parsedStock;
      product.stock = parsedStock;
    }

    if (name) { updateData.name = name; product.name = name; }
    if (category) { updateData.category = category; product.category = category; }
    if (description) { updateData.description = description; product.description = description; }
    if (difficultyLevel) { updateData.difficultyLevel = difficultyLevel; product.difficultyLevel = difficultyLevel; }
    if (componentsList) { updateData.componentsList = componentsList; product.componentsList = componentsList; }
    if (projectsList) { updateData.projectsList = projectsList; product.projectsList = projectsList; }

    if (mongoose.connection.readyState === 1) {
      await Product.updateOne({ id: req.params.id }, { $set: updateData });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product.', error: error.message });
  }
});

// DELETE product (Admin action)
router.delete('/:id', authMiddleware, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const deleted = await Product.findOneAndDelete({ id: req.params.id });
      if (!deleted) {
        return res.status(404).json({ message: 'Product not found.' });
      }
    } else {
      const productIndex = fallbackDb.products.findIndex(p => p.id === req.params.id);
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      fallbackDb.products.splice(productIndex, 1);
    }
    
    res.json({ success: true, message: 'Product successfully deleted from catalog.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product.', error: error.message });
  }
});

module.exports = router;
