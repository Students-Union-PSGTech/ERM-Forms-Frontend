import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../api';
import { LogOut, Code, BarChart3, Menu, X, Package, TrendingUp, FileText, Download, Loader2, Users, Gift, History, ShieldCheck } from 'lucide-react';

function NavItem({ to, icon: Icon, label, mobile }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? 'bg-white/30 text-white font-semibold'
            : 'text-white/80 hover:bg-white/20 hover:text-white'
        }`
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Layout({ children }) {
  const { logout, user, isLoading } = useAuth();
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
      if (summaryPdfUrl) URL.revokeObjectURL(summaryPdfUrl);
    };
  }, [summaryPdfUrl]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Wait for auth to resolve before deriving role — prevents flash of wrong nav
  const userRole = user?.role ?? localStorage.getItem('role') ?? 'member';

  // Don't render nav with wrong role while auth is still loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-orange" />
      </div>
    );
  }

  console.log('[Layout] userRole:', userRole, '| user:', user);

  // ─── Nav items per role ───────────────────────────────────────────────────
  const adminItems = [
    { to: '/cards',       icon: BarChart3,   label: 'Dashboard'    },
    { to: '/add',         icon: Code,        label: 'Add User'     },
    { to: '/items',       icon: Package,     label: 'Items'        },
    { to: '/stocks',      icon: Package,     label: 'Stocks'       },
    { to: '/stats',       icon: TrendingUp,  label: 'Statistics'   },
    { to: '/grant-items', icon: Gift,        label: 'Grant Items'  },
    { to: '/grant-logs',  icon: History,     label: 'Past Grants'  },
    { to: '/edit-access', icon: ShieldCheck, label: 'Edit Access'  },
    { to: '/role-pdf',    icon: Users,       label: 'Role PDFs'    },
    { to: '/logs',        icon: FileText,    label: 'Server Logs'  },
  ];

  const memberItems = [
    { to: '/cards',       icon: BarChart3,   label: 'Dashboard'    },
    { to: '/edit-access', icon: ShieldCheck, label: 'Edit Access'  },
    { to: '/role-pdf',    icon: Users,       label: 'Role PDFs'    },
  ];

  const procurementItems = [
    { to: '/grant-items', icon: Gift,        label: 'Grant Items'  },
    { to: '/grant-logs',  icon: History,     label: 'Past Grants'  },
    { to: '/stocks',      icon: Package,     label: 'Stocks'       },
  ];

  const navItems =
    userRole === 'admin'
      ? adminItems
      : userRole === 'procurement'
      ? procurementItems
      : memberItems;
  // ─────────────────────────────────────────────────────────────────────────

  const openSummaryModal = () => setSummaryModalOpen(true);

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
      setSummaryPdfBlob(blob);
      setSummaryPdfUrl(url);
      openSummaryModal();
    } catch (err) {
      setSummaryError(err?.response?.data?.message || 'Failed to load summary PDF.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleSummaryDownload = () => {
    if (!summaryPdfBlob) return;
    const url = URL.createObjectURL(summaryPdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${summaryFileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full pt-4">
      <div className="flex flex-col flex-grow px-4 py-4 bg-accent-yellow/10 backdrop-blur-sm rounded-lg mx-2">
        {/* Role badge */}
        <div className="mb-4 px-3 py-1.5 rounded-lg bg-white/10 text-center">
          <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
            {userRole}
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} mobile={mobile} />
          ))}

          {/* Event Summary button — admin & member only */}
          {userRole !== 'procurement' && (
            <button
              onClick={handleEventSummary}
              disabled={summaryLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 mt-3 w-full rounded-lg text-sm font-medium transition-all bg-white/10 text-white hover:bg-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {summaryLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
              Event Summary
            </button>
          )}
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
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      {desktopSidebarOpen && (
        <div className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 w-60 bg-accent-orange shadow-xl">
          <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-accent-orange to-accent-yellow">
            <button
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="p-2 rounded-md bg-accent-orange backdrop-blur-sm hover:bg-accent-orange text-white mr-3"
            >
              {desktopSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-lg font-semibold text-white">ERM Forms</h1>
          </div>
          <SidebarContent />
        </div>
      )}

      {/* Mobile overlay */}
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
        <SidebarContent mobile />
      </div>

      {/* Mobile Top Bar */}
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

      {/* Summary PDF Modal */}
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
                  onClick={handleSummaryDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-yellow transition-colors"
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
                  style={{ minHeight: '500px' }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No PDF available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
