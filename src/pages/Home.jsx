import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropertyShowcase from "../components/PropertyShowcase";
import FeatureCard from "../components/FeatureCard";
import { fetchListings } from "../services/api";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useHeroParallax } from "../hooks/useHeroParallax";
import CTASection from "../components/CTASection";
import SectionDivider from "../components/SectionDivider";
import Button from "../components/Button";

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [auctionListing, setAuctionListing] = useState(null);
  const [sponsoredListings, setSponsoredListings] = useState([]);

  useHeroParallax();

  useScrollAnimation({
    infoContentId: "infoContent",
    heroSectionId: "heroSection",
  });

  useEffect(() => {
    const loadListings = async () => {
      const listings = await fetchListings();
      setFeaturedListings(listings.filter((l) => l.isFeatured));
      setAuctionListing(listings.find((l) => l.isAuction));
      setSponsoredListings(listings.filter((l) => l.isSponsored));
    };

    loadListings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-white transition-colors duration-700">
      {/* Hero Section */}
      <section
        id="heroSection"
        className="h-[120vh] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center transition-transform duration-700 ease-out overflow-hidden relative"
        style={{
          backgroundImage: "url('/assets/hero.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1
          id="heroTitle"
          className="text-4xl md:text-5xl font-bold text-white bg-black/50 px-6 py-4 rounded-2xl opacity-0 translate-y-10 transition-all duration-700 ease-out shadow-lg backdrop-blur-sm w-[90%] max-w-2xl text-center mb-5"
        >
          Find Your Dream Property
        </h1>
        <Button to="/listings" size="md" variant="hero">
          Browse Listings
        </Button>
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

      {/* Smooth Background Transition */}
      <div className="w-full h-32 bg-gradient-to-b from-white via-gray-100 to-white" />

      {/* Auction Spotlight */}
      {auctionListing && (
        <>
          <div className="text-center py-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Auction Spotlight
            </h2>
            <p className="text-gray-500">
              Exclusive opportunities, limited time.
            </p>
          </div>

          <PropertyShowcase
            key={auctionListing.id}
            id={auctionListing.id}
            images={auctionListing.images}
            title={auctionListing.title}
            description={auctionListing.description}
          />
        </>
      )}

      {/* Featured Properties */}
      <div className="text-center py-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          Featured Collection
        </h2>
        <p className="text-gray-500">Hand-picked premium listings.</p>
      </div>
      {featuredListings.slice(0, 2).map((listing, idx) => (
        <>
          <PropertyShowcase
            key={listing.id}
            id={listing.id}
            images={listing.images}
            title={listing.title}
            description={listing.description}
          />
          {idx === 0 && <SectionDivider />}
        </>
      ))}

      {/* Soft CTA Section */}
      <CTASection />

      {/* Sponsored Highlights */}
      <div className="text-center py-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          Curated Exclusives
        </h2>
        <p className="text-gray-500">Properties by invitation only.</p>
      </div>

      {sponsoredListings.slice(0, 2).map((listing, idx) => (
        <>
          <PropertyShowcase
            key={listing.id}
            id={listing.id}
            images={listing.images}
            title={listing.title}
            description={listing.description}
          />
          {idx === 0 && <SectionDivider />}
        </>
      ))}
    </div>
  );
}
