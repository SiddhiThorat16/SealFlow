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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading audit trail...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Audit Trail
            </h1>
            <p className="text-sm text-gray-500 mt-2">{audits.length} events tracked • Secure immutable log</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 hover:shadow-md transition"
          >
            ← Back to Documents
          </button>
        </div>

        {audits.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No audit events</h3>
            <p className="text-gray-500 text-lg">No signing activity yet for this document</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <h2 className="text-2xl font-semibold">Complete Signing History</h2>
              <p className="opacity-90 mt-1 text-sm">IP addresses, timestamps, and user details</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {audits.map((audit, index) => (
                    <tr key={audit.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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
                        <span className="px-2 py-1 bg-gray-50 text-xs rounded-md text-gray-800 border border-gray-100">
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
