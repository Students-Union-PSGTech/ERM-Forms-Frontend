import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { FileText, Download, Loader2, X } from 'lucide-react';
import { adminAPI } from '../api';

const ROLES = ['Secretary', 'Convenor', 'Volunteer'];

const RolePdf = () => {
  const [activeRole, setActiveRole] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [loadingRole, setLoadingRole] = useState('');
  const [error, setError] = useState('');

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = useMemo(() => ({
    background: {
      color: {
        value: 'linear-gradient(135deg, #FF9800 0%, #FFD600 100%)',
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'repulse' },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: '#ffffff' },
      links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.2, width: 1 },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, random: false, speed: 1, straight: false },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.3 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const closeModal = () => {
    setModalOpen(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setPdfBlob(null);
  };

  const fetchRolePdf = async (role) => {
    if (loadingRole) return;
    setError('');
    setActiveRole(role);
    setLoadingRole(role);

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }

    try {
      const response = await adminAPI.getRolePdf(role);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setPdfBlob(blob);
      setPdfUrl(url);
      setModalOpen(true);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || `Failed to load ${role} PDF.`;
      setError(message);
    } finally {
      setLoadingRole('');
    }
  };

  const handleDownload = async () => {
    if (!pdfBlob && activeRole && !loadingRole) {
      await fetchRolePdf(activeRole);
      return;
    }

    if (!pdfBlob) return;

    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeRole || 'role'}-report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-accent-orange via-accent-yellow to-yellow-400 overflow-hidden">
      <Particles id="role-pdf-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-28 pb-16 sm:pt-24">
        <header className="mb-10 text-center text-white">
          <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">Role-based PDF Reports</h1>
          <p className="mt-3 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            Download and preview summaries tailored for each organizing role.
          </p>
        </header>

        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-orange" />
            Select a role to load the PDF report
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ROLES.map((role) => {
              const isLoading = loadingRole === role;
              return (
                <button
                  key={role}
                  onClick={() => fetchRolePdf(role)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${
                    activeRole === role && pdfBlob
                      ? 'bg-accent-orange text-white border-transparent shadow-lg'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-accent-orange hover:text-accent-orange'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                  disabled={!!loadingRole && loadingRole !== role}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  {role}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mt-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          {!pdfBlob && !loadingRole && !error && (
            <div className="mt-8 text-center text-gray-500 text-sm">
              Choose a role to generate and preview its PDF report.
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {activeRole ? `${activeRole} Report` : 'Role Report'}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-yellow transition-colors"
                  disabled={!!loadingRole}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-6">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border rounded-lg"
                  title={`${activeRole || 'Role'} PDF`}
                  frameBorder="0"
                  allowFullScreen
                  style={{ minHeight: '500px' }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  {loadingRole ? (
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p>Loading {activeRole} PDF...</p>
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
};

export default RolePdf;
