import React, { useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { adminAPI } from "../api";
import { Package, AlertTriangle, CheckCircle, Loader2, Edit2, X } from "lucide-react";

function Stocks() {
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

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantityInput, setQuantityInput] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Fetch stocks on mount
  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getStocks();
      
      if (response.data.success) {
        setStocks(response.data.data);
      } else {
        setError('Failed to fetch stocks data');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (item) => {
    console.log("Selected item for update:", item);
    setSelectedItem(item);
    setQuantityInput(item?.available_quantity?.toString() || '');
    setUpdateError('');
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    if (updateLoading) return; // avoid closing while request in-flight
    setShowUpdateModal(false);
    setSelectedItem(null);
    setQuantityInput('');
    setUpdateError('');
  };

  const handleQuantitySubmit = async (event) => {
    event.preventDefault();
    if (!selectedItem) return;

    const parsedQuantity = Number(quantityInput);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
      setUpdateError('Please enter a valid non-negative whole number.');
      return;
    }

    try {
      console.log("Updating item:", selectedItem._id, "to quantity:", parsedQuantity);  
      setUpdateLoading(true);
      setUpdateError('');
  await adminAPI.updateItemQuantity(selectedItem._id, parsedQuantity);
  await fetchStocks();
  setShowUpdateModal(false);
  setSelectedItem(null);
  setQuantityInput('');
  setUpdateError('');
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update quantity');
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return { status: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertTriangle };
    } else if (quantity <= 5) {
      return { status: 'Low Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: AlertTriangle };
    } else {
      return { status: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
    }
  };

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
            <Package className="w-8 h-8 text-accent-orange" />
            <h1 className="text-3xl font-bold text-accent-orange">Stock Management</h1>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
              <span className="ml-3 text-lg text-gray-600">Loading stocks...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">Error</span>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
              <button
                onClick={fetchStocks}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stocks Table */}
          {!loading && !error && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Items</p>
                      <p className="text-2xl font-bold">{stocks.length}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">In Stock</p>
                      <p className="text-2xl font-bold">
                        {stocks.filter(item => item.available_quantity > 0).length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100">Out of Stock</p>
                      <p className="text-2xl font-bold">
                        {stocks.filter(item => item.available_quantity === 0).length}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-200" />
                  </div>
                </div>
              </div>

              {/* Stocks Table */}
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price per Unit</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Available Quantity</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Value</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stocks.map((item) => {
                      const stockInfo = getStockStatus(item.available_quantity);
                      const StatusIcon = stockInfo.icon;
                      const totalValue = item.price_per_unit * item.available_quantity;
                      
                      return (
                        <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {item.item_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            ₹{item.price_per_unit.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {item.available_quantity}
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${stockInfo.bgColor} ${stockInfo.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              {stockInfo.status}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            ₹{totalValue.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(item.updatedAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => openUpdateModal(item)}
                              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-accent-orange hover:bg-orange-500 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              Update
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {stocks.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No items found in stock</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
          {showUpdateModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 relative">
            <button
              type="button"
              onClick={closeUpdateModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
              disabled={updateLoading}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">Update Quantity</h2>
            <p className="text-sm text-gray-600 mb-4">
              {selectedItem?.item_name ? `Adjust the available quantity for ${selectedItem.item_name}.` : 'Adjust the available quantity.'}
            </p>

            <form onSubmit={handleQuantitySubmit} className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Available Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="0"
                  value={quantityInput}
                  onChange={(event) => setQuantityInput(event.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                  placeholder="Enter quantity"
                  disabled={updateLoading}
                  required
                />
              </div>

              {updateError && (
                <div className="bg-red-50 text-red-600 text-sm font-medium px-3 py-2 rounded-lg">
                  {updateError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-accent-orange hover:bg-orange-500 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
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

export default Stocks;