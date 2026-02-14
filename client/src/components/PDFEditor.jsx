// WEB - Document Signature App/SealFlow/client/src/components/PDFEditor.jsx

import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PDFEditor = ({ doc, onClose }) => {
  const { token } = useAuth();
  const [signatures, setSignatures] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchSignatures();
  }, [doc?._id, token]);

  const fetchSignatures = async () => {
    try {
      const res = await axios.get(`/api/signatures/${doc._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSignatures(res.data);
    } catch (err) {
      console.error('Failed to fetch signatures');
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e40af';
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const createSignaturePreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // FIXED: Check if canvas has any non-transparent pixels
    let hasContent = false;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 255) { // Alpha channel
        hasContent = true;
        break;
      }
    }
    
    if (!hasContent) {
      alert('Please draw a signature first');
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');
    const previewId = Date.now();
    
    setSignatures(prev => [...prev, {
      id: previewId,
      dataUrl,
      x: 100,
      y: 100,
      width: 150,
      height: 50
    }]);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Sign Document</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">✕</button>
          </div>
          <p>{doc?.originalName}</p>
        </div>
        <div className="flex flex-1 p-6 overflow-hidden">
          <div className="flex-1 border-r pr-6">
            <div ref={containerRef} className="relative w-full h-[500px] bg-gray-100 rounded-xl border-2 border-dashed border-blue-300">
              <img src={`/uploads/${doc?.filename}`} alt="PDF" className="w-full h-full object-contain" />
              {signatures.map(sig => (
                <div key={sig.id} className="absolute bg-white border-2 border-green-400 rounded shadow-lg p-1" 
                     style={{ left: sig.x, top: sig.y, width: sig.width, height: sig.height }}>
                  <img src={sig.dataUrl} className="w-full h-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="w-80 pl-6">
            <h3 className="font-bold mb-4">Draw Signature</h3>
            <canvas ref={canvasRef} width={300} height={120} className="w-full h-32 border-2 border-dashed rounded-xl mb-4 cursor-crosshair"
              onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} />
            <button onClick={createSignaturePreview} 
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold mb-4">
              Add to PDF
            </button>
            <div className="text-sm text-gray-600 space-y-1">
              <div>{signatures.length} signature{signatures.length !== 1 ? 's' : ''}</div>
              <button onClick={fetchSignatures} className="w-full text-xs bg-green-500 text-white py-2 rounded mt-2">
                Save Positions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFEditor;
