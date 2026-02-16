// Web - Document Signature App/SealFlow/client/src/components/AuditTrail.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AuditTrail = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAudit();
  }, [fileId, token]);

  const fetchAudit = async () => {
    try {
      const res = await axios.get(`/api/docs/${fileId}/audit`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAudits(res.data.logs || []);
    } catch (err) {
      console.error('Audit fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading audit trail...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Audit Trail
            </h1>
            <p className="text-xl text-gray-600 mt-2">{audits.length} events tracked</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 font-medium"
          >
            ← Back to Documents
          </button>
        </div>

        {audits.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No audit events</h3>
            <p className="text-gray-500 text-lg">No signing activity yet for this document</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-6 text-white">
              <h2 className="text-2xl font-bold">Complete Signing History</h2>
              <p className="opacity-90 mt-1">IP addresses, timestamps, and user details</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {audits.map((audit, index) => (
                    <tr key={audit.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          audit.action === 'document_signed' ? 'bg-green-100 text-green-800' :
                          audit.action === 'signature_link_sent' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {audit.action?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{audit.user}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(audit.timestamp).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-xs rounded-md text-gray-800">
                          {audit.ip}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTrail;
