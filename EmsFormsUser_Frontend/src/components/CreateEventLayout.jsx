import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

const STORAGE_KEY = 'createEventFormData';
const AGREED_KEY = 'createEventAgreed';

function CreateEventLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState(() => {
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : { description: {}, items: [], rounds: [] };
    } catch {
      return { description: {}, items: [], rounds: [] };
    }
  });

  const [agreedToInstructions, setAgreedToInstructions] = useState(() => {
    return sessionStorage.getItem(AGREED_KEY) === 'true';
  });

  // Persist form and agreement across steps
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    sessionStorage.setItem(AGREED_KEY, agreedToInstructions ? 'true' : 'false');
  }, [agreedToInstructions]);

  // Guard: force instructions first (don’t bounce to /home)
  useEffect(() => {
    if (!agreedToInstructions) {
      const path = location.pathname;
      if (path.startsWith('/create-event') && !path.endsWith('/instructions')) {
        navigate('/create-event/instructions', { replace: true });
      }
    }
  }, [agreedToInstructions, location.pathname, navigate]);

  return (
    <>
      <NavBar />
      <Outlet context={{ formData, setFormData, agreedToInstructions, setAgreedToInstructions }} />
    </>
  );
}

export default CreateEventLayout;