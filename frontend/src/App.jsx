import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./GlobalStyles";
import NavBar from "./components/NavBar";
import DescriptionPage from "./components/descriptionPage";
import ItemsPage from "./components/ItemsPage";
import RoundsPage from "./components/RoundsPage";
import ReviewSubmit from "./components/ReviewSubmit";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [formData,setFormData]=useState({
    description:{}, items:[], rounds:[]
  });

  return (
    <AuthProvider>
      <GlobalStyles />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<DescriptionPage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/rounds" element={<RoundsPage />} />
          <Route path="/review" element={<ReviewSubmit form={formData}/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

