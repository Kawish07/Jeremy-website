const express = require('express');
const router = express.Router();
const letsConnectController = require('../controllers/letsConnectController');

router.post('/', letsConnectController.create);
router.get('/', letsConnectController.list);

module.exports = router;
