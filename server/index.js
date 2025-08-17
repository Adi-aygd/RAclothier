const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Custom logging middleware to filter out root requests
const customLogger = (req, res, next) => {
  if (req.path === '/' && req.method === 'GET') {
    // Skip logging for root path requests
    return next();
  }
  morgan('dev')(req, res, next);
};

// Middleware
app.use(cors());
app.use(helmet());
app.use(customLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
});
app.use(limiter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'RAclothier API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      admin: '/api/admin',
      orders: '/api/orders',
    },
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/orders', require('./routes/orders'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
