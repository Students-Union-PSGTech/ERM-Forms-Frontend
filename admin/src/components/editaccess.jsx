import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { CheckCircle2, Eye, Loader2, RefreshCcw, ShieldAlert, XCircle } from 'lucide-react';
import Layout from './Layout';
import { adminAPI } from '../api';

const particleGradient = {
  color: {
    value: "linear-gradient(135deg, #4c1d95 0%, #000000 100%)",
  },
};

const EditAccess = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = useMemo(
    () => ({
      background: particleGradient,
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
        links: {
          color: '#ffffff',
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: { default: 'bounce' },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: { enable: true, area: 800 },
          value: 60,
        },
        opacity: { value: 0.3 },
        shape: { type: 'circle' },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    }),
    []
  );

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    setActionStatus(null);
    try {
      const res = await adminAPI.getRequestedEvents();
      const rawData = res?.data?.data ?? res?.data ?? res;
      const dataArray = Array.isArray(rawData) ? rawData : [];
      console.log('Fetched requests:', dataArray);
      setRequests(dataArray);
    } catch (err) {
      setRequests([]);
      setError(err?.response?.data?.message || 'Failed to fetch requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccess = async (requestId, decision) => {
    setUpdatingId(requestId);
    setActionStatus(null);
    try {
      await adminAPI.giveEditAccess(requestId, decision);
      setActionStatus({
        type: 'success',
        message: `Request ${decision === 'approved' ? 'approved' : 'rejected'} successfully.`,
      });
      await fetchRequests();
    } catch (err) {
      setActionStatus({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to update access. Please retry.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewEvent = (eventId,event) => {
    console.log('Viewing event with ID:', eventId);
    if (!eventId) {
      setActionStatus({ type: 'error', message: 'Event not found for this request.' });
      return;
    }
    navigate(`/info-deep/${event?._id}`, { state: event })
  };

  const formatStatus = (status) => {
    const normalized = (status || 'pending').toLowerCase();
    const options = {
      pending: {
        label: 'Pending',
        classes: 'bg-yellow-100/70 text-yellow-800 border border-yellow-200/80',
      },
      approved: {
        label: 'Approved',
        classes: 'bg-green-100/70 text-green-700 border border-green-200/80',
      },
      rejected: {
        label: 'Rejected',
        classes: 'bg-red-100/70 text-red-700 border border-red-200/80',
      },
    };
    if (normalized === 'approved') return options.approved;
    if (normalized === 'rejected') return options.rejected;
    return options[normalized] || options.pending;
  };

  const formatDateTime = (date) => {
    if (!date) return '–';
    try {
      return new Date(date).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch (e) {
      return '–';
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden">
        <Particles id="edit-access-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-28 pb-16 sm:pt-24">
          <header className="mb-8 sm:mb-10 text-center text-white">
            <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">Edit Access Requests</h1>
            <p className="mt-3 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              Review, approve, or decline edit access requests from event organizers.
            </p>
          </header>

          <div className="flex justify-end mb-6">
            <button
              onClick={fetchRequests}
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
            >
              <RefreshCcw className="h-4 w-4" /> Refresh
            </button>
          </div>

          {actionStatus && (
            <div
              className={`mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm sm:text-base backdrop-blur-md ${{
                success: 'bg-green-500/20 border-green-400/40 text-white',
                error: 'bg-red-500/20 border-red-400/40 text-white',
              }[actionStatus.type]}`}
            >
              {actionStatus.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <ShieldAlert className="h-5 w-5" />
              )}
              <span>{actionStatus.message}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/20 px-4 py-3 text-sm text-white backdrop-blur-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="flex items-center gap-3 rounded-2xl bg-white/20 px-6 py-4 text-white backdrop-blur-md">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">Loading requests...</span>
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-3xl border border-white/30 bg-white/10 p-8 text-center text-white backdrop-blur-xl">
              <p className="text-lg font-semibold">No edit access requests yet.</p>
              <p className="mt-2 text-sm text-white/80">Refresh later to check for new submissions.</p>
            </div>
          ) : (
            <div className="space-y-6"> 
              {requests.map((req) => {
                const { label, classes } = formatStatus(req.status);
                const requesterName = req.req_message;
                const tagline = req.tagline;
                const eventName = req?.event_id?.name || req?.eventName || req?.name || 'Untitled event';
                const associationName = req.association_name;
                const type = (req.edit_req_status=='requested')?'Edit Event Request':'Edit Annexure Request';
                return (
                  <div
                    key={req._id}
                    className="rounded-3xl border border-white/40 bg-white/90 p-6 shadow-2xl backdrop-blur-xl sm:p-7"
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Event</p>
                          <h2 className="text-2xl font-bold text-gray-900">{eventName}</h2>
                          {associationName && (
                            <p className="text-sm text-gray-500">Club: {associationName}</p>
                          )}
                        </div>
                        {/* Display type here */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-accent-orange">
                          <span>Type:</span>
                          <span>{type}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Tagline</span>
                            <span>{tagline}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Request Message:</span>
                            <span>{requesterName}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${classes}`}>
                            {label}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <button
                          onClick={() => handleViewEvent(req._id,req)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-orange to-accent-yellow px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
                        >
                          <Eye className="h-4 w-4" /> View Event
                        </button>
                        {label === 'Pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAccess(req._id, 'approved')}
                              disabled={updatingId === req._id}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {updatingId === req._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} 
                              Approve
                            </button>
                            <button
                              onClick={() => handleAccess(req._id, 'rejected')}
                              disabled={updatingId === req._id}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {updatingId === req._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />} 
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditAccess;
