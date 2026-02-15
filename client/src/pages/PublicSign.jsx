// Web - Document Signature App/SealFlow/server/routes/PublicSign.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PDFEditor from '../components/PDFEditor';

const PublicSign = () => {
  const { token } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicDoc();
  }, [token]);

  const fetchPublicDoc = async () => {
    try {
      const res = await fetch(`/api/public/sign/${token}`);
      const data = await res.json();
      if (data.document) {
        setDoc(data.document);
      } else {
        alert(data.msg || 'Invalid link');
      }
    } catch (err) {
      alert('Error loading document');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!doc) return <div className="flex items-center justify-center min-h-screen">Invalid or expired link</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Sign Document
          </h1>
          <p className="text-xl text-gray-600">Please add your signature to complete signing</p>
        </div>
        <PDFEditor doc={doc} onClose={() => window.close()} />
      </div>
    </div>
  );
};

export default PublicSign;
