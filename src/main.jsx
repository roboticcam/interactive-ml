import React from "react";
import ReactDOM from "react-dom/client";
import "katex/dist/katex.min.css";
import "./index.css";
import App from "./App.jsx";
import { LangProvider } from "./i18n/LangContext.jsx";

// Skip rendering when loaded inside the PDF drawer iframe (see index.html) — the
// parent handles the navigation instead of mounting a nested copy of the app.
if (!window.__EMBEDDED__) {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <LangProvider>
        <App />
      </LangProvider>
    </React.StrictMode>
  );
}
