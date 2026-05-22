const express = require('express');
const router = express.Router();
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const { pdfUpload, cleanup } = require('../middleware/upload');

router.post('/', pdfUpload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Please upload a PDF file.' });

  let { pageOrder } = req.body;

  try {
    const bytes = fs.readFileSync(file.path);
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const totalPages = src.getPageCount();

    let order;
    if (pageOrder) {
      try {
        order = JSON.parse(pageOrder);
      } catch {
        order = pageOrder.split(',').map(n => parseInt(n.trim(), 10) - 1);
      }
      order = order.filter(i => Number.isInteger(i) && i >= 0 && i < totalPages);
    } else {
      order = Array.from({ length: totalPages }, (_, i) => i);
    }

    if (!order.length) {
      cleanup(file);
      return res.status(400).json({ error: 'No valid page order provided.' });
    }

    const newDoc = await PDFDocument.create();
    const pages = await newDoc.copyPages(src, order);
    pages.forEach(p => newDoc.addPage(p));

    const result = await newDoc.save({ useObjectStreams: true });
    cleanup(file);

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="organized.pdf"' });
    res.send(Buffer.from(result));
  } catch (err) {
    cleanup(file);
    console.error('Organize error:', err);
    res.status(500).json({ error: 'Failed to organize PDF.' });
  }
});

module.exports = router;
