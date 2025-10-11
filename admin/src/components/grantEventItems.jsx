import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { adminAPI } from "../api";
import { 
  Package, 
  Loader2, 
  AlertTriangle, 
  X, 
  Gift,
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Search,
  History,
  RotateCcw
} from "lucide-react";

function GrantEventItems() {
  const { id } = useParams();
  const navigate = useNavigate();
  
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

  const [eventData, setEventData] = useState(null);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [grantQuantity, setGrantQuantity] = useState('');
  const [grantedTo, setGrantedTo] = useState('');
  const [granting, setGranting] = useState(false);
  const [grantError, setGrantError] = useState('');

  // Grant history modal states
  const [showGrantHistoryModal, setShowGrantHistoryModal] = useState(false);
  const [grantHistory, setGrantHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [revertingGrants, setRevertingGrants] = useState(new Set());

  useEffect(() => {
    if (id) {
      fetchEventData();
      fetchAvailableItems();
    }
  }, [id]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getEventQuantityToProvide(id);
      console.log("Fetched event data:", response.data.data);
      if (response.data.success) {
        setEventData(response.data.data);
      } else {
        setError('Failed to fetch event data');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch event data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableItems = async () => {
    try {
      const response = await adminAPI.getItems();
      
      if (response.data.success) {
        setAvailableItems(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch available items:', err);
    }
  };

  const getItemStatus = (item) => {
    if (item.remaining_quantity_to_be_provided === 0) {
      return { status: 'Fully Provided', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
    } else if (item.provided_quantity > 0) {
      return { status: 'Partially Provided', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock };
    } else {
      return { status: 'Pending', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle };
    }
  };

  const getAvailableQuantity = (itemName) => {
    const availableItem = availableItems.find(item => item.item_name === itemName);
    return availableItem ? availableItem.available_quantity : 0;
  };

  const getMaxGrantQuantity = (item) => {
    const availableQuantity = getAvailableQuantity(item.item_name);
    return Math.min(item.remaining_quantity_to_be_provided, availableQuantity);
  };

  const handleGrantClick = (item) => {
    const maxQuantity = getMaxGrantQuantity(item);
    if (maxQuantity <= 0) {
      setGrantError('No items available to grant for this item.');
      return;
    }
    
    setSelectedItem(item);
    setGrantQuantity('');
    setGrantedTo('');
    setGrantError('');
    setShowGrantModal(true);
  };

  const closeGrantModal = () => {
    setShowGrantModal(false);
    setSelectedItem(null);
    setGrantQuantity('');
    setGrantedTo('');
    setGrantError('');
  };

  const handleGrantSubmit = async () => {
    if (!selectedItem || !grantQuantity || !grantedTo) {
      setGrantError('Please fill in all fields.');
      return;
    }

    const quantity = parseInt(grantQuantity);
    const maxQuantity = getMaxGrantQuantity(selectedItem);

    if (quantity <= 0 || quantity > maxQuantity) {
      setGrantError(`Quantity must be between 1 and ${maxQuantity}.`);
      return;
    }

    try {
      setGranting(true);
      setGrantError('');

      const grantData = {
        itemName: selectedItem.item_name,
        quantity: quantity,
        granted_to: grantedTo,
        eventId: id
      };

      await adminAPI.grantItemsToEvent(grantData);
      
      // Refresh event data after successful grant
      await fetchEventData();
      await fetchAvailableItems();
      
      closeGrantModal();
    } catch (err) {
      setGrantError(err.response?.data?.message || 'Failed to grant items');
    } finally {
      setGranting(false);
    }
  };

  // Filter items based on search term
  const filteredItems = eventData?.items?.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const itemName = (item.item_name || '').toLowerCase();
    
    return itemName.includes(searchLower);
  }) || [];

  const fetchGrantHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError('');
      const response = await adminAPI.getEventGrantHistory(id);
      
      if (response.data.success) {
        setGrantHistory(response.data.data);
      } else {
        setHistoryError('Failed to fetch grant history');
      }
    } catch (err) {
      setHistoryError(err.response?.data?.message || 'Failed to fetch grant history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleViewGrantHistory = () => {
    setShowGrantHistoryModal(true);
    fetchGrantHistory();
  };

  const closeGrantHistoryModal = () => {
    setShowGrantHistoryModal(false);
    setGrantHistory(null);
    setHistoryError('');
    setRevertingGrants(new Set());
  };

  const handleRevertGrant = async (grantId) => {
    if (!confirm('Are you sure you want to revert this grant? This action cannot be undone.')) {
      return;
    }

    try {
      // Add grant to reverting set
      setRevertingGrants(prev => new Set([...prev, grantId]));

      await adminAPI.revertGrant(grantId);

      // Refresh grant history and main data
      await fetchGrantHistory();
      await fetchEventData();
      await fetchAvailableItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to revert grant');
    } finally {
      // Remove grant from reverting set
      setRevertingGrants(prev => {
        const newSet = new Set(prev);
        newSet.delete(grantId);
        return newSet;
      });
    }
  };

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
          <span className="text-lg text-gray-600">Loading event data...</span>
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
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/grant-items')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={fetchEventData}
                className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-yellow transition-colors"
              >
                Retry
              </button>
            </div>
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/grant-items')}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <Gift className="w-8 h-8 text-accent-orange" />
                <div>
                  <h1 className="text-3xl font-bold text-accent-orange">Grant Items</h1>
                  <p className="text-gray-600">{eventData?.eventDetails?.eventName}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleViewGrantHistory}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <History className="w-4 h-4" />
              Revert Past Grants
            </button>
          </div>

          {/* Event Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Event Name:</span>
                <p className="text-gray-800">{eventData?.eventDetails?.eventName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Association:</span>
                <p className="text-gray-800">{eventData?.eventDetails?.associationName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Event ID:</span>
                <p className="text-gray-800">{eventData?.eventDetails?.eventId}</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium">Total Items</span>
              </div>
              <p className="text-2xl font-bold text-blue-800">{eventData?.summary?.totalItems || 0}</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">Fully Provided</span>
              </div>
              <p className="text-2xl font-bold text-green-800">{eventData?.summary?.fullyProvidedItems || 0}</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-600 font-medium">Partially Provided</span>
              </div>
              <p className="text-2xl font-bold text-yellow-800">{eventData?.summary?.partiallyProvidedItems || 0}</p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold text-red-800">{eventData?.summary?.pendingItems || 0}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange"
              />
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600">
                Showing {filteredItems.length} of {eventData?.items?.length || 0} items
              </p>
            )}
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Item Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Asked</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Provided</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Remaining</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Available</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const statusInfo = getItemStatus(item);
                  const StatusIcon = statusInfo.icon;
                  const availableQty = getAvailableQuantity(item.item_name);
                  const maxGrantQty = getMaxGrantQuantity(item);
                  
                  return (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {item.item_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.asked_quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.provided_quantity}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {item.remaining_quantity_to_be_provided}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {availableQty}
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.status}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleGrantClick(item)}
                          disabled={maxGrantQty <= 0}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-accent-orange text-white rounded-lg hover:bg-accent-yellow transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3 h-3" />
                          Grant
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredItems.length === 0 && eventData?.items?.length > 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No items match your search</p>
                <p className="text-gray-400 text-sm mt-2">Try searching with a different term</p>
              </div>
            )}

            {(!eventData?.items || eventData.items.length === 0) && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No items found for this event</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8 text-white/70 text-sm">
          <p>&copy; 2025 ERM Forms. All rights reserved.</p>
        </div>
      </div>

      {/* Grant Items Modal */}
      {showGrantModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-accent-orange" />
                <h2 className="text-xl font-semibold text-gray-800">Grant Items</h2>
              </div>
              <button
                onClick={closeGrantModal}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-medium text-gray-800 mb-2">{selectedItem.item_name}</h3>
                <p className="text-sm text-gray-600">
                  Max quantity: {getMaxGrantQuantity(selectedItem)} 
                  (Available: {getAvailableQuantity(selectedItem.item_name)}, 
                  Remaining: {selectedItem.remaining_quantity_to_be_provided})
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity to Grant
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={getMaxGrantQuantity(selectedItem)}
                    value={grantQuantity}
                    onChange={(e) => setGrantQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange"
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Granted To
                  </label>
                  <input
                    type="text"
                    value={grantedTo}
                    onChange={(e) => setGrantedTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange"
                    placeholder="Enter recipient name/details"
                  />
                </div>
              </div>

              {grantError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{grantError}</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeGrantModal}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={granting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleGrantSubmit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-yellow transition-colors disabled:opacity-50"
                  disabled={granting}
                >
                  {granting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Granting...
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4" />
                      Grant Items
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grant History Modal */}
      {showGrantHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-accent-orange" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Grant History</h2>
                  <p className="text-sm text-gray-600">{grantHistory?.eventDetails?.eventName}</p>
                </div>
              </div>
              <button
                onClick={closeGrantHistoryModal}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {historyLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
                  <span className="ml-3 text-lg text-gray-600">Loading grant history...</span>
                </div>
              )}

              {historyError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 font-medium">Error</span>
                  </div>
                  <p className="text-red-600 mt-1">{historyError}</p>
                  <button
                    onClick={fetchGrantHistory}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!historyLoading && !historyError && grantHistory && (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-600 font-medium">Total Grants</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-800">{grantHistory.summary?.totalGrants || 0}</p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-green-600" />
                        <span className="text-green-600 font-medium">Total Quantity</span>
                      </div>
                      <p className="text-2xl font-bold text-green-800">{grantHistory.summary?.totalQuantityGranted || 0}</p>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                        <span className="text-purple-600 font-medium">Unique Items</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-800">{grantHistory.summary?.uniqueItems || 0}</p>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <span className="text-orange-600 font-medium">Latest Grant</span>
                      </div>
                      <p className="text-sm font-bold text-orange-800">
                        {grantHistory.grants?.length > 0 
                          ? new Date(grantHistory.grants[0].createdAt).toLocaleDateString('en-IN')
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Grant Records Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Item Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Granted To</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Granted By</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {grantHistory.grants?.map((grant) => {
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

                    {(!grantHistory.grants || grantHistory.grants.length === 0) && (
                      <div className="text-center py-12">
                        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No grant history found for this event</p>
                      </div>
                    )}
                  </div>

                  {/* Item Breakdown */}
                  {grantHistory.summary?.itemBreakdown && Object.keys(grantHistory.summary.itemBreakdown).length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Item Breakdown</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(grantHistory.summary.itemBreakdown).map(([itemName, breakdown]) => (
                          <div key={itemName} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-2">{itemName}</h4>
                            <div className="text-sm text-gray-600">
                              <p><span className="font-medium">Total Grants:</span> {breakdown.count}</p>
                              <p><span className="font-medium">Total Quantity:</span> {breakdown.totalQuantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GrantEventItems;