import { loader } from "@monaco-editor/react";

// Configure Monaco Editor at the absolute top of the application entry point
// This resolves "MonacoEnvironment is not defined" and web worker fallback warnings
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
  }
});

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
