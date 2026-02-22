import React, { useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../api";
import { HoverEffect } from "../ui/card-hover-effect";

const EventCards = () => {
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
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await adminAPI.getEvents();
        console.log("Fetched events:", response.data);
        setEvents(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      (event.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.club_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const eventItems = filteredEvents.map((event) => {
    const association = event?.club_name || "Unknown Club";
    const twoDays = event?.form?.two_days;
    const dayInfo = twoDays
      ? /yes/i.test(twoDays)
        ? "Both days"
        : event?.form?.day || "Single day"
      : "Schedule TBA";

    const convenorNames = [
      event?.details?.convenor1_name,
      event?.details?.convenor2_name,
    ].filter(Boolean);

    const status = event?.status || event?.form?.status || "Pending";
    const updatedAt = event?.updatedAt || event?.createdAt || event?.created_at || null;

    return {
      id: event?._id,
      title: event?.name || event?.event_name || event?.workshop?.name || event?.presentation?.event_description?.substring(0, 50) || "Untitled Event",
      tagline: event?.tagline || "",
      about: event?.about || event?.workshop?.description || event?.presentation?.event_description || "",
      association,
      dayInfo,
      convenors: convenorNames,
      status,
      updatedAt,
      onClick: () => navigate(`/info-deep/${event?._id}`, { state: event }),
    };
  });

  return (
  <div className="min-h-screen relative flex flex-col items-center justify-start bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10 w-full max-w-4xl px-6">
        <div className="w-full flex flex-col gap-4 mb-5">
          {/* Search/Filter Controls - full width, below navbar, not centered */}
          <div className="w-full py-2">
            <input
              type="search"
              placeholder="Search Events/Associations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 px-4 rounded-lg border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange"
            />
          </div>
        </div>
        {loading && (
          <div className="text-center py-12 text-white">
            <p className="text-lg">Loading events...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-12 text-red-300">
            <p className="text-lg">Error loading events: {error}</p>
          </div>
        )}
        {!loading && !error && (
          <HoverEffect items={eventItems} />
        )}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No events found</p>
            <p className="text-sm">Try adjusting your search term</p>
          </div>
        )}
        <div className="text-center mt-8 text-white/70 text-sm">
          <p>&copy; 2025 ERM Forms. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default EventCards;
