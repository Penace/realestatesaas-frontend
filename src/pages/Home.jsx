import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropertyShowcase from "../components/PropertyShowcase";
import FeatureCard from "../components/home/FeatureCard";
import { fetchListings } from "../services/api";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useHeroParallax } from "../hooks/useHeroParallax";
import CTASection from "../components/home/CTASection";
import SectionDivider from "../components/common/SectionDivider.jsx";
import Button from "../components/common/Button.jsx";

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [auctionListing, setAuctionListing] = useState([]);
  const [sponsoredListings, setSponsoredListings] = useState([]);

  useScrollAnimation({
    infoContentId: "infoContent",
    heroSectionId: "heroSection",
  });

  useHeroParallax();

  useEffect(() => {
    const loadListings = async () => {
      const listings = await fetchListings();
      const featured = listings.filter((l) => l.tag === "featured").slice(0, 2);
      const auction = listings.filter((l) => l.tag === "auction").slice(0, 1);
      const sponsored = listings
        .filter((l) => l.tag === "sponsored")
        .slice(0, 2);

      setFeaturedListings(featured);
      setAuctionListing(auction);
      setSponsoredListings(sponsored);

      console.log("featuredListings:", featured);
      console.log("auctionListing:", auction);
      console.log("sponsoredListings:", sponsored);
    };

    loadListings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-white transition-colors duration-700">
      {/* Hero Section */}
      <section
        id="heroSection"
        className="h-[90vh] md:min-h-screen lg:min-h-screen xl:min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center transition-transform duration-700 ease-out relative z-0"
        style={{
          backgroundImage: "url('/assets/hero.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      >
        <h1
          id="heroTitle"
          className="text-4xl md:text-5xl font-bold text-white bg-black/50 px-6 py-4 rounded-2xl opacity-0 translate-y-10 transition-all duration-700 ease-out shadow-lg backdrop-blur-sm w-[90%] max-w-2xl text-center"
        >
          Find Your Dream Property
        </h1>
        <Link
          id="heroButton"
          to="/listings"
          className="mt-6 text-white bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-lg font-semibold opacity-0 translate-y-10 transition-all duration-700 ease-out"
        >
          Browse Listings
        </Link>
      </section>

      {/* Info Section */}
      <section
        id="infoSection"
        className="min-h-[30vh] flex flex-col items-center justify-center bg-white space-y-12 p-8 overflow-hidden relative"
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

      <div className="flex gap-6 justify-center mt-6 mx-10">
        <Button to="/calculator" size="lg" variant="cta">
          Try Our Calculator
        </Button>
        <Button to="/listings" size="lg" variant="cta">
          Browse Listings
        </Button>
      </div>

      {/* Smooth Background Transition */}
      <div className="w-full h-16 bg-gradient-to-b from-white via-gray-100/40 to-white" />

      {/* Auction Spotlight */}
      {auctionListing.length > 0 && (
        <>
          <div className="text-center py-6">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Auction Spotlight
            </h2>
            <p className="text-gray-500">
              Exclusive opportunities, limited time.
            </p>
          </div>

          <PropertyShowcase
            key={auctionListing[0]._id}
            id={auctionListing[0]._id}
            images={auctionListing[0].images}
            title={auctionListing[0].title}
            description={auctionListing[0].description}
          />
        </>
      )}

      {/* Featured Properties */}
      {featuredListings.length > 0 && (
        <>
          <SectionDivider label="Featured Collection" />
          <div className="text-center py-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Featured Collection
            </h2>
            <p className="text-gray-500">Hand-picked premium listings.</p>
          </div>
          {featuredListings.map((listing) => (
            <PropertyShowcase
              key={listing._id}
              id={listing._id}
              images={listing.images}
              title={listing.title}
              description={listing.description}
            />
          ))}
        </>
      )}

      {/* Sponsored Highlights */}
      {sponsoredListings.length > 0 && (
        <>
          <SectionDivider label="Curated Exclusives" />
          <div className="text-center py-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Curated Exclusives
            </h2>
            <p className="text-gray-500">Properties by invitation only.</p>
          </div>

          {sponsoredListings.map((listing) => (
            <PropertyShowcase
              key={listing._id}
              id={listing._id}
              images={listing.images}
              title={listing.title}
              description={listing.description}
            />
          ))}
        </>
      )}

      {/* Soft CTA Section */}
      <CTASection />
    </div>
  );
}
