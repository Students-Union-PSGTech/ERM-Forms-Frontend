import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./GlobalStyles";
import NavBar from "./components/NavBar";
import EventDetails from "./components/EventDetails";
import EventPreview from "./components/EventPreview";
import ItemsPage from "./components/ItemsPage";
import RoundsPage from "./components/RoundsPage";
import ReviewSubmit from "./components/ReviewSubmit";
import Instructions from "./components/Instructions";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [formData, setFormData] = useState({
    description: {}, items: [], rounds: []
  });
  const [showInstructions, setShowInstructions] = useState(true);
  const [instructionsAgreed, setInstructionsAgreed] = useState(false);

  const handleInstructionsAgree = () => {
    setShowInstructions(false);
    setInstructionsAgreed(true);
  };

  return (
    <AuthProvider>
      <GlobalStyles />
      <BrowserRouter>
        {showInstructions && (
          <Instructions 
            onAgree={handleInstructionsAgree}
          />
        )}
        {instructionsAgreed && (
          <div style={{ 
            filter: showInstructions ? 'blur(5px)' : 'none',
            transition: 'filter 0.3s ease',
            pointerEvents: showInstructions ? 'none' : 'auto'
          }}>
            <NavBar />
            <Routes>
              <Route path="/" element={<EventPreview formData={formData} setFormData={setFormData} />} />
              <Route path="/preview" element={<EventPreview formData={formData} setFormData={setFormData} />} />
              <Route path="/details" element={<EventDetails formData={formData} setFormData={setFormData} />} />
              <Route path="/items" element={<ItemsPage formData={formData} setFormData={setFormData} />} />
              <Route path="/rounds" element={<RoundsPage formData={formData} setFormData={setFormData} />} />
              <Route path="/review" element={<ReviewSubmit formData={formData}/>} />
            </Routes>
          </div>
        )}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

