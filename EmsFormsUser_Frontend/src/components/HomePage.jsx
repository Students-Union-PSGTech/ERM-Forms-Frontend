import React from "react";
import "../components_css/HomePage.css";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Enhanced Background Elements */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      <main className="home-main">
        <div className="content-wrapper">
          <div className="header-section">
            <h1>Event Portal</h1>
            <p>PSG College of Technology, Coimbatore</p>
          </div>

          <div className="buttons-section">
            <button
              className="action-button create-button"
              onClick={() => navigate('/create-event')} // 3. Use navigate instead of window.location
            >
              Create Event
            </button>
            
            <button
              className="action-button view-button"
              onClick={() => navigate('/view-events')} // Also update this one
            >
              View Events
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;