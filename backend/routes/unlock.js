const express = require('express');
const router = express.Router();
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const { pdfUpload, cleanup } = require('../middleware/upload');

router.post('/', pdfUpload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Please upload a PDF file.' });

  const { password = '' } = req.body;

  try {
    const bytes = fs.readFileSync(file.path);
    let pdf;
    try {
      pdf = await PDFDocument.load(bytes, { password });
    } catch (loadErr) {
      cleanup(file);
      if (loadErr.message?.includes('password')) {
        return res.status(400).json({ error: 'Incorrect password. Please check and try again.' });
      }
      return res.status(400).json({ error: 'Could not open PDF. It may be corrupted or use unsupported encryption.' });
    }

    // Re-save without encryption
    const unlocked = await pdf.save({ useObjectStreams: true });
    cleanup(file);

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="unlocked.pdf"' });
    res.send(Buffer.from(unlocked));
  } catch (err) {
    cleanup(file);
    console.error('Unlock error:', err);
    res.status(500).json({ error: 'Failed to unlock PDF.' });
  }
});

module.exports = router;
