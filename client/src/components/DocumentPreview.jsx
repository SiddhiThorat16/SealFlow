// WEB - Document Signature App/SealFlow/client/src/components/DocumentPreview.jsx

const DocumentPreview = ({ filePath, filename }) => {
  const proxyUrl = `/uploads/${filePath.split(/[\\/]/).pop()}`;

  return (
    <div className="border rounded-lg shadow-sm bg-white overflow-hidden max-h-[500px] hover:shadow-md transition-shadow">
      <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
        <h3 className="font-semibold text-gray-900 text-lg truncate pr-2">{filename}</h3>
        <p className="text-xs text-gray-500 mt-1">Pending signature</p>
      </div>
      <div className="p-6 bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center h-64">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-1">PDF Preview</h4>
        <p className="text-gray-600 text-sm mb-4 text-center max-w-xs">
          {filename.length > 30 ? filename.slice(0, 30) + '...' : filename}
        </p>
        <a
          href={`http://localhost:5000/uploads/${filePath.split(/[\\/]/).pop()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Open PDF
        </a>
      </div>
      <div className="p-3 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{Math.round(filePath?.size / 1024) || 0} KB</span>
          <span className="font-medium text-green-600">Ready to Sign</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
