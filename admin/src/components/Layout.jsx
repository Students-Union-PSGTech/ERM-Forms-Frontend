import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../api';
import { LogOut, Code, BarChart3, Menu, X, Package, TrendingUp, FileText, Download, Loader2 } from 'lucide-react';

export default function Layout({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [summaryPdfUrl, setSummaryPdfUrl] = useState(null);
  const [summaryPdfBlob, setSummaryPdfBlob] = useState(null);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const [summaryFileName, setSummaryFileName] = useState('event_summary');

  useEffect(() => {
    return () => {
      if (summaryPdfUrl) {
        URL.revokeObjectURL(summaryPdfUrl);
      }
    };
  }, [summaryPdfUrl]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/cards', icon: BarChart3, label: 'Dashboard' },
    { to: '/add', icon: Code, label: 'Add User' },
    { to: '/items', icon: Package, label: 'Items' },
    { to: '/stats', icon: TrendingUp, label: 'Statistics' },
    { to: '/edit-access', icon: Code, label: 'Edit Access' },
    ...(user?.role === 'admin' ? [{ to: '/logs', icon: FileText, label: 'Server Logs' }] : [])
  ];

  const openSummaryModal = () => {
    setSummaryModalOpen(true);
  };

  const closeSummaryModal = () => {
    setSummaryModalOpen(false);
    if (summaryPdfUrl) {
      URL.revokeObjectURL(summaryPdfUrl);
      setSummaryPdfUrl(null);
    }
    setSummaryPdfBlob(null);
  };

  const handleEventSummary = async () => {
    if (summaryLoading) return;
    setSummaryError('');
    setSummaryLoading(true);

    if (summaryPdfUrl) {
      URL.revokeObjectURL(summaryPdfUrl);
      setSummaryPdfUrl(null);
    }

    try {
      const response = await adminAPI.getEventsSummaryPDF();
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setSummaryFileName('event_summary');

      setSummaryPdfBlob(blob);
      setSummaryPdfUrl(url);
      setSidebarOpen(false);
      openSummaryModal();
    } catch (err) {
      setSummaryError(err.response?.data?.message || err.message || 'Failed to load summary PDF');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDownloadSummary = () => {
    if (!summaryPdfBlob) {
      handleEventSummary();
      return;
    }

    const url = URL.createObjectURL(summaryPdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${summaryFileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
              <button
                onClick={handleEventSummary}
                disabled={summaryLoading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 mt-3 rounded-lg text-sm font-medium transition-all bg-white/10 text-white hover:bg-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {summaryLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                Event Summary
              </button>
            </nav>

            {summaryError && (
              <div className="mt-3 px-3 py-2 text-xs text-white bg-white/10 border border-white/20 rounded-lg">
                {summaryError}
              </div>
            )}

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
              <button
                onClick={handleEventSummary}
                disabled={summaryLoading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 mt-3 rounded-lg text-sm font-medium transition-all bg-white/10 text-white hover:bg-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {summaryLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                Event Summary
              </button>
            </nav>

            {summaryError && (
              <div className="mt-3 px-3 py-2 text-xs text-white bg-white/10 border border-white/20 rounded-lg">
                {summaryError}
              </div>
            )}

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

      {summaryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Event Summary Report
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadSummary}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-yellow transition-colors"
                  disabled={summaryLoading}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={closeSummaryModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-6">
              {summaryPdfUrl ? (
                <iframe
                  src={summaryPdfUrl}
                  className="w-full h-full border rounded-lg"
                  title="Event Summary PDF"
                  frameBorder="0"
                  allowFullScreen
                  style={{ minHeight: '500px' }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  {summaryLoading ? (
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p>Loading summary PDF...</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No PDF to display.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
