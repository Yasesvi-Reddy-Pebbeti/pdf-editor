const express = require('express');
const router = express.Router();
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const { pdfUpload, cleanup } = require('../middleware/upload');

router.post('/', pdfUpload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Please upload a PDF file.' });

  const { level = 'medium' } = req.body;

  try {
    const bytes = fs.readFileSync(file.path);
    const originalSize = bytes.length;

    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

    // Strip metadata to reduce size
    if (level === 'medium' || level === 'high') {
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setKeywords([]);
      pdf.setProducer('');
      pdf.setCreator('');
    }

    // Save with object streams compression
    const compressed = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
    cleanup(file);

    const newSize = compressed.length;
    const reduction = Math.round(((originalSize - newSize) / originalSize) * 100);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="compressed.pdf"',
      'X-Original-Size': originalSize.toString(),
      'X-Compressed-Size': newSize.toString(),
      'X-Reduction-Percent': reduction.toString(),
    });
    res.send(Buffer.from(compressed));
  } catch (err) {
    cleanup(file);
    console.error('Compress error:', err);
    res.status(500).json({ error: 'Failed to compress PDF.' });
  }
});

module.exports = router;
