import { useRef, useEffect, useState } from "react";
import Button from "./Button";
import { useScrollParallax } from "../hooks/useScrollParallax.js";

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
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => ctaRef.current && observer.unobserve(ctaRef.current);
  }, []);

  // Bonus: soft button float parallax
  useEffect(() => {
    const handleScroll = () => {
      if (!buttonRef.current) return;
      const scrollY = window.scrollY;
      buttonRef.current.style.transform = `translateY(${
        Math.sin(scrollY * 0.002) * 4
      }px)`;
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
        background: "radial-gradient(circle at center, #1f2937, #0f172a)", // gray-800 to gray-900
      }}
    >
      <div ref={buttonRef}>
        <Button to={buttonLink} size="lg" variant="secondary">
          {title}
        </Button>
      </div>
    </section>
  );
}
