// WEB - Document Signature App/SealFlow/client/src/components/Dashboard.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDocuments } from '../utils/api';
import DocumentPreview from './DocumentPreview';

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

  // ADD THIS FUNCTION - FIXES ERROR
  const handlePlaceSignature = (doc) => {
    setSelectedDoc(doc);
    setShowSignatureModal(true);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="mt-2 text-lg text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Upload New
            </button>
            <button 
              onClick={logout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-500 mb-6">Upload your first PDF to get started.</p>
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
      </div>

      {/* Signature Modal - Basic placeholder */}
      {showSignatureModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Sign {selectedDoc.originalName}</h2>
            </div>
            <div className="p-6">
              <p>Signature canvas will go here (Day 6)</p>
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => setShowSignatureModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
