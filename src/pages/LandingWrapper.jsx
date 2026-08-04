import React, { useState } from "react";
import LandingPage from "./LandingPage";
import NewLandingPage from "./NewLandingPage";
import HomePage3 from "./HomePage3";

export default function LandingWrapper({ theme, toggleTheme, onEnter }) {
  // Home 3.0 is the default. The switch affordance keeps the earlier concepts
  // available for comparison without affecting the signed-in application.
  const [landingVersion, setLandingVersion] = useState(3);

  const handleSwitch = () => {
    setLandingVersion((current) => current === 3 ? 2 : current === 2 ? 1 : 3);
  };

  if (landingVersion === 3) {
    return <HomePage3 onEnter={onEnter} onSwitch={handleSwitch} />;
  }

  return landingVersion === 2 ? (
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
