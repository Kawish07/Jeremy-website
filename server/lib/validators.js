const { body, validationResult } = require('express-validator');

/**
 * Validation middleware to check results and respond with errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Contact form validators
 */
const contactValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\+?1?\d{9,15}$/).withMessage('Valid phone number required'),
  body('message')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Message too long (max 1000 chars)')
];

/**
 * Popup form validators
 */
const popupValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\+?1?\d{9,15}$/).withMessage('Valid phone number required'),
  body('message')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Message too long (max 1000 chars)')
];

/**
 * LetsConnect form validators
 */
const letsConnectValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^\+?1?\d{9,15}$/).withMessage('Valid phone number required'),
  body('interest')
    .trim()
    .notEmpty().withMessage('Interest is required')
    .isIn(['buying', 'selling', 'renting', 'other']).withMessage('Invalid interest value'),
  body('bestTime')
    .notEmpty().withMessage('Best time is required')
    .isISO8601().withMessage('Valid datetime is required'),
  body('timezone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('Invalid timezone')
];

module.exports = {
  handleValidationErrors,
  contactValidators,
  popupValidators,
  letsConnectValidators
};
