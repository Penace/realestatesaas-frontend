import { useEffect } from "react";
import { Link } from "react-router-dom";
import PropertyShowcase from "../components/PropertyShowcase";
import FeatureCard from "../components/FeatureCard";
import house1 from "/src/assets/house1.jpg";
import house2 from "/src/assets/house2.jpg";
import house3 from "/src/assets/house3.jpg";

export default function Home() {
  useEffect(() => {
    const infoContent = document.getElementById("infoContent"); // ⬅ Target only content
    const heroTitle = document.getElementById("heroTitle");
    const heroSection = document.getElementById("heroSection");
    const ctaSection = document.getElementById("ctaSection");

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const isMobile = window.innerWidth < 768;

      const heroParallaxSpeed = isMobile ? 0.15 : 0.25;
      heroSection.style.transform = `scale(${1 + scrollTop * 0.0002})`;
      heroSection.style.backgroundPositionY = `${
        scrollTop * heroParallaxSpeed
      }px`;

      const rect = infoContent.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollProgress =
          1 - Math.min(Math.max(rect.top / windowHeight, 0), 1);

        infoContent.style.opacity = scrollProgress;
        infoContent.style.transform = `translateY(${
          (1 - scrollProgress) * 8
        }px)`;

        const blurThreshold = 0.5;
        const maxBlur = 8;
        const adjustedProgress = Math.min(scrollProgress / blurThreshold, 1);
        const blurAmount = (1 - adjustedProgress) * maxBlur;
        infoContent.style.filter = `blur(${blurAmount}px)`;
      } else {
        infoContent.style.opacity = 0.05;
        infoContent.style.transform = "translateY(8px)";
        infoContent.style.filter = "blur(8px)";
      }

      const ctaRect = ctaSection.getBoundingClientRect();
      if (ctaRect.top < windowHeight * 0.9) {
        ctaSection.style.opacity = 1;
        ctaSection.style.transform = "translateY(0px)";
      } else {
        ctaSection.style.opacity = 0.05;
        ctaSection.style.transform = "translateY(20px)";
      }
    };

    setTimeout(() => {
      heroTitle.classList.remove("opacity-0", "translate-y-10");
      heroTitle.classList.add("opacity-100", "translate-y-0");
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      {/* Properties Section */}
      <div id="listings" className="space-y-12">
        <Link to="/listings/1">
          <PropertyShowcase
            image={house1}
            title="Modern Luxury Villa"
            description="5 bedrooms · Private Pool · Panoramic Views"
          />
        </Link>

        <Link to="/listings/2">
          <PropertyShowcase
            image={house2}
            title="Tuscan Mansion"
            description="7 bedrooms · Historic Charm · Exclusive Location"
          />
        </Link>

        <Link to="/listings/3">
          <PropertyShowcase
            image={house3}
            title="Penthouse Apartment"
            description="3 bedrooms · Rooftop Terrace · City Skyline"
          />
        </Link>
      </div>

      {/* CTA Section */}
      <section
        id="ctaSection"
        className="h-64 bg-gray-900 flex items-center justify-center overflow-hidden opacity-0 transition-all duration-700"
      >
        <Link
          to="/listings"
          className="px-8 py-4 text-white bg-blue-600 hover:bg-blue-500 rounded-xl text-2xl shadow-lg transition-all duration-300 ease-out"
        >
          Start Your Journey
        </Link>
      </section>

      {/* Footer Placeholder */}
      <footer className="h-40 bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
        © 2025 RealEstateSaaS · All rights reserved.
      </footer>
    </div>
  );
}
