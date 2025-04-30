import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./app/routes/routes.jsx";
import "./index.css";
import { ToastProvider } from "./context/ToastProvider.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <Routes />
        <Routes />
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
