import Navbar from "../components/Navbar";
import ToastContainer from "../components/common/ToastContainer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <ToastContainer /> {/* 👈 Toasts will appear here globally */}
      <footer className="h-40 bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
        © 2025 Penace · All rights reserved.
      </footer>
    </>
  );
}
