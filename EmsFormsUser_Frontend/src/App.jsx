import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { GlobalStyles } from './GlobalStyles';
import EventDetails from './components/EventDetails';
import EventPreview from './components/EventPreview';
import ItemsPage from './components/ItemsPage';
import RoundsPage from './components/RoundsPage';
import ReviewSubmit from './components/ReviewSubmit';
import Instructions from './components/Instructions';
import HomePage from './components/HomePage';
import Login from './components/Login';
import CreateEventLayout from './components/CreateEventLayout';
import UpdateEventController from './components/UpdateEventController';
import ViewEvents from './components/ViewEvents';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import EditView from './components/EditView';
// Wrapper component for protected routes
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="loading">Checking authentication...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Wrapper components to pass context to elements
const EventPreviewWrapper = () => { const { formData, setFormData } = useOutletContext(); return <EventPreview formData={formData} setFormData={setFormData} />; };
const EventDetailsWrapper = () => { const { formData, setFormData } = useOutletContext(); return <EventDetails formData={formData} setFormData={setFormData} />; };
const ItemsPageWrapper = () => { const { formData, setFormData } = useOutletContext(); return <ItemsPage formData={formData} setFormData={setFormData} />; };
const RoundsPageWrapper = () => { const { formData, setFormData } = useOutletContext(); return <RoundsPage formData={formData} setFormData={setFormData} />; };
const ReviewSubmitWrapper = () => { const { formData } = useOutletContext(); return <ReviewSubmit formData={formData} />; };


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
          
          <Route path="/my-events" element={<ViewEvents />} />
          <Route path="/edit" element={<EditView />} />
          <Route path="/edit/:id" element={<UpdateEventController />} />
          
          <Route path="/create-event" element={
            <ProtectedRoute>
              <CreateEventLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="instructions" />} />
            <Route path="instructions" element={<Instructions />} />
            <Route path="preview" element={<EventPreviewWrapper />} />
            <Route path="details" element={<EventDetailsWrapper />} />
            <Route path="items" element={<ItemsPageWrapper />} />
            <Route path="rounds" element={<RoundsPageWrapper />} />
            <Route path="review" element={<ReviewSubmitWrapper />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;