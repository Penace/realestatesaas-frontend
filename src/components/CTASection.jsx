import { useRef } from "react";
import { Link } from "react-router-dom";
import { useScrollParallax } from "../hooks/useScrollParallax";

export default function CTASection({
  title = "Start Your Journey",
  buttonLink = "/listings",
}) {
  const ctaRef = useRef(null);

  useScrollParallax(ctaRef, {
    parallax: false,
    scale: true,
    opacity: false,
    scaleStrength: 0.02,
    resetOffscreen: true,
  });

  return (
    <section
      ref={ctaRef}
      className="h-64 bg-gray-900 flex items-center justify-center overflow-hidden transition-all duration-700 ease-out"
    >
      <Link
        to={buttonLink}
        className="px-8 py-4 text-white bg-blue-600 hover:bg-blue-500 rounded-xl text-2xl shadow-lg transition-all duration-300 ease-out"
      >
        {title}
      </Link>
    </section>
  );
}
