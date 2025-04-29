import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useScrollParallax } from "../hooks/useScrollParallax.js";
import SectionDivider from "./SectionDivider";

export default function PropertyShowcase({ id, images, title, description }) {
  const showcaseRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useScrollParallax(showcaseRef, {
    parallax: true,
    scale: true,
    opacity: true,
    parallaxStrength: 30,
    scaleStrength: 0.07,
    mobileParallax: true,
    resetOffscreen: true,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (showcaseRef.current) {
      observer.observe(showcaseRef.current);
    }

    return () => {
      if (showcaseRef.current) {
        observer.unobserve(showcaseRef.current);
      }
    };
  }, []);

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
            backgroundColor: "#f8f8f8",
          }}
        >
          {/* Subtle fade-in black overlay */}
          <div className="absolute inset-0 bg-black opacity-20 transition-opacity duration-1000 pointer-events-none" />

          {/* Info Card */}
          <div
            className={`relative z-10 bg-black/50 px-6 py-8 rounded-xl text-center shadow-lg backdrop-blur-sm w-[90%] max-w-2xl transition-all duration-1000 ease-out ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl font-bold text-white">{title}</h2>
            <p className="text-lg text-gray-200 mt-4">{description}</p>
          </div>
        </section>
      </div>
    </Link>
  );
}
