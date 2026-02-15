// WEB - Document Signature App/SealFlow/client/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // ADD ROUTER
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import PDFEditor from './components/PDFEditor';
import PublicSign from './pages/PublicSign';

function AppContent() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <Router>  {/* ADD ROUTER WRAPPER */}
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Routes>  {/* ADD ROUTES */}
            <Route path="/" element={<AppContent />} />
            <Route path="/public-sign/:token" element={<PublicSign />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
