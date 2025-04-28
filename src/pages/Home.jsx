import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropertyShowcase from "../components/PropertyShowcase";
import FeatureCard from "../components/FeatureCard";
import { fetchListings } from "../services/api";
import { FEATURED_LISTINGS_LIMIT } from "../constants";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState([]);

  useScrollAnimation({
    infoContentId: "infoContent",
    heroSectionId: "heroSection",
  });

  const loadListings = async () => {
    const listings = await fetchListings();
    setFeaturedListings(listings.slice(0, FEATURED_LISTINGS_LIMIT));
  };
  loadListings();

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-white transition-colors duration-700">
      {/* Hero Section */}
      <section
        id="heroSection"
        className="h-[120vh] bg-cover bg-center flex flex-col items-center justify-center transition-transform duration-700 ease-out overflow-hidden relative"
        style={{
          backgroundImage: "url('/src/assets/hero.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1
          id="heroTitle"
          className="text-5xl font-bold text-white bg-black/50 px-6 py-4 rounded-2xl opacity-0 translate-y-10 transition-all duration-700 ease-out shadow-lg backdrop-blur-sm"
        >
          Find Your Dream Property
        </h1>
        <Link
          to="/listings"
          className="mt-6 text-white bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300"
        >
          Browse Listings
        </Link>
      </section>

      {/* Info Section */}
      <section
        id="infoSection"
        className="min-h-[80vh] flex flex-col items-center justify-center bg-white space-y-12 p-10 overflow-hidden relative"
      >
        <div id="infoContent" className="flex flex-col items-center space-y-12">
          {/* Text Content */}
          <div className="text-center space-y-6 max-w-3xl">
            <h2 className="text-4xl font-bold text-gray-900">
              Find. Dream. Live.
            </h2>
            <p className="text-lg text-gray-600">
              Unlock a world of premium properties tailored for your lifestyle.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl">
            <FeatureCard
              title="Property Listings"
              description="Find your dream home among thousands of properties."
            />
            <FeatureCard
              title="Smart Search"
              description="Filter and discover properties that match your needs."
            />
            <FeatureCard
              title="Mortgage Calculator"
              description="Plan your finances with our built-in tools."
            />
            <FeatureCard
              title="Publish Listings"
              description="List your property easily and connect with buyers."
            />
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <div id="listings">
        {featuredListings.map((listing, idx) => (
          <PropertyShowcase
            key={listing.id}
            id={listing.id}
            image={`/src/assets/${listing.image}`}
            title={listing.title}
            description={listing.description}
            noMarginBottom={idx === featuredListings.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
