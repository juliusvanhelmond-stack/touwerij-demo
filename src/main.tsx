import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import LenisProvider from "./lib/lenis-provider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LenisProvider>
      <App />
    </LenisProvider>
  </StrictMode>,
);
