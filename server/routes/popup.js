const express = require('express');
const router = express.Router();
const popupController = require('../controllers/popupController');
const { verifyToken } = require('../middlewares/auth');

router.post('/', popupController.create);
// protect listing of popup leads for admins
router.get('/', verifyToken, popupController.list);

module.exports = router;
