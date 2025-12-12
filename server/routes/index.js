const express = require('express');
const router = express.Router();

router.use('/listings', require('./listings'));
router.use('/contact', require('./contact'));
router.use('/letsconnect', require('./letsconnect'));
router.use('/admin', require('./admin'));
router.use('/popup', require('./popup'));

module.exports = router;
