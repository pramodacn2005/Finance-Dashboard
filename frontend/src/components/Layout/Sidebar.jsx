import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Receipt, Users, LogOut, X, Wallet } from 'lucide-react';

const Sidebar = ({ closeSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-dark-900 text-white min-h-screen flex flex-col transition-all duration-300">
      <div className="p-6 flex justify-between items-center border-b border-dark-800">
        <div className="flex items-center space-x-3">
          <Wallet className="w-8 h-8 text-primary-500" />
          <span className="text-xl font-bold tracking-tight">FinDash</span>
        </div>
        <button onClick={closeSidebar} className="md:hidden text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="px-6 py-4 text-sm text-gray-400">
        <p>Logged in as: <span className="text-white capitalize">{user?.name}</span></p>
        <p className="text-xs uppercase mt-1 px-2 py-0.5 bg-dark-800 rounded inline-block">{user?.role?.name}</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavLink
          to="/"
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-dark-800 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/transactions"
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-dark-800 hover:text-white'
            }`
          }
        >
          <Receipt className="w-5 h-5" />
          <span>Transactions</span>
        </NavLink>

        {user?.role?.permissions?.includes('manage_users') && (
          <NavLink
            to="/users"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-dark-800 hover:text-white'
              }`
            }
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </NavLink>
        )}
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-dark-800 px-4 py-3 rounded-lg w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
