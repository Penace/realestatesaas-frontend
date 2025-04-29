import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useScrollParallax } from "../hooks/useScrollParallax";

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
      button.style.transform = `translateY(${
        Math.sin(scrollY * 0.003) * 5
      }px) scale(1.02)`;
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
      <Link
        ref={buttonRef}
        to={buttonLink}
        className="px-10 py-5 text-white bg-blue-600 hover:bg-blue-500 rounded-2xl text-2xl shadow-2xl transition-all duration-500 ease-out transform-gpu hover:scale-105"
      >
        {title}
      </Link>
    </section>
  );
}
