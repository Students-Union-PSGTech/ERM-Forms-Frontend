import React, { useState } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useLocation, useNavigate } from "react-router-dom";

const InfoDeep = () => {
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
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state;

  if (!event) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-accent-orange via-accent-yellow to-yellow-400 overflow-hidden">
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
    <div className="min-h-screen relative flex flex-col items-center justify-start bg-gradient-to-br from-accent-orange via-accent-yellow to-yellow-400 overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 py-4 sm:py-8">
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
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Event Details</h3>
              <p className="text-sm sm:text-base"><span className="font-medium">Event ID:</span> {event.event_id}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Association:</span> {event.association_name}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Rounds:</span> {event.round_count}</p>
            </div>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Form Details</h3>
              <p className="text-sm sm:text-base"><span className="font-medium">Day:</span> {event.form.day}</p>
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
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Rules:</h4>
                <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base">
                  {round.rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-accent-orange mb-3 sm:mb-4">Team Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Object.entries(event.details).map(([key, person]) => (
                person && typeof person === 'object' && person.name ? (
                  <div key={person._id} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 capitalize text-sm sm:text-base">{key.replace('_', ' ')}</h3>
                    <p className="text-sm sm:text-base"><span className="font-medium">Name:</span> {person.name}</p>
                    <p className="text-sm sm:text-base"><span className="font-medium">Roll Number:</span> {person.roll_number}</p>
                    <p className="text-sm sm:text-base"><span className="font-medium">Mobile:</span> {person.mobile}</p>
                    {person.designation && <p className="text-sm sm:text-base"><span className="font-medium">Designation:</span> {person.designation}</p>}
                  </div>
                ) : null
              ))}
            </div>
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
        <div className="text-center mt-6 sm:mt-8 text-white/70 text-xs sm:text-sm">
          <p>&copy; 2025 ERM Forms. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default InfoDeep;
