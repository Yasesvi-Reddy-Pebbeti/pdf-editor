const express = require('express');
const router = express.Router();
const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');
const fs = require('fs');
const { anyUpload, cleanup } = require('../middleware/upload');

router.post('/', anyUpload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]), async (req, res) => {
  const file = req.files?.file?.[0];
  const imageFile = req.files?.image?.[0];
  if (!file) return res.status(400).json({ error: 'Please upload a PDF file.' });

  const {
    type = 'text',
    text = 'WATERMARK',
    fontSize = '40',
    opacity = '0.3',
    rotation = '45',
    color = '#FF0000',
    position = 'center',
  } = req.body;

  const filesToClean = [file, imageFile].filter(Boolean);

  try {
    const bytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    const totalPages = pdf.getPageCount();

    const parseColor = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return rgb(r, g, b);
    };

    let embedImage = null;
    if (type === 'image' && imageFile) {
      const imgBytes = fs.readFileSync(imageFile.path);
      const mime = imageFile.mimetype;
      if (mime === 'image/png') embedImage = await pdf.embedPng(imgBytes);
      else embedImage = await pdf.embedJpg(imgBytes);
    }

    for (let i = 0; i < totalPages; i++) {
      const page = pdf.getPage(i);
      const { width, height } = page.getSize();

      if (type === 'text' || !embedImage) {
        const fSize = parseFloat(fontSize) || 40;
        const textWidth = font.widthOfTextAtSize(text, fSize);
        const textHeight = font.heightAtSize(fSize);

        let x = width / 2 - textWidth / 2;
        let y = height / 2 - textHeight / 2;

        if (position === 'top-left') { x = 20; y = height - fSize - 20; }
        else if (position === 'top-right') { x = width - textWidth - 20; y = height - fSize - 20; }
        else if (position === 'bottom-left') { x = 20; y = 20; }
        else if (position === 'bottom-right') { x = width - textWidth - 20; y = 20; }

        page.drawText(text, {
          x, y,
          size: fSize,
          font,
          color: parseColor(color || '#FF0000'),
          opacity: parseFloat(opacity) || 0.3,
          rotate: degrees(parseFloat(rotation) || 45),
        });
      } else {
        const imgDims = embedImage.scale(0.5);
        const x = width / 2 - imgDims.width / 2;
        const y = height / 2 - imgDims.height / 2;
        page.drawImage(embedImage, {
          x, y,
          width: imgDims.width,
          height: imgDims.height,
          opacity: parseFloat(opacity) || 0.3,
          rotate: degrees(parseFloat(rotation) || 0),
        });
      }
    }

    const result = await pdf.save({ useObjectStreams: true });
    cleanup(filesToClean);

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="watermarked.pdf"' });
    res.send(Buffer.from(result));
  } catch (err) {
    cleanup(filesToClean);
    console.error('Watermark error:', err);
    res.status(500).json({ error: 'Failed to add watermark.' });
  }
});

module.exports = router;
