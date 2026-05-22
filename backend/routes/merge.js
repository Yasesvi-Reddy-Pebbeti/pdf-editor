const express = require('express');
const router = express.Router();
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const { pdfUpload, cleanup } = require('../middleware/upload');

router.post('/', pdfUpload.array('files', 20), async (req, res) => {
  const files = req.files;
  if (!files || files.length < 2)
    return res.status(400).json({ error: 'Please upload at least 2 PDF files.' });

  try {
    const merged = await PDFDocument.create();

    for (const file of files) {
      const bytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }

    merged.setTitle('Merged PDF');
    merged.setCreator('PDFEditor');
    const result = await merged.save({ useObjectStreams: true });

    cleanup(files);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="merged.pdf"' });
    res.send(Buffer.from(result));
  } catch (err) {
    cleanup(files);
    console.error('Merge error:', err);
    res.status(500).json({ error: 'Failed to merge PDFs. Ensure all files are valid PDFs.' });
  }
});

module.exports = router;
