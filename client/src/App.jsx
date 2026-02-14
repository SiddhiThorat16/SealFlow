// WEB - Document Signature App/SealFlow/client/src/App.jsx

import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import PDFEditor from './components/PDFEditor';  // FIXED: Correct components/ path

function AppContent() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
