import { useRef } from "react";
import { Link } from "react-router-dom";
import { useScrollParallax } from "../hooks/useScrollParallax";
import SectionDivider from "./SectionDivider";

export default function PropertyShowcase({ id, images, title, description }) {
  const showcaseRef = useRef(null);

  useScrollParallax(showcaseRef, {
    parallax: true,
    scale: true,
    opacity: true,
    parallaxStrength: 30,
    scaleStrength: 0.07,
    mobileParallax: true,
    resetOffscreen: true,
  });

  const backgroundImage =
    images && images.length > 0
      ? `/assets/${images[0]}`
      : "/assets/fallback.jpg";

  return (
    <Link to={`/listings/${id}`} className="block">
      <div className="relative z-10 overflow-hidden">
        <section
          ref={showcaseRef}
          className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center transition-all duration-700 ease-out transform-gpu will-change-transform rounded-none md:rounded-3xl overflow-hidden"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#f8f8f8", // fallback color
          }}
        >
          {/* Subtle fade-in black overlay */}
          <div className="absolute inset-0 bg-black opacity-20 transition-opacity duration-1000 pointer-events-none" />

          <div className="relative z-10 bg-black/50 px-6 py-8 rounded-xl text-center shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02] w-[90%] max-w-2xl">
            <h2 className="text-4xl font-bold text-white">{title}</h2>
            <p className="text-lg text-gray-200 mt-4">{description}</p>
          </div>
        </section>
      </div>
    </Link>
  );
}
