import { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Menu } from 'lucide-react';

import Sidebar from './components/Layout/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import UserManagement from './pages/UserManagement';

const ProtectedRoute = ({ children, allowedPermissions }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedPermissions && !allowedPermissions.some(p => user.role?.permissions?.includes(p))) {
    return <Navigate to="/" replace />; // Or to a "Not Authorized" page
  }

  return children;
};

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen overflow-hidden">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-dark-900 text-white p-4 flex justify-between items-center z-20 shadow-sm border-b border-dark-800">
        <h1 className="font-bold text-xl">FinanceApp</h1>
        <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-dark-800 rounded">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 w-64 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}>
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto h-[calc(100vh-60px)] md:h-screen w-full">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <MainLayout>
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="transactions" element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                } />
                <Route 
                  path="users" 
                  element={
                    <ProtectedRoute allowedPermissions={['manage_users']}>
                      <UserManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
