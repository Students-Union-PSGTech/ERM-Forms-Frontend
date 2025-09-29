import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  const [formData, setFormData] = useState({
    description: {}, items: [], rounds: []
  });
  const [showInstructions, setShowInstructions] = useState(true);
  const [instructionsAgreed, setInstructionsAgreed] = useState(false);

  const handleInstructionsAgree = () => {
    setShowInstructions(false);
    setInstructionsAgreed(true);
  };

  if (showInstructions) {
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
        <Route path="/" element={<Navigate to="/preview" />} />
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
              <NavBar />
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