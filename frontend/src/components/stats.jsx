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

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-accent-orange via-accent-yellow to-yellow-400 overflow-hidden">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Item Statistics
          </h1>
          <p className="text-white/80">Comprehensive overview of item data and pricing</p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-white mt-4">Loading statistics...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="bg-red-500/20 backdrop-blur-lg rounded-xl p-6 border border-red-500/30 max-w-md mx-auto">
              <p className="text-red-100">❌ Error: {error}</p>
              <button
                onClick={fetchStats}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && stats && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-accent-orange/20 p-3 rounded-xl">
                    <Package className="w-8 h-8 text-accent-orange" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total_items_count?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-accent-yellow/20 p-3 rounded-xl">
                    <DollarSign className="w-8 h-8 text-accent-yellow" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-800">₹{stats.total_price?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 p-3 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Unique Items</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.items?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-accent-orange to-accent-yellow px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Item Breakdown</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.items?.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.item_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.count?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{(item.total_price / item.count)?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-accent-orange">
                          ₹{item.total_price?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {(!stats.items || stats.items.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No items data available</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-8 text-white/70 text-sm">
          <p>&copy; 2025 ERM Forms. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Stats;