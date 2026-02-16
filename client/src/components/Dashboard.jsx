// WEB - Document Signature App/SealFlow/client/src/components/Dashboard.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDocuments } from '../utils/api';
import DocumentPreview from './DocumentPreview';
import PDFEditor from './PDFEditor';  // Import separate component

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSignature = (doc) => {
    setSelectedDoc(doc);
    setShowSignatureModal(true);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Documents</h1>
            <p className="mt-2 text-sm text-gray-500">Welcome back, {user?.name}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Upload New
            </button>
            <button 
              onClick={logout}
              className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4 flex items-center justify-center bg-indigo-50 rounded-xl">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-500 mb-6">Upload your first PDF to get started.</p>
            <div className="flex justify-center">
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Upload PDF</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentPreview 
                key={doc._id} 
                filePath={doc.filepath} 
                filename={doc.originalName}
                doc={doc}
                onPlaceSignature={handlePlaceSignature}
              />
            ))}
          </div>
        )}

        {showSignatureModal && selectedDoc && (
          <PDFEditor 
            doc={selectedDoc} 
            onClose={() => setShowSignatureModal(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
