const express = require('express');
const router = express.Router();
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const fs = require('fs');
const { imageUpload, cleanup } = require('../middleware/upload');

router.post('/', imageUpload.array('files', 30), async (req, res) => {
  const files = req.files;
  if (!files || !files.length)
    return res.status(400).json({ error: 'Please upload at least one image.' });

  const { orientation = 'auto', margin = '0', fitToPage = 'true' } = req.body;
  const marginPt = Math.max(0, parseFloat(margin) || 0);
  const fit = fitToPage !== 'false';

  try {
    const pdf = await PDFDocument.create();

    for (const file of files) {
      // Convert to PNG/JPG with sharp for consistent handling
      let imgBuffer;
      let mimeType;

      try {
        const sharpImg = sharp(file.path);
        const meta = await sharpImg.metadata();

        if (meta.format === 'png' || file.mimetype === 'image/png') {
          imgBuffer = await sharpImg.png().toBuffer();
          mimeType = 'png';
        } else {
          imgBuffer = await sharpImg.jpeg({ quality: 90 }).toBuffer();
          mimeType = 'jpg';
        }
      } catch {
        // Fallback: read raw file
        imgBuffer = fs.readFileSync(file.path);
        mimeType = file.mimetype === 'image/png' ? 'png' : 'jpg';
      }

      let embeddedImg;
      if (mimeType === 'png') {
        embeddedImg = await pdf.embedPng(imgBuffer);
      } else {
        embeddedImg = await pdf.embedJpg(imgBuffer);
      }

      const { width: imgW, height: imgH } = embeddedImg;

      let pageW, pageH;
      if (orientation === 'landscape' || (orientation === 'auto' && imgW > imgH)) {
        pageW = 841.89; pageH = 595.28; // A4 landscape in points
      } else {
        pageW = 595.28; pageH = 841.89; // A4 portrait in points
      }

      const page = pdf.addPage([pageW, pageH]);
      const availW = pageW - marginPt * 2;
      const availH = pageH - marginPt * 2;

      let drawW = imgW;
      let drawH = imgH;

      if (fit) {
        const scaleX = availW / imgW;
        const scaleY = availH / imgH;
        const scale = Math.min(scaleX, scaleY, 1);
        drawW = imgW * scale;
        drawH = imgH * scale;
      }

      const x = marginPt + (availW - drawW) / 2;
      const y = marginPt + (availH - drawH) / 2;

      page.drawImage(embeddedImg, { x, y, width: drawW, height: drawH });
    }

    const result = await pdf.save({ useObjectStreams: true });
    cleanup(files);

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="images.pdf"' });
    res.send(Buffer.from(result));
  } catch (err) {
    cleanup(files);
    console.error('Image to PDF error:', err);
    res.status(500).json({ error: 'Failed to convert images to PDF.' });
  }
});

module.exports = router;
