import React, { useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { adminAPI } from "../api";
import { Edit, Trash2, Plus, X } from "lucide-react";

function Items() {
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

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    item_name: "",
    price_per_unit: ""
  });

  // Edit modal states
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    item_name: "",
    price_per_unit: ""
  });
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getItems();
      // Ensure response.data is an array
      console.log(response.data.data)
      const itemsData = Array.isArray(response.data.data) ? response.data.data : [];
      setItems(itemsData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setItems([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search term
  const filteredItems = Array.isArray(items) ? items.filter((item) =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.item_name || !formData.price_per_unit) {
      setMessage("⚠️ Please fill in all fields");
      return;
    }

    try {
      await adminAPI.createItem({
        ...formData,
        price_per_unit: parseFloat(formData.price_per_unit)
      });
      setMessage("✅ Item created successfully!");
      setFormData({ item_name: "", price_per_unit: "" });
      fetchItems();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      item_name: item.item_name,
      price_per_unit: item.price_per_unit.toString()
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editFormData.item_name || !editFormData.price_per_unit) {
      setMessage("⚠️ Please fill in all fields");
      return;
    }

    try {
      await adminAPI.updateItem(editingItem._id, {
        ...editFormData,
        price_per_unit: parseFloat(editFormData.price_per_unit)
      });
      setMessage("✅ Item updated successfully!");
      setShowEditModal(false);
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await adminAPI.deleteItem(id);
      setMessage("✅ Item deleted successfully!");
      fetchItems();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
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

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Item Management</h1>
          <p className="text-white/80">Manage items, create new ones, and update pricing</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Item Form */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-accent-orange to-accent-yellow px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Item
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    placeholder="Enter item name"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    value={formData.item_name}
                    onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    value={formData.price_per_unit}
                    onChange={(e) => setFormData({...formData, price_per_unit: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent-orange to-accent-yellow text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-lg hover:from-orange-500 hover:to-yellow-500 focus:ring-4 focus:ring-accent-yellow disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Item
                </button>
              </form>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-accent-orange to-accent-yellow px-6 py-4">
              <h2 className="text-xl font-semibold text-white">All Items {filteredItems.length > 0 && `(${filteredItems.length})`}</h2>
            </div>
            <div className="p-6">
              {/* Search Filter */}
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              {loading && (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading items...</p>
                </div>
              )}
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600">Error: {error}</p>
                </div>
              )}
              {!loading && !error && filteredItems.length === 0 && items.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No items match your search</p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-accent-orange hover:text-accent-yellow underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
              {!loading && !error && items.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No items found</p>
                </div>
              )}
              {!loading && !error && filteredItems.length > 0 && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredItems.map((item) => (
                    <div key={item._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.item_name}</h3>
                          <p className="text-sm text-gray-600">₹{item.price_per_unit?.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 bg-accent-orange text-white hover:bg-accent-yellow rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full">
              <div className="bg-gradient-to-r from-accent-orange to-accent-yellow px-6 py-4 rounded-t-3xl">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Edit Item
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                      type="text"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                      value={editFormData.item_name}
                      onChange={(e) => setEditFormData({...editFormData, item_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                      value={editFormData.price_per_unit}
                      onChange={(e) => setEditFormData({...editFormData, price_per_unit: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-accent-orange to-accent-yellow text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:from-orange-500 hover:to-yellow-500 transition-all duration-200"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-400 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="fixed bottom-4 right-4 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-4 max-w-sm">
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        )}

        <div className="text-center mt-8 text-white/70 text-sm">
          <p>&copy; 2025 ERM Forms. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Items;