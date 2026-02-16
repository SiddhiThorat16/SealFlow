// WEB - Document Signature App/SealFlow/server/models/Document.js

const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'signed', 'rejected', 'expired'], 
    default: 'pending' 
  },
  signatureRequests: [{
    signerEmail: String,
    signerName: String,
    status: { 
      type: String, 
      enum: ['pending', 'sent', 'viewed', 'signed', 'rejected'], 
      default: 'pending' 
    },
    rejectionReason: String,
    signedAt: Date,
    viewedAt: Date
  }],
  signatures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Signature' }]
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
