// WEB - Document Signature App/SealFlow/server/routes/documents/js

const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Document = require('../models/Document');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');  // ADD PDF-LIB
const router = express.Router();

// POST /api/docs/upload - Protected
router.post('/upload', auth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No PDF file uploaded' });
    }

    const doc = new Document({
      filename: req.file.filename,
      filepath: req.file.path,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      userId: req.user._id
    });

    await doc.save();
    res.status(201).json({
      msg: 'PDF uploaded successfully',
      document: {
        id: doc._id,
        filename: doc.filename,
        originalName: doc.originalName,
        size: doc.size,
        status: doc.status
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ msg: 'Upload failed' });
  }
});

// GET /api/docs - List user's documents (protected)
router.get('/', auth, async (req, res) => {
  const docs = await Document.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(docs);
});

// POST /api/docs/:id/sign - Generate signed PDF (NEW)
router.post('/:id/sign', auth, async (req, res) => {
  try {
    const { signatures } = req.body;
    
    // Verify document ownership
    const doc = await Document.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    if (!doc) return res.status(404).json({ msg: 'Document not found' });

    // Read original PDF
    const originalPdfBytes = fs.readFileSync(`uploads/${doc.filename}`);
    const pdfDoc = await PDFDocument.load(originalPdfBytes);
    const pages = pdfDoc.getPages();

    // Embed signatures
    for (const sig of signatures) {
      const page = pages[sig.page - 1];
      const { width, height } = page.getSize();
      
      // Convert base64 signature to PNG bytes
      const signatureImageBytes = Uint8Array.from(
        atob(sig.signatureData.split(',')[1]), 
        c => c.charCodeAt(0)
      );
      const pngImage = await pdfDoc.embedPng(signatureImageBytes);
      
      // Position signature (PDF Y-axis is flipped)
      page.drawImage(pngImage, {
        x: sig.x,
        y: height - sig.y - sig.height,
        width: sig.width || 150,
        height: sig.height || 50,
      });
    }

    // Save signed PDF
    const signedPdfBytes = await pdfDoc.save();
    const signedFilename = `signed_${doc.filename}`;
    fs.mkdirSync('uploads/signed', { recursive: true });
    fs.writeFileSync(`uploads/signed/${signedFilename}`, signedPdfBytes);

    // Update document
    doc.signedFilename = signedFilename;
    doc.signedAt = new Date();
    await doc.save();

    res.json({ 
      downloadUrl: `/uploads/signed/${signedFilename}`,
      msg: 'PDF signed successfully!'
    });
  } catch (err) {
    console.error('PDF signing error:', err);
    res.status(500).json({ msg: 'Failed to generate signed PDF' });
  }
});

module.exports = router;
