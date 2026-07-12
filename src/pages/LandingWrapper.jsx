import React, { useState } from "react";
import LandingPage from "./LandingPage";
import NewLandingPage from "./NewLandingPage";

export default function LandingWrapper({ theme, toggleTheme, onEnter }) {
  // state to track which landing page to show. true = NewLandingPage, false = Original LandingPage
  const [useNewLanding, setUseNewLanding] = useState(true);

  const handleSwitch = () => {
    setUseNewLanding(!useNewLanding);
  };

  return useNewLanding ? (
    <NewLandingPage 
      theme={theme} 
      toggleTheme={toggleTheme} 
      onEnter={onEnter} 
      onSwitch={handleSwitch} 
    />
  ) : (
    <LandingPage 
      theme={theme} 
      toggleTheme={toggleTheme} 
      onEnter={onEnter} 
      onSwitch={handleSwitch} 
    />
  );
}
