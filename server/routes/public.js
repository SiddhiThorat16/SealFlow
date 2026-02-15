// Web - Document Signature App/SealFlow/server/routes/public.js

const express = require('express');
const SignatureLink = require('../models/SignatureLink');
const Document = require('../models/Document');
const router = express.Router();

// GET /api/public/sign/:token - Public signature page
router.get('/sign/:token', async (req, res) => {
  try {
    const signatureLink = await SignatureLink.findOne({ 
      token: req.params.token, 
      expiresAt: { $gt: new Date() },
      used: false 
    });

    if (!signatureLink) {
      return res.status(404).json({ msg: 'Invalid or expired link' });
    }

    const doc = await Document.findById(signatureLink.documentId);
    res.json({
      document: {
        id: doc._id,
        filename: doc.filename,
        originalName: doc.originalName
      },
      signerEmail: signatureLink.signerEmail
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
