const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.create);
router.get('/', contactController.list);

module.exports = router;
