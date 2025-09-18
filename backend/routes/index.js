// routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const enquiryRoutes = require('./enquiryRoutes');
const imageRoutes = require('./imageRoutes');
// const productRoutes = require('./products');
// const userRoutes = require('./users');
// const orderRoutes = require('./orders');

// Mount routes
router.use('/auth', authRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/images', imageRoutes);
// router.use('/products', productRoutes);
// router.use('/users', userRoutes);
// router.use('/orders', orderRoutes);

// API status route
router.get('/', (req, res) => {
  res.json({
    message: 'E-commerce API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      enquiries: '/api/enquiries',
      images: '/api/images',
      products: '/api/products',
      users: '/api/users',
      orders: '/api/orders'
    }
  });
});

module.exports = router;
