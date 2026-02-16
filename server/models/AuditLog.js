// Web - Document Signature App/SealFlow/server/models/AuditLog.js

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  action: { type: String, required: true }, // "signature_added", "document_signed", "link_sent"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  signerEmail: String,
  ipAddress: String,
  userAgent: String,
  details: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
