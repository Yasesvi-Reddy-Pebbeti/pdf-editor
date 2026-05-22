const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const { pdfUpload, cleanup } = require('../middleware/upload');

// Polyfill DOMMatrix and Path2D so pdfjs-dist doesn't warn or break
if (!global.DOMMatrix) {
  global.DOMMatrix = class DOMMatrix {
    constructor(init) {
      this.a=1;this.b=0;this.c=0;this.d=1;this.e=0;this.f=0;
      this.m11=1;this.m12=0;this.m13=0;this.m14=0;
      this.m21=0;this.m22=1;this.m23=0;this.m24=0;
      this.m31=0;this.m32=0;this.m33=1;this.m34=0;
      this.m41=0;this.m42=0;this.m43=0;this.m44=1;
    }
    multiply(m) { return new DOMMatrix(); }
    translate(x,y,z=0) { const m=new DOMMatrix();m.e=x;m.f=y;return m; }
    scale(x,y=x,z=1) { const m=new DOMMatrix();m.a=x;m.d=y;return m; }
    rotate(a) { return new DOMMatrix(); }
    inverse() { return new DOMMatrix(); }
  };
}
if (!global.Path2D) {
  global.Path2D = class Path2D {
    constructor() {}
    addPath() {}
    closePath() {}
    moveTo() {}
    lineTo() {}
    bezierCurveTo() {}
    quadraticCurveTo() {}
    arc() {}
    rect() {}
  };
}

// Lazy-load pdfjs and @napi-rs/canvas
let pdfjsLib, createCanvas;
try {
  pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
  createCanvas = require('@napi-rs/canvas').createCanvas;
} catch (_) {
  pdfjsLib = null;
  createCanvas = null;
}

router.post('/', pdfUpload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Please upload a PDF file.' });

  if (!pdfjsLib || !createCanvas) {
    cleanup(file);
    return res.status(501).json({
      error: 'PDF to Image requires the canvas native module.',
      hint: 'Run: npm install canvas in the backend directory.',
    });
  }

  const {
    format = 'png',
    scale = '2',
    pages = 'all',
  } = req.body;

  try {
    const bytes = new Uint8Array(fs.readFileSync(file.path));
    pdfjsLib.GlobalWorkerOptions.workerSrc = '';

    const pdfDoc = await pdfjsLib.getDocument({ data: bytes, disableWorker: true }).promise;
    const totalPages = pdfDoc.numPages;

    let pageNums = [];
    if (pages === 'all') {
      pageNums = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      pageNums = pages.split(',').flatMap(part => {
        part = part.trim();
        if (part.includes('-')) {
          const [s, e] = part.split('-').map(Number);
          return Array.from({ length: e - s + 1 }, (_, i) => s + i);
        }
        return [parseInt(part, 10)];
      }).filter(n => n >= 1 && n <= totalPages);
    }

    const sc = parseFloat(scale) || 2;
    const outputDir = path.join(__dirname, '../outputs', uuidv4());
    fs.mkdirSync(outputDir, { recursive: true });

    const imgPaths = [];
    for (const pageNum of pageNums) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: sc });
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      const ctx = canvas.getContext('2d');

      await page.render({ canvasContext: ctx, viewport }).promise;

      const ext = format === 'jpg' ? 'jpg' : 'png';
      const outPath = path.join(outputDir, `page_${pageNum}.${ext}`);

      if (format === 'jpg') {
        fs.writeFileSync(outPath, canvas.toBuffer('image/jpeg', { quality: 0.9 }));
      } else {
        fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
      }
      imgPaths.push({ path: outPath, name: `page_${pageNum}.${ext}` });
    }

    cleanup(file);

    if (imgPaths.length === 1) {
      const data = fs.readFileSync(imgPaths[0].path);
      fs.rmSync(outputDir, { recursive: true, force: true });
      const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
      res.set({ 'Content-Type': mime, 'Content-Disposition': `attachment; filename="${imgPaths[0].name}"` });
      return res.send(data);
    }

    res.set({ 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename="pdf_images.zip"' });
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);
    imgPaths.forEach(({ path: p, name }) => archive.file(p, { name }));
    archive.on('end', () => fs.rmSync(outputDir, { recursive: true, force: true }));
    archive.on('error', () => fs.rmSync(outputDir, { recursive: true, force: true }));
    archive.finalize();
  } catch (err) {
    cleanup(file);
    console.error('PDF to image error:', err);
    res.status(500).json({ error: 'Failed to convert PDF to images.' });
  }
});

module.exports = router;
