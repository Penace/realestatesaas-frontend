import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./app/routes/routes.jsx";
import "./index.css";
import { ToastProvider } from "./context/ToastProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <Routes />
    </ToastProvider>
  </React.StrictMode>
);
