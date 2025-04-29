// src/hooks/useToast.js
import { useState, useCallback } from "react";

let id = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "info", duration = 3000) => {
      const newToast = { id: id++, message, type };
      setToasts((toasts) => [...toasts, newToast]);

      setTimeout(() => {
        removeToast(newToast.id);
      }, duration);
    },
    [removeToast]
  );

  return {
    toasts,
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    info: (msg) => addToast(msg, "info"),
    warning: (msg) => addToast(msg, "warning"),
    removeToast,
  };
}
