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

// PATCH /api/public/sign/:token/status - Update signature status
router.patch('/sign/:token/status', async (req, res) => {
  try {
    const { status, rejectionReason } = req.body; // 'signed', 'rejected'
    
    const signatureLink = await SignatureLink.findOne({ 
      token: req.params.token,
      expiresAt: { $gt: new Date() },
      used: false 
    });

    if (!signatureLink) {
      return res.status(404).json({ msg: 'Invalid or expired link' });
    }

    // Update link status
    signatureLink.status = status;
    signatureLink.rejectionReason = rejectionReason || null;
    signatureLink.used = status === 'signed';
    
    if (status === 'viewed') signatureLink.viewedAt = new Date();
    if (status === 'signed') signatureLink.signedAt = new Date();
    
    await signatureLink.save();

    // Update document status
    const doc = await Document.findById(signatureLink.documentId);
    const request = doc.signatureRequests.id(signatureLink._id);
    if (request) {
      request.status = status;
      request.rejectionReason = rejectionReason || null;
      request.signedAt = status === 'signed' ? new Date() : null;
      await doc.save();
    }

    res.json({ 
      success: true, 
      status,
      message: status === 'signed' ? 'Document signed successfully!' : 'Status updated'
    });
  } catch (err) {
    res.status(500).json({ msg: 'Status update failed' });
  }
});


module.exports = router;
