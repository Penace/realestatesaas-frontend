import { useLayoutEffect } from "react";

export function useHeroParallax(ref) {
  useLayoutEffect(() => {
    const heroImage = ref?.current;
    if (!heroImage) return;

    const isMobile = window.innerWidth < 768;

    const handleScroll = () => {
      const scrollTop = -heroImage.getBoundingClientRect().top;
      const parallaxSpeed = isMobile ? 0.1 : 0.25;

      const rect = heroImage.getBoundingClientRect();
      const fullyOutOfView = rect.bottom < 0 || rect.top > window.innerHeight;

      if (fullyOutOfView) {
        heroImage.style.transform = "scale(1)";
        return;
      }

      const scale = Math.max(1, 1 + scrollTop * 0.0002);
      heroImage.style.transform = `translateY(${
        scrollTop * parallaxSpeed * 0.2
      }px) scale(${scale})`;

      console.log("scrollTop:", scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ref]); // ✅ Stable dependency
}
