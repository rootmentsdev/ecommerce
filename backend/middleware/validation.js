const { body } = require('express-validator');

// Register validation
const validateRegister = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 50 })
    .withMessage('Full name cannot exceed 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please enter a valid 10-digit phone number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// Login validation
const validateLogin = [
  body('emailOrPhone')
    .notEmpty()
    .withMessage('Email or phone number is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Forgot password validation
const validateForgotPassword = [
  body('emailOrPhone')
    .notEmpty()
    .withMessage('Email or phone number is required')
];

// Reset password validation
const validateResetPassword = [
  body('resetToken')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('verificationCode')
    .matches(/^[0-9]{6}$/)
    .withMessage('Verification code must be 6 digits'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
};
