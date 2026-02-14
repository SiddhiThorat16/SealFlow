// Web - Document Signature App/SealFlow/server/routes/signatures.js

const express = require('express');
const auth = require('../middleware/auth');
const Signature = require('../models/Signature');
const router = express.Router();

// GET /api/signatures/:docId - Get signatures for document
router.get('/:docId', auth, async (req, res) => {
  try {
    const signatures = await Signature.find({ 
      documentId: req.params.docId,
      userId: req.user._id 
    });
    res.json(signatures);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/signatures - Save signature position
router.post('/', auth, async (req, res) => {
  try {
    const { documentId, x, y, page = 1 } = req.body;
    
    // Verify user owns document
    const Document = require('../models/Document');
    const doc = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!doc) return res.status(403).json({ msg: 'Document not found' });

    const signature = new Signature({
      documentId,
      userId: req.user._id,
      x,
      y,
      page
    });

    await signature.save();
    res.status(201).json(signature);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
