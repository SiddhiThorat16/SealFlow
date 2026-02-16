// Web - Document Signature App/SealFlow/server/routes/PublicSign.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PDFEditor from '../components/PDFEditor';

const PublicSign = () => {
  const { token } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    fetchPublicDoc();
  }, [token]);

  const fetchPublicDoc = async () => {
    try {
      const res = await fetch(`/api/public/sign/${token}`);
      const data = await res.json();
      if (data.document) {
        setDoc(data.document);
        setStatus(data.document.signatureRequests?.[0]?.status || 'pending');
      } else {
        alert(data.msg || 'Invalid link');
      }
    } catch (err) {
      alert('Error loading document');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Update signature status
  const updateStatus = async (newStatus, reason = '') => {
    try {
      const res = await fetch(`/api/public/sign/${token}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, rejectionReason: reason })
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus(newStatus);
        if (newStatus === 'signed') {
          alert('Document signed successfully!');
        } else {
          alert('Status updated');
        }
      }
    } catch (err) {
      alert('Status update failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!doc) return <div className="flex items-center justify-center min-h-screen">Invalid or expired link</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 flex items-center justify-between">
          <div>
            <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm font-semibold ${
              status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              status === 'viewed' ? 'bg-blue-100 text-blue-800' :
              status === 'signed' ? 'bg-green-100 text-green-800' :
              status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
              <span className="text-xs opacity-90">Status:</span>
              <span className="uppercase text-sm">{status}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Please use the buttons to sign or reject this document</div>
          </div>
          <div className="flex gap-3">
            {status === 'pending' && (
              <> 
                <button 
                  onClick={() => updateStatus('signed')}
                  className="px-5 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm"
                >
                  ✅ Sign Document
                </button>
                <button 
                  onClick={() => {
                    const reason = prompt('Rejection reason?') || 'No reason provided';
                    updateStatus('rejected', reason);
                  }}
                  className="px-5 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-sm"
                >
                  ❌ Reject
                </button>
              </>
            )}
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">Sign Document</h1>
          <p className="text-lg text-gray-600">Please add your signature to complete signing</p>
        </div>
        <PDFEditor doc={doc} onClose={() => window.close()} />
      </div>
    </div>
  );
};

export default PublicSign;
