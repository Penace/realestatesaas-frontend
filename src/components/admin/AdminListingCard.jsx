import { Link } from "react-router-dom";

export default function ListingCard({
  id,
  title,
  location,
  price,
  image,
  fallbackImage = "/assets/fallback.jpg",
  actions = [],
  to = null,
}) {
  const formattedPrice =
    typeof price === "string" && /^\d+$/.test(price)
      ? `$${Number(price).toLocaleString()}`
      : "Price not available";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md space-y-4 hover:shadow-lg transition-all relative">
      {/* Image */}
      {to ? (
        <Link
          to={to}
          className="block w-full h-40 rounded-xl overflow-hidden bg-gray-100"
        >
          <img
            src={image}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
            alt={title}
            className="w-full h-full object-cover"
          />
        </Link>
      ) : (
        <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={image}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Info */}
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-500">{location}</p>
        <p className="text-blue-600 font-semibold">{formattedPrice}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 pt-4">
        {Array.isArray(actions) &&
          actions.map((action, i) => <div key={i}>{action}</div>)}
      </div>
    </div>
  );
}
