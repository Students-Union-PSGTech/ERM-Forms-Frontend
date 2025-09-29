import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import EventDetails from './EventDetails';
import EventPreview from './EventPreview';
import ItemsPage from './ItemsPage';
import RoundsPage from './RoundsPage';
import ReviewSubmit from './ReviewSubmit';
import Instructions from './Instructions';

function CreateEventLayout() {
  const [formData, setFormData] = useState({
    description: {}, items: [], rounds: []
  });

  return (
    <>
      <NavBar />
      <Outlet context={{ formData, setFormData }} />
    </>
  );
}

export default CreateEventLayout;