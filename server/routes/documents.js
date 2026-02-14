// WEB - Document Signature App/SealFlow/server/routes/documents/js

const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Document = require('../models/Document');
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

module.exports = router;
