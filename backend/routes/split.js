const express = require('express');
const router = express.Router();
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const { pdfUpload, cleanup } = require('../middleware/upload');

function parseRanges(rangeStr, totalPages) {
  const ranges = [];
  const parts = rangeStr.split(',').map(s => s.trim());
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= totalPages && start <= end) {
        ranges.push({ start: start - 1, end: end - 1 });
      }
    } else {
      const n = parseInt(part, 10);
      if (!isNaN(n) && n >= 1 && n <= totalPages) {
        ranges.push({ start: n - 1, end: n - 1 });
      }
    }
  }
  return ranges;
}

router.post('/', pdfUpload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Please upload a PDF file.' });

  const { mode = 'all', ranges: rangesStr = '', interval = '1' } = req.body;

  try {
    const bytes = fs.readFileSync(file.path);
    const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const totalPages = srcDoc.getPageCount();

    let chunks = [];

    if (mode === 'all') {
      chunks = Array.from({ length: totalPages }, (_, i) => [i]);
    } else if (mode === 'interval') {
      const n = Math.max(1, parseInt(interval, 10) || 1);
      for (let i = 0; i < totalPages; i += n) {
        chunks.push(Array.from({ length: Math.min(n, totalPages - i) }, (_, j) => i + j));
      }
    } else if (mode === 'ranges') {
      const parsed = parseRanges(rangesStr, totalPages);
      if (!parsed.length) {
        cleanup(file);
        return res.status(400).json({ error: 'Invalid page ranges specified.' });
      }
      chunks = parsed.map(({ start, end }) =>
        Array.from({ length: end - start + 1 }, (_, i) => start + i)
      );
    }

    const outputDir = path.join(__dirname, '../outputs', uuidv4());
    fs.mkdirSync(outputDir, { recursive: true });

    const pdfPaths = [];
    for (let i = 0; i < chunks.length; i++) {
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(srcDoc, chunks[i]);
      pages.forEach(p => newDoc.addPage(p));
      const outBytes = await newDoc.save({ useObjectStreams: true });
      const outPath = path.join(outputDir, `page_${i + 1}.pdf`);
      fs.writeFileSync(outPath, outBytes);
      pdfPaths.push(outPath);
    }

    cleanup(file);

    if (pdfPaths.length === 1) {
      const data = fs.readFileSync(pdfPaths[0]);
      fs.rmSync(outputDir, { recursive: true, force: true });
      res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="split.pdf"' });
      return res.send(data);
    }

    res.set({ 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename="split_pages.zip"' });
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);
    pdfPaths.forEach((p, i) => archive.file(p, { name: `page_${i + 1}.pdf` }));
    archive.on('end', () => fs.rmSync(outputDir, { recursive: true, force: true }));
    archive.on('error', () => fs.rmSync(outputDir, { recursive: true, force: true }));
    archive.finalize();
  } catch (err) {
    cleanup(file);
    console.error('Split error:', err);
    res.status(500).json({ error: 'Failed to split PDF.' });
  }
});

module.exports = router;
