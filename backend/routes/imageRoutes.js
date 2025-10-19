const express = require('express');
const { body, param, query } = require('express-validator');
const ImageController = require('../controllers/imageController');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

/**
 * Validation middleware for image creation and updates
 */
const imageValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
    
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
    
  body('imageUrl')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required')
    .isURL()
    .withMessage('Image URL must be a valid URL'),
    
  body('altText')
    .trim()
    .notEmpty()
    .withMessage('Alt text is required for accessibility')
    .isLength({ min: 10, max: 125 })
    .withMessage('Alt text must be between 10 and 125 characters for optimal SEO'),
    
  body('seoTitle')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('SEO title cannot exceed 60 characters'),
    
  body('seoDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('SEO description cannot exceed 160 characters'),
    
  body('focusKeyword')
    .optional()
    .trim()
    .toLowerCase()
    .isLength({ max: 50 })
    .withMessage('Focus keyword cannot exceed 50 characters'),
    
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['buy', 'rent', 'featured', 'trending', 'topCategories', 'suits', 'kurtas', 'bandhgalas', 'formal', 'traditional', 'product', 'hero', 'banner', 'gallery', 'testimonial', 'about'])
    .withMessage('Category must be one of: buy, rent, featured, trending, topCategories, suits, kurtas, bandhgalas, formal, traditional, product, hero, banner, gallery, testimonial, about'),
    
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array')
    .custom((categories) => {
      if (!Array.isArray(categories)) return true;
      const validCategories = ['buy', 'rent', 'featured', 'trending', 'topCategories', 'suits', 'kurtas', 'bandhgalas', 'formal', 'traditional'];
      const invalidCategories = categories.filter(cat => !validCategories.includes(cat));
      if (invalidCategories.length > 0) {
        throw new Error(`Invalid categories: ${invalidCategories.join(', ')}. Valid categories are: ${validCategories.join(', ')}`);
      }
      return true;
    }),
    
  body('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a comma-separated string'),
    
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
    
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
    
  // SEO field validations
  body('seoTitle')
    .optional({ nullable: true }),
    
  body('seoDescription')
    .optional({ nullable: true }),
    
  body('focusKeyword')
    .optional({ nullable: true }),
    
  // Product-related field validations - RELAXED FOR DEBUGGING
  body('price')
    .optional({ nullable: true })
    .custom(value => {
      if (value === '' || value === null || value === undefined) return true;
      if (isNaN(value)) throw new Error('Price must be a number');
      return true;
    }),
    
  body('rentalPrice')
    .optional({ nullable: true })
    .custom(value => {
      if (value === '' || value === null || value === undefined) return true;
      if (isNaN(value)) throw new Error('Rental price must be a number');
      return true;
    }),
    
  body('actualPrice')
    .optional({ nullable: true })
    .custom(value => {
      if (value === '' || value === null || value === undefined) return true;
      if (isNaN(value)) throw new Error('Actual price must be a number');
      return true;
    }),
    
  body('securityDeposit')
    .optional({ nullable: true })
    .custom(value => {
      if (value === '' || value === null || value === undefined) return true;
      if (isNaN(value)) throw new Error('Security deposit must be a number');
      return true;
    }),
    
  body('fabric')
    .optional({ nullable: true }),
    
  body('color')
    .optional({ nullable: true }),
    
  body('colors')
    .optional({ nullable: true }),
    
  body('style')
    .optional({ nullable: true }),
    
  body('occasions')
    .optional({ nullable: true }),
    
  body('inclusions')
    .optional({ nullable: true }),
    
  body('care')
    .optional({ nullable: true }),
    
  body('sizes')
    .optional({ nullable: true }),
    
  body('type')
    .optional({ nullable: true }),
    
  body('inStock')
    .optional({ nullable: true }),
    
  body('metadata.fileSize')
    .optional()
    .isInt({ min: 0 })
    .withMessage('File size must be a non-negative integer'),
    
  body('metadata.dimensions.width')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Width must be a positive integer'),
    
  body('metadata.dimensions.height')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Height must be a positive integer'),
    
  body('metadata.format')
    .optional()
    .toLowerCase()
    .isIn(['webp', 'jpg', 'jpeg', 'png', 'gif', 'svg'])
    .withMessage('Format must be one of: webp (preferred), jpg, jpeg, png, gif, svg'),
    
  body('metadata.originalFormat')
    .optional()
    .toLowerCase()
    .isIn(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])
    .withMessage('Original format must be one of: jpg, jpeg, png, gif, webp, svg'),
    
  body('metadata.compressionQuality')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Compression quality must be between 1 and 100'),
    
  body('metadata.isOptimized')
    .optional()
    .isBoolean()
    .withMessage('isOptimized must be a boolean value')
];

/**
 * Validation for ID parameters
 */
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid image ID format')
];

/**
 * Validation for query parameters
 */
const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('category')
    .optional()
    .isIn(['all', 'buy', 'rent', 'featured', 'trending', 'product', 'hero', 'banner', 'gallery', 'testimonial', 'about'])
    .withMessage('Invalid category filter'),
    
  query('isActive')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isActive filter must be true or false'),
    
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'category', 'displayOrder'])
    .withMessage('Invalid sort field'),
    
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// Routes

/**
 * @route   GET /api/images/public
 * @desc    Get active images for frontend display (no auth required)
 * @access  Public
 */
router.get(
  '/public',
  queryValidation,
  ImageController.getPublicImages
);

/**
 * @route   GET /api/images
 * @desc    Get all images with filtering and pagination
 * @access  Admin
 */
router.get(
  '/',
  adminAuth,
  queryValidation,
  ImageController.getAllImages
);

/**
 * @route   GET /api/images/categories
 * @desc    Get image categories with counts
 * @access  Admin
 */
router.get(
  '/categories',
  adminAuth,
  ImageController.getImageCategories
);

/**
 * @route   POST /api/images/migrate-categories
 * @desc    Migrate existing categories to new category system
 * @access  Admin
 */
router.post(
  '/migrate-categories',
  adminAuth,
  ImageController.migrateCategories
);

/**
 * @route   GET /api/images/:id
 * @desc    Get single image by ID
 * @access  Admin
 */
router.get(
  '/:id',
  adminAuth,
  idValidation,
  ImageController.getImageById
);

/**
 * @route   POST /api/images
 * @desc    Create new image
 * @access  Admin
 */
router.post(
  '/',
  adminAuth,
  imageValidation,
  ImageController.createImage
);

/**
 * @route   PUT /api/images/:id
 * @desc    Update existing image
 * @access  Admin
 */
router.put(
  '/:id',
  adminAuth,
  idValidation,
  imageValidation,
  ImageController.updateImage
);

/**
 * @route   PATCH /api/images/:id/toggle
 * @desc    Toggle image active status
 * @access  Admin
 */
router.patch(
  '/:id/toggle',
  adminAuth,
  idValidation,
  ImageController.toggleImageStatus
);

/**
 * @route   DELETE /api/images/:id
 * @desc    Delete image
 * @access  Admin
 */
router.delete(
  '/:id',
  adminAuth,
  idValidation,
  ImageController.deleteImage
);

module.exports = router;
