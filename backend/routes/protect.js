const express = require('express');
const router = express.Router();
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { pdfUpload, cleanup } = require('../middleware/upload');

router.post('/', pdfUpload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Please upload a PDF file.' });

  const { userPassword = '', ownerPassword = '' } = req.body;
  if (!userPassword && !ownerPassword) {
    cleanup(file);
    return res.status(400).json({ error: 'Please provide at least a user password or owner password.' });
  }

  const outputPath = path.join(__dirname, '../outputs', `${uuidv4()}.pdf`);

  // Try qpdf first (best method)
  const uPwd = userPassword || '';
  const oPwd = ownerPassword || userPassword;
  const args = ['--encrypt', uPwd, oPwd, '128', '--', file.path, outputPath];

  execFile('qpdf', args, (err) => {
    if (err) {
      // qpdf not available — inform user
      cleanup(file);
      try { fs.unlinkSync(outputPath); } catch (_) {}
      return res.status(501).json({
        error: 'PDF encryption requires QPDF to be installed on the server.',
        hint: 'Install QPDF from https://qpdf.sourceforge.io/ and add it to your PATH.',
        feature: 'protect',
      });
    }

    const data = fs.readFileSync(outputPath);
    cleanup(file);
    try { fs.unlinkSync(outputPath); } catch (_) {}

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="protected.pdf"' });
    res.send(data);
  });
});

module.exports = router;
