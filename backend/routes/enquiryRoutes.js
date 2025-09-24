const express = require('express');
const router = express.Router();
const EnquiryController = require('../controllers/enquiryController');
const { body, param, query } = require('express-validator');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

/**
 * Enquiry Routes
 * All enquiry-related API endpoints following RESTful conventions
 */

// Simplified validation middleware for better performance
const createEnquiryValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 100 })
    .withMessage('Full name cannot exceed 100 characters'),
  
  body('mobileNumber')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid 10-digit mobile number'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('specialNotes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special notes cannot exceed 500 characters')
];

const updateEnquiryValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid enquiry ID'),
  
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'interested', 'converted', 'cancelled'])
    .withMessage('Invalid status value'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority value'),
  
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot exceed 1000 characters'),
  
  body('specialNotes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special notes cannot exceed 500 characters')
];

const getEnquiryValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid enquiry ID')
];

const getAllEnquiriesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('status')
    .optional()
    .isIn(['pending', 'contacted', 'confirmed', 'cancelled'])
    .withMessage('Invalid status filter'),
  
  query('city')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Invalid city filter'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority filter'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'preferredBookingDate', 'status', 'priority'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// Routes

/**
 * @route   GET /api/enquiries/test
 * @desc    Test endpoint to verify server is working
 * @access  Public
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Enquiry API is working!',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route   POST /api/enquiries
 * @desc    Create a new enquiry
 * @access  Public
 */
router.post('/', createEnquiryValidation, EnquiryController.createEnquiry);

/**
 * @route   GET /api/enquiries
 * @desc    Get all enquiries with pagination and filtering
 * @access  Public (for admin dashboard)
 */
router.get('/', getAllEnquiriesValidation, EnquiryController.getAllEnquiries);

/**
 * @route   GET /api/enquiries/admin
 * @desc    Get all enquiries with pagination and filtering (Admin only)
 * @access  Private (Admin only)
 */
router.get('/admin', auth, getAllEnquiriesValidation, EnquiryController.getAllEnquiries);

/**
 * @route   GET /api/enquiries/stats
 * @desc    Get enquiry statistics for dashboard
 * @access  Private (Admin only)
 */
router.get('/stats', auth, EnquiryController.getEnquiryStats);

/**
 * @route   GET /api/enquiries/:id
 * @desc    Get enquiry by ID
 * @access  Private (Admin only)
 */
router.get('/:id', auth, getEnquiryValidation, EnquiryController.getEnquiryById);

/**
 * @route   PUT /api/enquiries/:id
 * @desc    Update enquiry status and admin notes
 * @access  Public (for admin dashboard)
 */
router.put('/:id', updateEnquiryValidation, EnquiryController.updateEnquiry);

/**
 * @route   DELETE /api/enquiries/:id
 * @desc    Delete enquiry
 * @access  Private (Admin only)
 */
router.delete('/:id', auth, getEnquiryValidation, EnquiryController.deleteEnquiry);

/**
 * Admin Routes - Dashboard Access
 * @route   GET /api/enquiries/admin/dashboard
 * @desc    Get all enquiries for admin dashboard
 * @access  Private (Admin only)
 */
router.get('/admin/dashboard', adminAuth, EnquiryController.getAllEnquiries);

/**
 * @route   PUT /api/enquiries/admin/:id/status
 * @desc    Update enquiry status (Admin only)
 * @access  Private (Admin only)
 */
router.put('/admin/:id/status', adminAuth, [
  param('id').isMongoId().withMessage('Invalid enquiry ID'),
  body('status')
    .isIn(['new', 'contacted', 'interested', 'converted', 'cancelled'])
    .withMessage('Invalid status value')
], EnquiryController.updateEnquiryStatus);

module.exports = router;
