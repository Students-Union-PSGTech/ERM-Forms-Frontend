import React, { useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { adminAPI } from "../api";
import { BarChart3, Package, DollarSign, TrendingUp } from "lucide-react";

function Stats() {
  const particlesInit = React.useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: "linear-gradient(135deg, #FF9800 0%, #FFD600 100%)",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: "#ffffff" },
      links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.2, width: 1 },
      move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.3 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getItemStats();
      if (response.data.success) {
        setStats(response.data.data);
        setError(null);
      } else {
        setError(response.data.message || "Failed to fetch stats");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await adminAPI.exportItemStats();
      const contentType = response.headers['content-type'];

      if (contentType && contentType.includes('application/json')) {
        const text = await response.data.text();
        const payload = JSON.parse(text || '{}');
        throw new Error(payload.message || 'Export failed');
      }

      const blob = new Blob([response.data], {
        type:
          contentType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `item-stats.xlsx`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = decodeURIComponent(fileNameMatch[1]);
        } else {
          const simpleFileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
          if (simpleFileNameMatch && simpleFileNameMatch[1]) {
            fileName = simpleFileNameMatch[1];
          }
        }
      }

      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export item stats:', err);
      alert(err.response?.data?.message || err.message || 'Failed to download Excel');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-accent-orange via-accent-yellow to-yellow-400 overflow-hidden">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-24 sm:pt-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2 sm:gap-3">
            Item Statistics
          </h1>
        </div>

        <div className="flex justify-center sm:justify-end mb-6">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-2 bg-white/90 text-accent-orange font-semibold px-4 sm:px-6 py-2 rounded-full shadow-lg border border-white/40 hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {exporting ? 'Preparing...' : 'Download as Excel'}
          </button>
        </div>

        {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
            <p className="text-white mt-2 sm:mt-4 text-sm sm:text-base">Loading statistics...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-red-500/20 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-red-500/30 max-w-md mx-auto">
              <p className="text-red-100 text-sm sm:text-base">❌ Error: {error}</p>
              <button
                onClick={fetchStats}
                className="mt-3 sm:mt-4 bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && stats && (
          <div className="space-y-6 sm:space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600">Total Items</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{stats.total_items_count?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600">Total Value</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800 truncate">₹{stats.total_price?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 sm:gap-4">
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600">Unique Items</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{stats.items?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-accent-orange to-accent-yellow px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Item Breakdown</h2>
                <p className="text-xs text-white/80 mt-1 sm:hidden">← Swipe to scroll horizontally →</p>
              </div>

              {/* Responsive Table Wrapper */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[300px] sm:min-w-0">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-gray-50/80 z-20 border-r border-gray-200">
                        Item Name
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Quantity
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Unit Price
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Total Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.items?.map((item, index) => (
                      <tr key={index} className="bg-white hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 break-words max-w-[150px] sm:max-w-none sticky left-0 z-10 border-r border-gray-200">
                          {item.item_name}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                          {item.count?.toLocaleString()}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                          ₹{(item.total_price / item.count)?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-accent-orange whitespace-nowrap">
                          ₹{item.total_price?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {(!stats.items || stats.items.length === 0) && (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-gray-500 text-sm sm:text-base">No items data available</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-6 sm:mt-8 text-white/70 text-xs sm:text-sm">
          <p>&copy; 2025 ERM Forms. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Stats;