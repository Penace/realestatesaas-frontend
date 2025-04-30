import { Link } from "react-router-dom";

export default function ListingCard({ id, images, title, location, price }) {
  return (
    <Link
      to={`/listings/${id}`}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-2xl flex flex-col"
    >
      <div
        className="h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url(/assets/${images[0]})`,
        }}
      ></div>

      <div className="p-6 flex flex-col space-y-2">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-500">{location}</p>
        <p className="text-lg font-semibold text-blue-600">
          {price && !isNaN(Number(price))
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(price))
            : "Price not available"}
        </p>
      </div>
    </Link>
  );
}
