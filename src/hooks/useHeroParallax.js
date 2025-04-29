import { useEffect } from "react";

export function useHeroParallax() {
  useEffect(() => {
    const heroSection = document.getElementById("heroSection");
    const heroTitle = document.getElementById("heroTitle");
    const heroButton = document.getElementById("heroButton");

    if (heroButton) {
      heroButton.classList.remove("opacity-0", "translate-y-10");
      heroButton.classList.add("opacity-100", "translate-y-0");
    }

    const isMobile = window.innerWidth < 768;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const parallaxSpeed = isMobile ? 0.1 : 0.25;

      const rect = heroSection.getBoundingClientRect();
      const fullyOutOfView = rect.bottom < 0 || rect.top > window.innerHeight;

      if (fullyOutOfView) {
        heroSection.style.backgroundPositionY = "50%";
        heroSection.style.transform = "scale(1)";
        return;
      }

      heroSection.style.backgroundPositionY = `${scrollTop * parallaxSpeed}px`;
      heroSection.style.transform = `scale(${1 + scrollTop * 0.0002})`;
    };

    setTimeout(() => {
      if (heroTitle) {
        heroTitle.classList.remove("opacity-0", "translate-y-10");
        heroTitle.classList.add("opacity-100", "translate-y-0");
      }
      if (heroButton) {
        heroButton.classList.remove("opacity-0", "translate-y-10");
        heroButton.classList.add("opacity-100", "translate-y-0");
      }
    }, 150);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}
