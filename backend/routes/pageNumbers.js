const express = require('express');
const router = express.Router();
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const { pdfUpload, cleanup } = require('../middleware/upload');

router.post('/', pdfUpload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Please upload a PDF file.' });

  const {
    position = 'bottom-center',
    startNumber = '1',
    format = 'n',
    fontSize = '12',
    margin = '30',
    color = '#000000',
  } = req.body;

  try {
    const bytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const totalPages = pdf.getPageCount();
    const start = parseInt(startNumber, 10) || 1;
    const fSize = parseFloat(fontSize) || 12;
    const mgn = parseFloat(margin) || 30;

    const parseColor = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return rgb(r, g, b);
    };

    for (let i = 0; i < totalPages; i++) {
      const page = pdf.getPage(i);
      const { width, height } = page.getSize();
      const pageNum = i + start;

      let label;
      if (format === 'n') label = `${pageNum}`;
      else if (format === 'n_total') label = `${pageNum} / ${totalPages + start - 1}`;
      else if (format === 'page_n') label = `Page ${pageNum}`;
      else if (format === 'page_n_of_total') label = `Page ${pageNum} of ${totalPages + start - 1}`;
      else label = `${pageNum}`;

      const textWidth = font.widthOfTextAtSize(label, fSize);

      let x, y;
      if (position === 'bottom-center') { x = width / 2 - textWidth / 2; y = mgn; }
      else if (position === 'bottom-left') { x = mgn; y = mgn; }
      else if (position === 'bottom-right') { x = width - textWidth - mgn; y = mgn; }
      else if (position === 'top-center') { x = width / 2 - textWidth / 2; y = height - mgn - fSize; }
      else if (position === 'top-left') { x = mgn; y = height - mgn - fSize; }
      else if (position === 'top-right') { x = width - textWidth - mgn; y = height - mgn - fSize; }
      else { x = width / 2 - textWidth / 2; y = mgn; }

      page.drawText(label, { x, y, size: fSize, font, color: parseColor(color) });
    }

    const result = await pdf.save({ useObjectStreams: true });
    cleanup(file);

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="numbered.pdf"' });
    res.send(Buffer.from(result));
  } catch (err) {
    cleanup(file);
    console.error('Page numbers error:', err);
    res.status(500).json({ error: 'Failed to add page numbers.' });
  }
});

module.exports = router;
