const router = require('express').Router();
const upload = require('../Middlewares/Upload');
const adminOnly = require('../Middlewares/AdminMiddleware');
const { uploadImage } = require('../Controllers/UploadController');

// Only admins can upload
router.post('/', adminOnly, upload.single('image'), uploadImage);

module.exports = router;