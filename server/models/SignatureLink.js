// Web - Document Signature App/SealFlow/server/models/SignatureLink.js

const mongoose = require('mongoose');

const signatureLinkSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  signerEmail: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  signerName: String
}, { timestamps: true });

module.exports = mongoose.model('SignatureLink', signatureLinkSchema);
