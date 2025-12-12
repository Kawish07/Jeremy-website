const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/auth');

router.post('/signup', adminController.signup);
router.post('/login', adminController.login);
router.get('/me', verifyToken, adminController.me);

module.exports = router;
