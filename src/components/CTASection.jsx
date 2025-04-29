import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useScrollParallax } from "../hooks/useScrollParallax";

export default function CTASection({
  title = "Start Your Journey",
  buttonLink = "/listings",
}) {
  const ctaRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useScrollParallax(ctaRef, {
    parallax: false,
    scale: true,
    opacity: false,
    scaleStrength: 0.02,
    resetOffscreen: true,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={ctaRef}
      className={`h-64 bg-gray-900 flex items-center justify-center overflow-hidden transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <Link
        to={buttonLink}
        className="px-8 py-4 text-white bg-blue-600 hover:bg-blue-500 rounded-xl text-2xl shadow-lg transition-all duration-500 ease-out transform hover:scale-105"
      >
        {title}
      </Link>
    </section>
  );
}
