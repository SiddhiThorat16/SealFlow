// WEB - Document Signature App/SealFlow/client/src/components/DocumentPreview.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";  // ADD AUTH CONTEXT

const DocumentPreview = ({ filePath, filename, doc, onAction, onPlaceSignature }) => {
  const [signatures, setSignatures] = useState([]);
  const { token } = useAuth();  // ADD TOKEN

  // FIXED: Add Authorization header to prevent 401
  useEffect(() => {
    if (doc?._id && token) {
      fetch(`/api/signatures/${doc._id}`, {
        headers: {
          "Authorization": `Bearer ${token}`  // FIX 401 ERROR
        }
      })
        .then((res) => res.json())
        .then(setSignatures)
        .catch(console.error);
    }
  }, [doc?._id, token]);  // ADD token dependency

  const proxyUrl = `/uploads/${filePath.split(/[\\/]/).pop()}`;

  // NEW: Get document status for display
  const getStatusDisplay = () => {
    if (!doc?.status) return 'Pending signature';
    switch (doc.status) {
      case 'signed': return '✅ Signed';
      case 'rejected': return '❌ Rejected';
      case 'expired': return '⏰ Expired';
      default: return '⏳ Pending signature';
    }
  };

  return (
    <div className="relative group">
      <div className="border rounded-lg shadow-sm bg-white overflow-hidden max-h-[500px] hover:shadow-lg transition-shadow transform hover:-translate-y-1">
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg truncate pr-2 flex items-center gap-3">
              <span className="text-sm text-gray-400">📄</span>
              <span className="truncate">{filename}</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">{getStatusDisplay()}</p>
          </div>
          {doc?.status && (
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
              doc.status === 'signed' ? 'bg-green-100 text-green-800' :
              doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
              doc.status === 'expired' ? 'bg-orange-100 text-orange-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {doc.status === 'signed' ? 'Signed' : doc.status === 'rejected' ? 'Rejected' : doc.status === 'expired' ? 'Expired' : 'Pending'}
            </span>
          )}
        </div>
        <div className="p-6 bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center h-64">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-1">PDF Preview</h4>
          <p className="text-gray-600 text-sm mb-4 text-center max-w-xs truncate">
            {filename.length > 40 ? filename.slice(0, 40) + "..." : filename}
          </p>
          <a
            href={`http://localhost:5000/uploads/${filePath.split(/[\\/]/).pop()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Open PDF
          </a>
        </div>
        <div className="p-3 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{Math.round(filePath?.size / 1024) || 0} KB</span>
            <span className="font-medium text-green-600">
              {signatures.length > 0
                ? `${signatures.length} signature${signatures.length > 1 ? "s" : ""}`
                : "Ready to Sign"}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute -top-3 left-4 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={() => {
            if (onAction) onAction("sign");
            else if (onPlaceSignature) onPlaceSignature(doc);
          }}
          className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow hover:bg-green-700 flex items-center gap-2"
        >
          ✍️ <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={() => onAction?.("audit")}
          className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow hover:bg-purple-700 flex items-center gap-2"
        >
          📊 <span className="hidden sm:inline">Audit</span>
        </button>
      </div>
    </div>
  );
};

export default DocumentPreview;
