const express = require('express');
const { body } = require('express-validator');
const {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getNewsletterStats,
  getAllSubscribers,
  updateSubscriberPreferences
} = require('../controllers/newsletterController');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Validation middleware for newsletter subscription
const newsletterValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('preferences.fashionUpdates')
    .optional()
    .isBoolean()
    .withMessage('Fashion updates preference must be boolean'),
  body('preferences.exclusiveOffers')
    .optional()
    .isBoolean()
    .withMessage('Exclusive offers preference must be boolean'),
  body('preferences.newProducts')
    .optional()
    .isBoolean()
    .withMessage('New products preference must be boolean'),
  body('preferences.styleTips')
    .optional()
    .isBoolean()
    .withMessage('Style tips preference must be boolean')
];

// Public routes
router.post('/subscribe', newsletterValidation, subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);

// Admin routes (protected)
router.get('/stats', adminAuth, getNewsletterStats);
router.get('/subscribers', adminAuth, getAllSubscribers);
router.put('/subscribers/:email', adminAuth, updateSubscriberPreferences);

module.exports = router;
