import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useScrollParallax } from "../hooks/useScrollParallax";
import Button from "./Button";

export default function CTASection({
  title = "Start Your Journey",
  buttonLink = "/listings",
}) {
  const ctaRef = useRef(null);
  const buttonRef = useRef(null);
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

  // Bonus: Soft Button Parallax
  useEffect(() => {
    const handleScroll = () => {
      const button = buttonRef.current;
      if (!button) return;

      const scrollY = window.scrollY;
      button.style.transform = `translateY(${Math.sin(scrollY * 0.003) * 5}px)`; // 🔥 REMOVE scale(1.02) HERE
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={ctaRef}
      className={`h-64 flex items-center justify-center overflow-hidden transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        background: "radial-gradient(circle at center, #1f3037, #111827)", // gray-800 to gray-900 approx
      }}
    >
      <Button to="/listings" size="lg" variant="primary">
        Start Your Journey
      </Button>
      {/* <Link ref={buttonRef} to={buttonLink} className="group">
        <div className="px-10 py-5 text-white bg-blue-600 rounded-2xl text-2xl shadow-2xl transition-all duration-300 ease-out transform-gpu group-hover:scale-105 group-hover:shadow-3xl">
          {title}
        </div>
      </Link> */}
    </section>
  );
}
