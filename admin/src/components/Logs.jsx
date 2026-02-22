import React, { useEffect, useState, useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { RefreshCcw, Loader2 } from 'lucide-react';
import { adminAPI } from '../api';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: "linear-gradient(135deg, #4c1d95 0%, #000000 100%)",
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
  };

  const fetchLogs = async () => {
    try {
      setError('');
      const res = await adminAPI.getLogs();
      if (res.data.success) {
        setLogs(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to fetch logs');
        setLogs([]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Network error');
      setLogs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden">
      <Particles id="logs-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-28 pb-16 sm:pt-24">
        <header className="mb-8 sm:mb-10 text-center text-white">
          <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">Activity Logs</h1>
          <p className="mt-3 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            Track recent actions taken by administrators across the platform.
          </p>
        </header>

        <div className="flex justify-end mb-6">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
            disabled={refreshing}
          >
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-accent-orange to-accent-yellow px-6 py-4 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <p className="text-sm text-white/80">Latest {logs.length} entries</p>
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading logs...</span>
                </div>
              )}
            </div>
          </div>

          {error ? (
            <div className="p-6 text-center text-red-600 bg-red-50/80">{error}</div>
          ) : (
            <div className="p-4 sm:p-6 overflow-x-auto">
              {(!loading && logs.length === 0) ? (
                <div className="text-center py-10 text-gray-500">No logs available.</div>
              ) : (
                <table className="w-full min-w-[600px] text-left">
                  <thead>
                    <tr className="text-sm uppercase tracking-wide text-gray-500">
                      <th className="pb-3">User</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Action</th>
                      <th className="pb-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/70">
                    {logs.map((log) => (
                      <tr key={log._id} className="text-sm text-gray-700 hover:bg-gray-50/70 transition-colors">
                        <td className="py-4 font-semibold text-gray-900">{log.username}</td>
                        <td className="py-4 text-gray-600">{log.email}</td>
                        <td className="py-4 text-accent-orange font-medium">{log.Status}</td>
                        <td className="py-4 text-gray-500">{new Date(log.created_at).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Logs;
