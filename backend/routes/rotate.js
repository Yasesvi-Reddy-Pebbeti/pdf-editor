const express = require('express');
const router = express.Router();
const { PDFDocument, degrees } = require('pdf-lib');
const fs = require('fs');
const { pdfUpload, cleanup } = require('../middleware/upload');

router.post('/', pdfUpload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Please upload a PDF file.' });

  const { rotation = '90', pages = 'all' } = req.body;
  const angle = parseInt(rotation, 10);

  if (![90, 180, 270, -90].includes(angle))
    return res.status(400).json({ error: 'Rotation must be 90, 180, 270, or -90.' });

  try {
    const bytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const totalPages = pdf.getPageCount();

    let pageIndices = [];
    if (pages === 'all') {
      pageIndices = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      // Parse comma-separated or range page numbers
      pageIndices = pages.split(',').flatMap(part => {
        part = part.trim();
        if (part.includes('-')) {
          const [s, e] = part.split('-').map(n => parseInt(n.trim(), 10) - 1);
          return Array.from({ length: e - s + 1 }, (_, i) => s + i);
        }
        return [parseInt(part, 10) - 1];
      }).filter(i => i >= 0 && i < totalPages);
    }

    pageIndices.forEach(i => {
      const page = pdf.getPage(i);
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + angle + 360) % 360));
    });

    const result = await pdf.save({ useObjectStreams: true });
    cleanup(file);

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="rotated.pdf"' });
    res.send(Buffer.from(result));
  } catch (err) {
    cleanup(file);
    console.error('Rotate error:', err);
    res.status(500).json({ error: 'Failed to rotate PDF.' });
  }
});

module.exports = router;
