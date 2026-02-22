import React, { useState } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useLocation, useNavigate } from "react-router-dom";
import { adminAPI } from "../api";
import { FileText, Download, X, Eye, Trash2, Loader2 } from "lucide-react";

const InfoDeep = () => {
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
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state;

  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSecret, setDeleteSecret] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [currentPdfType, setCurrentPdfType] = useState('event');

  const formatLabel = (label = '') =>
    label
      .replace(/_/g, ' ')
      .replace(/\d+/g, (match) => ` ${match}`)
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();

  // Detect if device is mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  };

  const handleViewPDF = async () => {
    if (!event?.event_id) {
      setPdfError("Event ID not found");
      return;
    }

    try {
      setCurrentPdfType('event');
      setPdfLoading(true);
      setPdfError(null);

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }

      const response = await adminAPI.getEventPDF(event.event_id);

      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      if (isMobile()) {
        // On mobile, open PDF in new tab
        window.open(url, '_blank');
        // Clean up the blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else {
        // On desktop, show in modal
        setPdfUrl(url);
        setShowPdfViewer(true);
      }
    } catch (err) {
      setPdfError(err.response?.data?.message || err.message || "Failed to load PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleViewItemsPDF = async () => {
    if (!event?.event_id) {
      setPdfError("Event ID not found");
      return;
    }

    try {
      setCurrentPdfType('items');
      setPdfLoading(true);
      setPdfError(null);

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }

      const response = await adminAPI.getEventItemsPDF(event.event_id);

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      if (isMobile()) {
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else {
        setPdfUrl(url);
        setShowPdfViewer(true);
      }
    } catch (err) {
      setPdfError(err.response?.data?.message || err.message || "Failed to load Items PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!event?.event_id) {
      setPdfError("Event ID not found");
      return;
    }

    try {
      const response = currentPdfType === 'items'
        ? await adminAPI.getEventItemsPDF(event.event_id)
        : await adminAPI.getEventPDF(event.event_id);

      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const suffix = currentPdfType === 'items' ? 'items' : 'event';
      const fileName = `${event.association_name || 'unknown'}_${event.name || 'event'}_${event.event_id}_${suffix}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setPdfError(err.response?.data?.message || err.message || "Failed to download PDF");
    }
  };

  const closePdfViewer = () => {
    setShowPdfViewer(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const openDeleteModal = () => {
    setDeleteSecret('');
    setDeleteError('');
    setDeleteSuccess('');
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteSecret('');
    setDeleteError('');
    setDeleteSuccess('');
    setDeleteLoading(false);
  };

  const handleDeleteEvent = async () => {
    const SECRET_KEY = "Event Deletion Secret Key - Kriya 2026";
    if (deleteSecret.trim() !== SECRET_KEY) {
      setDeleteError('Invalid secret key. Please try again.');
      setDeleteSuccess('');
      return;
    }

    const eventIdentifier = event?._id || event?._id;
    if (!eventIdentifier) {
      setDeleteError('Event identifier is missing.');
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');
    setDeleteSuccess('');

    try {
      const res = await adminAPI.deleteEvent(eventIdentifier);
      if (res.data?.success) {
        setDeleteSuccess(res.data?.message || 'Event deleted successfully. Redirecting...');
        setTimeout(() => {
          setDeleteLoading(false);
          closeDeleteModal();
          navigate('/cards', { replace: true });
        }, 1200);
      } else {
        setDeleteError(res.data?.message || 'Failed to delete event.');
        setDeleteLoading(false);
      }
    } catch (err) {
      setDeleteError(err?.response?.data?.message || err.message || 'Failed to delete event.');
      setDeleteLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0 z-0"
        />
        <div className="relative z-10 p-4 sm:p-5 text-center bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20">
          <p className="text-gray-600 text-base sm:text-lg">No event data found.</p>
          <button 
            onClick={() => navigate('/cards')}
            className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 bg-gradient-to-r from-accent-orange to-accent-yellow text-white rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-colors text-sm sm:text-base"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 pt-16 sm:pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-5 px-3 sm:px-4 py-2 bg-white/80 text-gray-700 rounded-lg hover:bg-white transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base"
        >
          <span>←</span> Back
        </button>
        <div className="bg-white/95 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent-orange mb-2">{event.name}</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-3 sm:mb-4">{event.tagline}</p>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 sm:mb-6">{event.about}</p>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">General Information</h3>
              <p className="text-sm sm:text-base"><span className="font-medium">Association:</span> {event.association}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Association Name:</span> {event.association_name}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Event ID:</span> {event.event_id}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Rounds Count:</span> {event.round_count}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Edit Request Status:</span> {formatLabel(event.edit_req_status)}</p>
              {event.req_message && (
                <p className="text-sm sm:text-base"><span className="font-medium">Request Message:</span> {event.req_message}</p>
              )}
            </div>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Timestamps</h3>
              <p className="text-sm sm:text-base"><span className="font-medium">Created At:</span> {event.createdAt ? new Date(event.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Updated At:</span> {event.updatedAt ? new Date(event.updatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</p>
              {event.form?.rounds && (
                <p className="text-sm sm:text-base"><span className="font-medium">Form Rounds:</span> {event.form.rounds}</p>
              )}
            </div>
          </div>

          {/* PDF Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleViewPDF}
              disabled={pdfLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-yellow text-white rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pdfLoading && currentPdfType === 'event' ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {pdfLoading && currentPdfType === 'event' ? 'Loading PDF...' : (isMobile() ? 'Open PDF' : 'View PDF')}
            </button>
            <button
              onClick={handleViewItemsPDF}
              disabled={pdfLoading}
              className="flex items-center gap-2 px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-yellow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pdfLoading && currentPdfType === 'items' ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FileText className="w-4 h-4" />
              )}
              {pdfLoading && currentPdfType === 'items' ? 'Loading Items PDF...' : (isMobile() ? 'Open Items PDF' : 'Items PDF')}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={openDeleteModal}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete Event
            </button>
          </div>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-accent-orange mb-3 sm:mb-4">Annexures</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              {Array.isArray(event.annexure) && event.annexure.length > 0 ? (
                <ul className="space-y-3">
                  {event.annexure.map((file) => (
                    <li key={file.public_id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white rounded-lg border border-gray-200 p-3">
                      <div>
                        <p className="font-medium text-gray-800">{file.original_name}</p>
                        <p className="text-sm text-gray-500">Public ID: {file.public_id}</p>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-accent-orange rounded-lg hover:bg-accent-yellow transition-colors"
                      >
                        View Annexure
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm sm:text-base text-gray-500 text-center">
                  No annexures available.
                </p>
              )}
            </div>
          </div>
          {isMobile() && (
            <p className="text-sm text-gray-600 mb-4">
              📱 On mobile devices, PDFs will open in a new tab for better viewing experience.
            </p>
          )}

          {pdfError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {pdfError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Event Details</h3>
              <p className="text-sm sm:text-base"><span className="font-medium">Event ID:</span> {event.event_id}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Association:</span> {event.association_name}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Rounds:</span> {event.round_count}</p>
            </div>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Form Details</h3>
              <p className="text-sm sm:text-base"><span className="font-medium">Day:</span> {event.form.day}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Rounds Mentioned:</span> {event.form.rounds}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Two Days:</span> {event.form.two_days}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Participants:</span> {event.form.participants}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Duration:</span> {event.form.duration}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Participant Type:</span> {event.form.participant_type}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Team Size:</span> {event.form.team_min} - {event.form.team_max}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Halls Required:</span> {event.form.halls_required}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Preferred Halls:</span> {event.form.preferred_halls}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Hall Reason:</span> {event.form.hall_reason}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Slot:</span> {event.form.slot}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Extension Boxes:</span> {event.form.extension_boxes}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Extension Reason:</span> {event.form.extension_reason}</p>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-accent-orange mb-3 sm:mb-4">Rounds</h2>
            {event.rounds.map((round, index) => (
              <div key={round._id} className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{round.name}</h3>
                <p className="text-gray-700 mb-2 text-sm sm:text-base">{round.description}</p>
                <p className="text-sm sm:text-base mb-2"><span className="font-medium">Participants:</span> {round.participants ?? '—'}</p>
                <p className="text-sm sm:text-base mb-2"><span className="font-medium">Has Tie Breaker:</span> {round.hasTieBreaker ? 'Yes' : 'No'}</p>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Rules:</h4>
                <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base">
                  {round.rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
                {round.hasTieBreaker && round.tieBreaker && (
                  <div className="mt-3 bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Tie Breaker Round</h4>
                    <p className="text-sm sm:text-base"><span className="font-medium">Name:</span> {round.tieBreaker.name || '—'}</p>
                    <p className="text-sm sm:text-base"><span className="font-medium">Description:</span> {round.tieBreaker.description || '—'}</p>
                    <p className="text-sm sm:text-base"><span className="font-medium">Participants:</span> {round.tieBreaker.participants ?? '—'}</p>
                    {Array.isArray(round.tieBreaker.rules) && round.tieBreaker.rules.length > 0 && (
                      <div className="mt-2">
                        <h5 className="font-medium text-gray-800 text-sm">Rules:</h5>
                        <ul className="list-disc list-inside text-gray-700 text-sm">
                          {round.tieBreaker.rules.map((rule, idx) => (
                            <li key={idx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-accent-orange mb-3 sm:mb-4">Items Required</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-50 rounded-lg text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 sm:p-3 text-left">Item Name</th>
                    <th className="p-2 sm:p-3 text-left">Quantity</th>
                    <th className="p-2 sm:p-3 text-left">Price per Unit</th>
                    <th className="p-2 sm:p-3 text-left">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {event.items.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="p-2 sm:p-3">{item.item_name}</td>
                      <td className="p-2 sm:p-3">{item.quantity}</td>
                      <td className="p-2 sm:p-3">₹{item.price_per_unit}</td>
                      <td className="p-2 sm:p-3">₹{item.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PDF Viewer Modal */}
        {showPdfViewer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-6xl h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {currentPdfType === 'items' ? `Items PDF - ${event.name}` : `Event PDF - ${event.name}`}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-yellow transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={closePdfViewer}
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
                    title="Event PDF"
                    frameBorder="0"
                    allowFullScreen
                    style={{ minHeight: '500px' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading PDF...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-red-500" />
                  Confirm Event Deletion
                </h2>
                <button
                  onClick={closeDeleteModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                This action cannot be undone. Please enter the deletion secret key to confirm removal of <span className="font-semibold text-gray-800">{event.name}</span>.
              </p>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Enter deletion secret key"
                value={deleteSecret}
                onChange={(e) => setDeleteSecret(e.target.value)}
                disabled={deleteLoading}
              />
              {deleteError && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {deleteError}
                </div>
              )}
              {deleteSuccess && (
                <div className="mt-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                  {deleteSuccess}
                </div>
              )}
              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEvent}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-6 sm:mt-8 text-white/70 text-xs sm:text-sm">
          <p>&copy; 2025 ERM Forms. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default InfoDeep;
