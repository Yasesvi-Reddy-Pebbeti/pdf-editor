const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from the Vercel frontend (or all origins in dev)
const corsOptions = {
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle all preflight OPTIONS requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

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
