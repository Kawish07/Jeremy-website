const express = require('express');
const router = express.Router();
const listingsController = require('../controllers/listingsController');
const { upload } = require('../middlewares/upload');

router.get('/', listingsController.list);
router.get('/:id', listingsController.get);
router.post('/', upload.fields([{ name: 'imageFiles', maxCount: 20 }, { name: 'imageFiles[]', maxCount: 20 }, { name: 'agentPhotoFile', maxCount: 1 }]), listingsController.create);
router.put('/:id', upload.fields([{ name: 'imageFiles', maxCount: 20 }, { name: 'imageFiles[]', maxCount: 20 }, { name: 'agentPhotoFile', maxCount: 1 }]), listingsController.update);
router.delete('/:id', listingsController.remove);

module.exports = router;
