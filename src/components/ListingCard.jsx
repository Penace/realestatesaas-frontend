import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ListingCard({ id, images, title, location, price }) {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorited(stored.includes(id));
  }, [id]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    const updated = isFavorited
      ? stored.filter((favId) => favId !== id)
      : [...stored, id];
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorited(!isFavorited);
  };

  return (
    <Link
      to={`/listings/${id}`}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-2xl flex flex-col relative"
    >
      <div
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(/assets/${images[0]})`,
        }}
      >
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-red-500 p-2 rounded-full shadow-md z-10"
        >
          {isFavorited ? "♥" : "♡"}
        </button>
      </div>

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
