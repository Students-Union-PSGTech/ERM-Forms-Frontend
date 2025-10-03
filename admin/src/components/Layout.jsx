import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Code, BarChart3, Menu, X, Package, TrendingUp } from 'lucide-react';

export default function Layout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/cards', icon: BarChart3, label: 'Dashboard' },
    { to: '/add', icon: Code, label: 'Add User' },
    { to: '/items', icon: Package, label: 'Items' },
    { to: '/stats', icon: TrendingUp, label: 'Statistics' },
    { to: '/edit-access', icon: Code, label: 'Edit Access' }
  ];

  const NavItem = ({ to, icon: Icon, label, mobile = false }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 rounded-lg text-sm transition-all ${
          isActive
            ? 'bg-accent-yellow text-white shadow-sm'
            : 'text-gray-200 hover:bg-accent-orange hover:text-white'
        } ${mobile ? 'w-full' : ''}`
      }
      onClick={() => setSidebarOpen(false)}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0  transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col flex-grow bg-accent-orange shadow-xl">
          <div className="flex items-center px-6 py-4 bg-gradient-to-r from-accent-orange to-accent-yellow">
            <button
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="p-2 rounded-md bg-accent-orange backdrop-blur-sm hover:bg-accent-orange text-white mr-3"
            >
              {desktopSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-lg font-semibold text-white">ERM Forms</h1>
          </div>

          <div className="flex flex-col flex-grow px-4 py-4 bg-accent-yellow/10 backdrop-blur-sm rounded-lg mx-2">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </nav>

            <div className="mt-auto pt-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm text-gray-200 hover:bg-accent-yellow hover:text-white rounded-lg text-sm transition-all"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed top-0 left-0 right-0 bg-accent-orange shadow-md z-20">
        <div className="flex items-center px-6 py-4 bg-gradient-to-r from-accent-orange to-accent-yellow">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md bg-accent-orange backdrop-blur-sm hover:bg-accent-orange text-white mr-3"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-lg font-semibold text-white">ERM Forms</h1>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-10 bg-black bg-opacity-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-20 w-60 bg-accent-orange shadow-xl transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 left-4 p-2 rounded-md bg-accent-yellow text-white hover:bg-accent-orange z-30"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col h-full pt-14">
          <div className="flex flex-col flex-grow px-4 py-4 bg-accent-yellow/10 backdrop-blur-sm rounded-lg mx-2">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavItem key={item.to} {...item} mobile />
              ))}
            </nav>

            <div className="mt-auto pt-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm text-gray-200 hover:bg-accent-yellow hover:text-white rounded-lg text-sm transition-all"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${desktopSidebarOpen ? 'lg:ml-60' : ''} flex-1 flex flex-col`}>
        {!desktopSidebarOpen && (
          <button
            onClick={() => setDesktopSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 p-2 rounded-md bg-accent-orange text-white hover:bg-accent-yellow shadow-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
