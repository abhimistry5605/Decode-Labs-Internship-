const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const auth = require('./routes/auth');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const inquiriesRouter = require('./routes/inquiries');
const contactsRouter = require('./routes/contacts');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend running on http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Logger middleware
app.use(morgan('dev'));

// JSON parsing middleware
app.use(express.json());

// Routes Registration
app.use('/api/auth', auth.router);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/contact', contactsRouter);
app.use('/api/users', usersRouter);

// Root route placeholder
app.get('/', (req, res) => {
  res.json({ message: 'EduCircuit Labs Backend API running - Week 2 Submission' });
});

// Fallback 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API Endpoint Not Found: [${req.method}] ${req.originalUrl}` });
});

// Global 500 server error handler
app.use((err, req, res, next) => {
  console.error('Express Error Handler:', err);
  res.status(500).json({ 
    message: 'An unexpected internal server error occurred on the API backend.',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 EduCircuit Labs Backend Server active!`);
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log(`=================================================`);
});
