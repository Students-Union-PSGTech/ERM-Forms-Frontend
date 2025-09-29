import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { GlobalStyles } from './GlobalStyles';
import NavBar from './components/NavBar';
import EventDetails from './components/EventDetails';
import EventPreview from './components/EventPreview';
import ItemsPage from './components/ItemsPage';
import RoundsPage from './components/RoundsPage';
import ReviewSubmit from './components/ReviewSubmit';
import Instructions from './components/Instructions';
import HomePage from './components/HomePage';
import Login from './components/Login';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// Wrapper component for protected routes
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="loading">Checking authentication...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Component to handle the form flow
function FormFlow() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: {}, items: [], rounds: []
  });
  const [instructionsAgreed, setInstructionsAgreed] = useState(false);

  const handleInstructionsAgree = () => {
    setInstructionsAgreed(true);
    // 3. Add explicit navigation to the first step of the form
    navigate('/create-event/preview'); 
  };

  if (!instructionsAgreed) {
    return <Instructions onAgree={handleInstructionsAgree} />;
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/preview" element={<EventPreview formData={formData} setFormData={setFormData} />} />
        <Route path="/details" element={<EventDetails formData={formData} setFormData={setFormData} />} />
        <Route path="/items" element={<ItemsPage formData={formData} setFormData={setFormData} />} />
        <Route path="/rounds" element={<RoundsPage formData={formData} setFormData={setFormData} />} />
        <Route path="/review" element={<ReviewSubmit formData={formData} />} />
        
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          
          <Route path="/create-event/*" element={
            <ProtectedRoute>
              <FormFlow />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;