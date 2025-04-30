import { Link } from "react-router-dom";

export default function AdminHeader() {
  return (
    <header className="w-full bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-blue-600">Admin Dashboard</h1>
      <Link
        to="/"
        className="text-sm text-gray-500 hover:text-blue-600 transition"
      >
        ← Back to Home
      </Link>
    </header>
  );
}
