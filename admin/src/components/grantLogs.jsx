import React, { useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { adminAPI } from "../api";
import { 
  History, 
  Loader2, 
  AlertTriangle, 
  Package, 
  Users, 
  Calendar,
  Gift,
  Search,
  RotateCcw
} from "lucide-react";

function GrantLogs() {
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

  const [grantLogs, setGrantLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [revertingGrants, setRevertingGrants] = useState(new Set());

  useEffect(() => {
    fetchGrantLogs();
  }, []);

  const fetchGrantLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAllGrants();
      
      if (response.data.success) {
        setGrantLogs(response.data.data);
      } else {
        setError('Failed to fetch grant logs');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch grant logs');
    } finally {
      setLoading(false);
    }
  };

  const handleRevertGrant = async (grantId) => {
    if (!confirm('Are you sure you want to revert this grant? This action cannot be undone.')) {
      return;
    }

    try {
      setRevertingGrants(prev => new Set([...prev, grantId]));
      await adminAPI.revertGrant(grantId);
      
      // Refresh grant logs after successful revert
      await fetchGrantLogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to revert grant');
    } finally {
      setRevertingGrants(prev => {
        const newSet = new Set(prev);
        newSet.delete(grantId);
        return newSet;
      });
    }
  };

  // Filter grants based on search term
  const filteredGrants = grantLogs?.grants?.filter((grant) => {
    const searchLower = searchTerm.toLowerCase();
    const itemName = (grant.item_name || '').toLowerCase();
    const grantedTo = (grant.granted_to || '').toLowerCase();
    const grantedBy = (grant.granted_by || '').toLowerCase();
    const eventName = (grant.eventId?.name || '').toLowerCase();
    const associationName = (grant.eventId?.association_name || '').toLowerCase();
    const eventId = (grant.eventId?.event_id || '').toLowerCase();
    
    return itemName.includes(searchLower) || 
           grantedTo.includes(searchLower) || 
           grantedBy.includes(searchLower) ||
           eventName.includes(searchLower) ||
           associationName.includes(searchLower) ||
           eventId.includes(searchLower);
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-accent-orange via-accent-yellow to-yellow-400 overflow-hidden">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0 z-0"
        />
        <div className="relative z-10 flex items-center gap-3 bg-white/95 backdrop-blur-lg rounded-2xl p-6">
          <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
          <span className="text-lg text-gray-600">Loading grant logs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-accent-orange via-accent-yellow to-yellow-400 overflow-hidden">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0 z-0"
        />
        <div className="relative z-10 max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchGrantLogs}
              className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-yellow transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start bg-gradient-to-br from-accent-orange via-accent-yellow to-yellow-400 overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 pt-8">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <History className="w-8 h-8 text-accent-orange" />
            <h1 className="text-3xl font-bold text-accent-orange">Grant Logs</h1>
          </div>

          <p className="text-gray-600 mb-6">
            View all grant records across all events and manage item distributions.
          </p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium">Total Grants</span>
              </div>
              <p className="text-2xl font-bold text-blue-800">{grantLogs?.summary?.totalGrants || 0}</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">Total Quantity</span>
              </div>
              <p className="text-2xl font-bold text-green-800">{grantLogs?.summary?.totalQuantityGranted || 0}</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600 font-medium">Unique Events</span>
              </div>
              <p className="text-2xl font-bold text-purple-800">{grantLogs?.summary?.uniqueEvents || 0}</p>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-600" />
                <span className="text-orange-600 font-medium">Unique Items</span>
              </div>
              <p className="text-2xl font-bold text-orange-800">{grantLogs?.summary?.uniqueItems || 0}</p>
            </div>
          </div>

          {/* Admin Breakdown */}
          {grantLogs?.summary?.grantsByAdmin && Object.keys(grantLogs.summary.grantsByAdmin).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Grants by Admin</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(grantLogs.summary.grantsByAdmin).map(([admin, count]) => (
                  <div key={admin} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-800">{admin}</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{count} grants</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by item, event, association, admin, or recipient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange"
              />
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600">
                Showing {filteredGrants.length} of {grantLogs?.grants?.length || 0} grants
              </p>
            )}
          </div>

          {/* Grant Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Item Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Event</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Association</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Granted To</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Granted By</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGrants.map((grant) => {
                  const isReverting = revertingGrants.has(grant._id);
                  
                  return (
                    <tr key={grant._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(grant.createdAt).toLocaleString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {grant.item_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {grant.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div>
                          <p className="font-medium">{grant.eventId?.name}</p>
                          <p className="text-xs text-gray-500">{grant.eventId?.event_id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {grant.eventId?.association_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {grant.granted_to}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {grant.granted_by}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleRevertGrant(grant._id)}
                          disabled={isReverting}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          {isReverting ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Reverting...
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3 h-3" />
                              Revert
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredGrants.length === 0 && grantLogs?.grants?.length > 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No grants match your search</p>
                <p className="text-gray-400 text-sm mt-2">Try searching with a different term</p>
              </div>
            )}

            {(!grantLogs?.grants || grantLogs.grants.length === 0) && (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No grant logs found</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8 text-white/70 text-sm">
          <p>&copy; 2025 ERM Forms. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default GrantLogs;