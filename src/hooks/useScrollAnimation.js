import { useEffect } from "react";

export function useScrollAnimation({ infoContentId, heroSectionId }) {
  useEffect(() => {
    const infoContent = document.getElementById(infoContentId);
    const heroSection = document.getElementById(heroSectionId);

    const isMobile = window.innerWidth < 768;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      if (!isMobile && heroSection) {
        const heroParallaxSpeed = 0.25;
        heroSection.style.transform = `scale(${1 + scrollTop * 0.0002})`;
        heroSection.style.backgroundPositionY = `${
          scrollTop * heroParallaxSpeed
        }px`;
      }

      if (infoContent) {
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
      }
    };

    setTimeout(() => {
      const heroTitle = document.getElementById("heroTitle");
      const heroButton = document.getElementById("heroButton");

      if (heroTitle) {
        heroTitle.classList.remove("opacity-0", "translate-y-10");
        heroTitle.classList.add("opacity-100", "translate-y-0");
      }
      if (heroButton) {
        heroButton.classList.remove("opacity-0", "translate-y-10");
        heroButton.classList.add("opacity-100", "translate-y-0");
      }
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [infoContentId, heroSectionId]);
}
