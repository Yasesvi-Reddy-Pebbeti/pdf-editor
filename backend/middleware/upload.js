const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads/'),
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
});

const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

const pdfUpload = multer({
  storage,
  fileFilter: fileFilter(['application/pdf']),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

const imageUpload = multer({
  storage,
  fileFilter: fileFilter(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff']),
  limits: { fileSize: 100 * 1024 * 1024 },
});

const anyUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

const cleanup = (files) => {
  if (!files) return;
  const arr = Array.isArray(files) ? files : [files];
  arr.forEach(f => { try { require('fs').unlinkSync(f.path); } catch (_) {} });
};

module.exports = { pdfUpload, imageUpload, anyUpload, cleanup };
