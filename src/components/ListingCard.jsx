import { Link } from "react-router-dom";

export default function ListingCard({ id, image, title, location, price }) {
  return (
    <Link to={`/listings/${id}`} className="group">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl">
        <div
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-500 mt-2">{location}</p>
          <p className="text-blue-600 text-lg font-semibold mt-4">{price}</p>
        </div>
      </div>
    </Link>
  );
}
