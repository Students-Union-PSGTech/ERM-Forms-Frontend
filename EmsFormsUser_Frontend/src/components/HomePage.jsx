import React from "react";
import "../components_css/HomePage.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const club_name = localStorage.getItem('association_name') || 'User';
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <button className="logout-button" onClick={handleLogout}>Logout</button>
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
            <h1>Event Portal - Intrams 2025</h1>
            <h2>Welcome, {club_name}</h2>
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
              onClick={() => navigate('/my-events')} // Also update this one
            >
              View Events
            </button>
            <button
              className="action-button view-button"
              onClick={() => navigate('/edit')}
            >
              Edit Events
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;