const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Open CORS — allow all origins (required for Vercel ↔ Railway cross-domain requests)
app.use(cors());
app.options('*', cors()); // Explicitly handle all preflight OPTIONS requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log every incoming request — visible in Railway deployment logs
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} — Content-Type: ${req.headers['content-type'] || 'none'}`);
  next();
});

// Ensure temp directories exist
const dirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'outputs'),
];
dirs.forEach(dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); });

// Routes
app.use('/api/merge', require('./routes/merge'));
app.use('/api/split', require('./routes/split'));
app.use('/api/compress', require('./routes/compress'));
app.use('/api/rotate', require('./routes/rotate'));
app.use('/api/watermark', require('./routes/watermark'));
app.use('/api/protect', require('./routes/protect'));
app.use('/api/unlock', require('./routes/unlock'));
app.use('/api/page-numbers', require('./routes/pageNumbers'));
app.use('/api/organize', require('./routes/organize'));
app.use('/api/pdf-to-image', require('./routes/pdfToImage'));
app.use('/api/image-to-pdf', require('./routes/imageToPdf'));

// Root route — confirms the API is live
app.get('/', (req, res) => {
  res.json({
    name: 'PDFEditor API',
    status: 'running',
    version: '1.0.0',
    endpoints: [
      'POST /api/merge',
      'POST /api/split',
      'POST /api/compress',
      'POST /api/rotate',
      'POST /api/watermark',
      'POST /api/protect',
      'POST /api/unlock',
      'POST /api/page-numbers',
      'POST /api/organize',
      'POST /api/pdf-to-image',
      'POST /api/image-to-pdf',
    ],
  });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 404 catch-all — tells you exactly what URL was hit so you can debug
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    path: req.path,
    hint: `Valid routes are POST /api/merge, /api/split, /api/compress, etc.`,
  });
});

// Periodic cleanup of temp files older than 1 hour
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000;
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file);
      try {
        if (fs.statSync(filePath).mtimeMs < oneHourAgo) fs.unlinkSync(filePath);
      } catch (_) {}
    });
  });
}, 3600000);

app.listen(PORT, () => console.log(`PDF Editor backend running on http://localhost:${PORT}`));
