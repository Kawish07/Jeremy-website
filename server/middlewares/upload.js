const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Allowed file types for real estate images
const allowedMimes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif'
];

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type: ${file.mimetype}. Only images allowed.`), false);
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`Invalid file extension: ${ext}. Only ${allowedExtensions.join(', ')} allowed.`), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

module.exports = { upload, uploadsDir };
