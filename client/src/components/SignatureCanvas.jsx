// WEB - Document Signature App/SealFlow/client/src/components/SignatureCanvas.jsx

import { useState, useRef, useCallback } from 'react';

const SignatureCanvas = ({ onSignaturePlace, pageWidth = 800 }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getSignaturePreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL('image/png');
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
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
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const placeSignature = () => {
    const preview = getSignaturePreview();
    if (preview) {
      onSignaturePlace(preview);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-xl shadow-lg border">
      <h3 className="font-semibold text-lg text-gray-900">Draw Signature</h3>
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        className="w-full h-24 border border-gray-200 rounded-lg cursor-crosshair bg-gray-50 hover:border-blue-300 transition-all shadow-sm"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="flex gap-3 pt-2">
        <button
          onClick={placeSignature}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          ✓ Place Signature
        </button>
        <button
          onClick={() => { canvasRef.current?.getContext('2d')?.clearRect(0, 0, 300, 100); }}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
