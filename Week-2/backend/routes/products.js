const express = require('express');
const router = express.Router();
const data = require('../data');
const { authMiddleware } = require('./auth');

// GET all products
router.get('/', (req, res) => {
  res.json(data.products);
});

// GET single product
router.get('/:id', (req, res) => {
  const product = data.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }
  res.json(product);
});

// POST register a new product (Admin action)
router.post('/', authMiddleware, (req, res) => {
  // Authorization check (mock)
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

  // Check duplicate product name (semantic check)
  const isDuplicate = data.products.some(p => p.name.toLowerCase() === name.toLowerCase());
  if (isDuplicate) {
    return res.status(400).json({ message: 'A kit with this name already exists in the catalog.' });
  }

  const newProduct = {
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

  data.products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT edit product (Admin action)
router.put('/:id', authMiddleware, (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }

  const productIndex = data.products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const { name, category, description, price, stock, difficultyLevel, componentsList, projectsList } = req.body;

  // Validation if updated
  if (price !== undefined) {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: 'Price must be a positive numeric value.' });
    }
    data.products[productIndex].price = parsedPrice;
  }

  if (stock !== undefined) {
    const parsedStock = parseInt(stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ message: 'Stock must be a non-negative integer.' });
    }
    data.products[productIndex].stock = parsedStock;
  }

  if (name) data.products[productIndex].name = name;
  if (category) data.products[productIndex].category = category;
  if (description) data.products[productIndex].description = description;
  if (difficultyLevel) data.products[productIndex].difficultyLevel = difficultyLevel;
  if (componentsList) data.products[productIndex].componentsList = componentsList;
  if (projectsList) data.products[productIndex].projectsList = projectsList;

  res.json(data.products[productIndex]);
});

// DELETE product (Admin action)
router.delete('/:id', authMiddleware, (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Access restricted to administrators only.' });
  }

  const productIndex = data.products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  data.products.splice(productIndex, 1);
  res.json({ success: true, message: 'Product successfully deleted from catalog.' });
});

module.exports = router;
