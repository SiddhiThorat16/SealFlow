// Web - Document Signature App/SealFlow/server/models/Signature.js

const mongoose = require('mongoose');

const signatureSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  x: { type: Number, required: true },  // Position on page (pixels)
  y: { type: Number, required: true },
  page: { type: Number, default: 1 },
  width: { type: Number, default: 150 },
  height: { type: Number, default: 50 },
  status: { type: String, enum: ['pending', 'signed', 'rejected'], default: 'pending' },
  signatureData: String,  // Base64 signature image (later)
  signedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Signature', signatureSchema);
