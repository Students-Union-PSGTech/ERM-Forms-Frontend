import React, { useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { adminAPI } from "../api";
import { Edit, Trash2, Plus, X, Eye, EyeOff, Search } from "lucide-react";

function Add() {
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

  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    association_name: ""
  });

  // Edit modal states
  const [editingAssociation, setEditingAssociation] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    association_name: "",
    password: ""
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  // Filter associations based on search term
  const filteredAssociations = associations.filter((association) =>
    association.association_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    association.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch associations on mount
  useEffect(() => {
    fetchAssociations();
  }, []);

  const fetchAssociations = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAssociations();
      setAssociations(response.data.data);
      console.log(response.data)
      console.log(associations)
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.association_name) {
      setMessage("⚠️ Please fill in all fields");
      return;
    }

    try {
      await adminAPI.createAssociation(formData);
      setMessage("✅ Association created successfully!");
      setFormData({ username: "", password: "", association_name: "" });
      fetchAssociations();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (association) => {
    setEditingAssociation(association);
    setEditFormData({
      username: association.username,
      association_name: association.association_name,
      password: "" // Don't pre-fill password for security
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editFormData.username || !editFormData.association_name) {
      setMessage("⚠️ Please fill in username and association name");
      return;
    }

    try {
      const updateData = {
        username: editFormData.username,
        association_name: editFormData.association_name
      };
      
      // Only include password if it's provided
      if (editFormData.password.trim()) {
        updateData.password = editFormData.password;
      }

      await adminAPI.updateAssociation(editingAssociation._id, updateData);
      setMessage("✅ Association updated successfully!");
      setShowEditModal(false);
      setEditingAssociation(null);
      fetchAssociations();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this association?")) {
      return;
    }

    try {
      await adminAPI.deleteAssociation(id);
      setMessage("✅ Association deleted successfully!");
      fetchAssociations();
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

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-24 sm:pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Clubs Management</h1>
          <p className="text-white/80">Manage Clubs, create new ones, and update credentials</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Associations List */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-accent-orange to-accent-yellow px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                All Clubs {filteredAssociations.length > 0 && `(${filteredAssociations.length})`}
              </h2>
            </div>
            <div className="p-6">
              {/* Search Filter */}
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by club name or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              {loading && (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading clubs...</p>
                </div>
              )}
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600">Error: {error}</p>
                </div>
              )}
              {!loading && !error && filteredAssociations.length === 0 && associations.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No Clubs match your search</p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-accent-orange hover:text-accent-yellow underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
              {!loading && !error && associations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No Clubs found</p>
                </div>
              )}
              {!loading && !error && filteredAssociations.length > 0 && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredAssociations.map((association) => (
                    <div key={association._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{association.association_name}</h3>
                          <p className="text-sm text-gray-600">@{association.username}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(association)}
                            className="p-2 bg-accent-orange text-white hover:bg-accent-yellow rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(association._id)}
                            className="p-2 bg-red-500 text-white hover:bg-accent-orange rounded-lg transition-colors"
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

          {/* Create Association Form */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-accent-orange to-accent-yellow px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Club
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Create password"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Association Name</label>
                  <input
                    type="text"
                    placeholder="Enter association name"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    value={formData.association_name}
                    onChange={(e) => setFormData({...formData, association_name: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent-orange to-accent-yellow text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-lg hover:from-orange-500 hover:to-yellow-500 focus:ring-4 focus:ring-accent-yellow disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Club
                </button>
              </form>
            </div>
          </div>
        </div>        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full">
              <div className="bg-gradient-to-r from-accent-orange to-accent-yellow px-6 py-4 rounded-t-3xl">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Edit Club
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                      value={editFormData.username}
                      onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Association Name</label>
                    <input
                      type="text"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                      value={editFormData.association_name}
                      onChange={(e) => setEditFormData({...editFormData, association_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave empty to keep current)</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                      value={editFormData.password}
                      onChange={(e) => setEditFormData({...editFormData, password: e.target.value})}
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

export default Add;
