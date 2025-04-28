import { useParams } from "react-router-dom";
import listings from "../data/listings";

export default function ListingDetail() {
  const { id } = useParams();
  const listing = listings.find((l) => l.id === parseInt(id));

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Listing not found.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Image */}
      <div
        className="h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${listing.image})` }}
      ></div>

      {/* Property Details */}
      <div className="flex flex-col items-center p-10 space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">{listing.title}</h1>
        <p className="text-gray-500 text-lg">{listing.location}</p>
        <p className="text-blue-600 text-2xl font-semibold">{listing.price}</p>
        <p className="max-w-3xl text-gray-700 text-center mt-6">
          {listing.description}
        </p>
      </div>
    </div>
  );
}
