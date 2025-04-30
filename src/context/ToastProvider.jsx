import { createContext, useContext, useState } from "react";
import ToastContainer from "../components/common/ToastContainer";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismissToast(id), duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* ✅ Correct: Pass the 'toasts' state as a prop */}
      <ToastContainer toasts={toasts} dismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
