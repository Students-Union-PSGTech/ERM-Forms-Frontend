import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { adminAPI } from "../api";
import { 
  Users, 
  Calendar, 
  Package, 
  Loader2, 
  AlertTriangle, 
  X, 
  ChevronRight,
  Gift,
  Search
} from "lucide-react";

function GrantItems() {
  const navigate = useNavigate();
  
  const particlesInit = React.useCallback(async (engine) => {
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
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedAssociation, setSelectedAssociation] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState(null);

  // Fetch associations on mount
  useEffect(() => {
    fetchAssociations();
  }, []);

  const fetchAssociations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAssociations();
      console.log(response.data)
      if (response.data) {
        // Map clubName to association_name for backward compatibility
        const mappedData = response.data.data.map(club => ({
          ...club,
          association_name: club.clubName || club.association_name,
        }));
        setAssociations(mappedData);
      } else {
        setError('Failed to fetch associations');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch associations');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventsByAssociation = async (associationId) => {
    try {
      setEventsLoading(true);
      setEventsError(null);
      const response = await adminAPI.getEventsByAssociation(associationId);
      
      if (response.data.success) {
        setEvents(response.data.data);
      } else {
        setEventsError('Failed to fetch events for this association');
        setEvents([]);
      }
    } catch (err) {
      setEventsError(err.response?.data?.message || 'Failed to fetch events');
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleAssociationClick = async (association) => {
    setSelectedAssociation(association);
    setShowModal(true);
    setEvents([]);
    await fetchEventsByAssociation(association._id);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAssociation(null);
    setEvents([]);
    setEventsError(null);
  };

  const handleGrantItems = (eventId) => {
    navigate(`/grant-event-items/${eventId}`);
  };

  // Filter associations based on search term
  const filteredAssociations = associations.filter((association) => {
    const searchLower = searchTerm.toLowerCase();
    const associationName = (association.association_name || '').toLowerCase();
    const username = (association.username || '').toLowerCase();
    
    return associationName.includes(searchLower) || username.includes(searchLower);
  });

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden">
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
            <Gift className="w-8 h-8 text-accent-orange" />
            <h1 className="text-3xl font-bold text-accent-orange">Grant Items to Events</h1>
          </div>

          <p className="text-gray-600 mb-6">
            Select an association to view their events and grant items to specific events.
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by association name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange"
              />
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600">
                Showing {filteredAssociations.length} of {associations.length} associations
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
              <span className="ml-3 text-lg text-gray-600">Loading associations...</span>
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
                onClick={fetchAssociations}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Associations Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssociations.map((association) => (
                <div
                  key={association._id}
                  onClick={() => handleAssociationClick(association)}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-accent-orange group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Users className="w-6 h-6 text-accent-orange" />
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-accent-orange transition-colors">
                          {association.association_name}
                        </h3>
                      </div>
                      
                      {association.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {association.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Click to view events</span>
                        <ChevronRight className="w-4 h-4 group-hover:text-accent-orange transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredAssociations.length === 0 && associations.length > 0 && (
                <div className="col-span-full text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No associations match your search</p>
                  <p className="text-gray-400 text-sm mt-2">Try searching with a different term</p>
                </div>
              )}

              {associations.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No associations found</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-white/70 text-sm">
          <p>&copy; 2025 ERM Forms. All rights reserved.</p>
        </div>
      </div>

      {/* Events Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-accent-orange" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedAssociation?.association_name || selectedAssociation?.clubName || 'Association'} Events
                  </h2>
                  <p className="text-sm text-gray-600">
                    Select an event to grant items
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {eventsLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
                  <span className="ml-3 text-lg text-gray-600">Loading events...</span>
                </div>
              )}

              {eventsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 font-medium">Error</span>
                  </div>
                  <p className="text-red-600 mt-1">{eventsError}</p>
                </div>
              )}

              {!eventsLoading && !eventsError && (
                <>
                  {events.length > 0 ? (
                    <div className="space-y-4">
                      {events.map((event) => (
                        <div
                          key={event.mongoId}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                {event.eventName}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>
                                  <span className="font-medium">Event ID:</span> {event.eventId}
                                </span>
                                <span>
                                  <span className="font-medium">Association:</span> {event.associationName}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleGrantItems(event.mongoId)}
                              className="flex items-center gap-2 px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-yellow transition-colors font-medium"
                            >
                              <Package className="w-4 h-4" />
                              Grant Items
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No events found for this association</p>
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

export default GrantItems;