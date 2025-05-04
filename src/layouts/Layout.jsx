import { useAuth } from "../context/AuthProvider";
import { useLocation } from "react-router-dom"; // Make sure to import useLocation
import Navbar from "../components/Navbar";
import ToastContainer from "../components/common/ToastContainer";

export default function Layout({ children }) {
  const { user } = useAuth();
  // const location = useLocation(); // Use useLocation hook to get the current path
  const isHome = location.pathname === "/";
  const isListingDetail = location.pathname.startsWith("/listings/");

  return (
    <>
      <Navbar user={user} />
      <main
        className={`${
          isHome
            ? "home-main" // Special layout for the homepage
            : isListingDetail
            ? "listing-detail-layout" // Special layout for listing details
            : "default-layout" // Default layout for all other pages
        }`}
      >
        {children}
      </main>
      <ToastContainer />
      <footer className="h-40 bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
        © 2025 Penace · All rights reserved.
      </footer>
    </>
  );
}
