// WEB - Document Signature App/SealFlow/server/routes/documents/js

const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Document = require('../models/Document');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const nodemailer = require('nodemailer');  // ADD FOR EMAIL
const crypto = require('crypto');          // ADD FOR TOKEN
const SignatureLink = require('../models/SignatureLink'); // ADD MODEL
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

// POST /api/docs/:id/email-signature-link - Send email with signing link (NEW)
router.post('/:id/email-signature-link', auth, async (req, res) => {
  try {
    const { signerEmail, signerName } = req.body;
    
    // Verify document ownership
    const doc = await Document.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    if (!doc) return res.status(404).json({ msg: 'Document not found' });

    // Generate secure token (expires 7 days)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Save signature link
    const signatureLink = new SignatureLink({
      documentId: doc._id,
      signerEmail,
      signerName: signerName || '',
      token,
      expiresAt
    });
    await signatureLink.save();

    // Send email with Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"SealFlow" <${process.env.EMAIL_USER}>`,
      to: signerEmail,
      subject: `Please sign: ${doc.originalName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e40af;">Document awaiting your signature</h2>
          <p>Hi ${signerName || 'there'},</p>
          <p>You've been asked to sign <strong>${doc.originalName}</strong></p>
          <br>
          <a href="http://localhost:5173/public-sign/${token}" 
             style="background: linear-gradient(45deg, #1e40af, #3b82f6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(30,64,175,0.3);">
            ✍️ Sign Document Now
          </a>
          <br><br>
          <p style="font-size: 12px; color: #666;">
            This secure link expires in 7 days. 
            <br>If you didn't expect this, safely ignore it.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 11px; color: #999; text-align: center;">
            Sent by SealFlow • Professional PDF Signing
          </p>
        </div>
      `
    });

    res.json({ 
      msg: 'Signature link emailed successfully!', 
      token,
      signerEmail 
    });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ msg: 'Failed to send email' });
  }
});

// GET /api/docs/:fileId/audit - Get audit trail
router.get('/:fileId/audit', auth, async (req, res) => {
  try {
    const audits = await AuditLog.find({ documentId: req.params.fileId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      documentId: req.params.fileId,
      count: audits.length,
      logs: audits.map(log => ({
        id: log._id,
        action: log.action,
        timestamp: log.createdAt,
        user: log.userId ? `${log.userId.name} (${log.userId.email})` : 'Public User',
        email: log.signerEmail || 'N/A',
        ip: log.ipAddress,
        details: log.details
      }))
    });
  } catch (err) {
    console.error('Audit error:', err);
    res.status(500).json({ success: false, msg: 'Audit fetch failed' });
  }
});

module.exports = router;
