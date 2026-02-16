// Web - Document Signature App/SealFlow/server/middleware/audit.js

const AuditLog = require('../models/AuditLog');

const auditMiddleware = async (req, res, next) => {
  const originalJson = res.json;
  
  res.json = async function(body) {
    // Log signature/document actions
    if (req.path.includes('/docs') && (req.path.includes('/sign') || req.path.includes('email-signature-link'))) {
      try {
        const auditData = {
          documentId: req.params.id || req.params.fileId,
          action: req.path.includes('/sign') ? 'document_signed' : 'signature_link_sent',
          ipAddress: req.ip || req.connection.remoteAddress || req.socket.remoteAddress,
          userAgent: req.get('User-Agent'),
          details: { 
            endpoint: req.path,
            method: req.method,
            status: res.statusCode,
            body: req.body
          }
        };

        // Authenticated user or public signer
        if (req.user) auditData.userId = req.user._id;
        if (req.body.signerEmail) auditData.signerEmail = req.body.signerEmail;

        await AuditLog.create(auditData);
      } catch (err) {
        console.error('Audit log error:', err);
      }
    }

    return originalJson.call(this, body);
  };

  next();
};

module.exports = auditMiddleware;
