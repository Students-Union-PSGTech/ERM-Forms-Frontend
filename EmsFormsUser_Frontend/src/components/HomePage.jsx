import React from "react";
import "../components_css/HomePage.css";

const HomePage = () => {
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
              onClick={() => window.location.href = '/create-event'}
            >
              Create Event
            </button>
            
            <button 
              className="action-button view-button"
              onClick={() => window.location.href = '/view-events'}
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