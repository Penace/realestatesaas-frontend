import { useAuth } from "../context/AuthProvider";
import Navbar from "../components/Navbar";
import ToastContainer from "../components/common/ToastContainer";

export default function Layout({ children }) {
  const { user } = useAuth();
  const isHome = location.pathname === "/";

  return (
    <>
      <Navbar user={user} />
      <main className={isHome ? "" : "px-4 py-8 max-w-7xl mx-auto"}>
        {children}
      </main>
      <ToastContainer />
      <footer className="h-40 bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
        © 2025 Penace · All rights reserved.
      </footer>
    </>
  );
}
