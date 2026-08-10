import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// NOTE: Monaco's `loader.config()` used to run here, at the top of the entry.
// It pulled @monaco-editor/react into the entry chunk for every visitor, even
// though only editor screens need it. It now lives in config/monacoLoader.js and
// is invoked by the components that actually mount an editor.

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
