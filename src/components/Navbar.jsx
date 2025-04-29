import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        RealEstateSaaS
      </Link>
      <div className="space-x-6">
        <Link
          to="/"
          className="text-gray-600 hover:text-blue-600 transition-all"
        >
          Home
        </Link>
        <Link
          to="/listings"
          className="text-gray-600 hover:text-blue-600 transition-all"
        >
          Listings
        </Link>
        <Link
          to="/publish"
          className="text-gray-600 hover:text-blue-600 transition-all"
        >
          Publish
        </Link>
      </div>
    </nav>
  );
}
