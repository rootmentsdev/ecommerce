const express = require('express');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./config/database');
const { swaggerUi, specs } = require('./config/swagger');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/authRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const imageRoutes = require('./routes/imageRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(compression()); // Enable gzip compression
app.use(cors({
  origin: function (origin, callback) {
    // Only log CORS issues, not every request
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://ecommerce-pi-six-17.vercel.app',
      'https://ecommerce-q0bg.onrender.com',
      'https://ecommerce-git-master-rootments-test-envs-projects.vercel.app',
      'https://www.dapprsquad.com',
      'https://dapprsquad.com'
    ];
    
    // Allow any Vercel subdomain
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Only log rejected origins
    console.log('🚫 CORS rejected origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/newsletter', newsletterRoutes);

// API Info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'E-commerce API',
    version: '1.0.0',
    status: 'active',
    documentation: '/api-docs'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.get("/", (req, res) => {
  res.send("Ecommerce API is running 🚀");
});


// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
});

module.exports = app;