import { useEffect } from "react";

export function useScrollParallax(ref, options = {}) {
  const {
    parallax = true,
    scale = true,
    opacity = true,
    resetOffscreen = true,
    parallaxStrength = 25,
    scaleStrength = 0.03,
    mobileParallax = false,
  } = options;

  useEffect(() => {
    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;

      const isMobile = window.innerWidth < 768;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const fullyOutOfView = rect.bottom < 0 || rect.top > viewportHeight;

      if (fullyOutOfView && resetOffscreen) {
        el.style.opacity = "0.05";
        el.style.transform = "scale(1)";
        el.style.backgroundPositionY = "50%";
        return;
      }

      const middle = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(viewportHeight / 2 - middle);
      const scrollRatio = Math.max(1 - distanceFromCenter / viewportHeight, 0);
      const boostedOpacity = Math.min(scrollRatio * 1.37, 1);

      if (opacity) {
        el.style.opacity = boostedOpacity.toFixed(2);
      } else {
        el.style.opacity = "1";
      }

      if (scale) {
        el.style.transform = `scale(${1 + scrollRatio * scaleStrength})`;
      }

      if (parallax && (!isMobile || mobileParallax)) {
        const offset = 50 - scrollRatio * parallaxStrength;
        el.style.backgroundPositionY = `${offset}%`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    ref,
    parallax,
    scale,
    opacity,
    parallaxStrength,
    scaleStrength,
    resetOffscreen,
    mobileParallax,
  ]);
}
