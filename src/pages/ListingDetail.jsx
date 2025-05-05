import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthProvider"; // Assuming you're using Auth context
// import { useHeroParallax } from "../hooks/useHeroParallax.js";
import { useScrollAnimation } from "../hooks/useScrollAnimation.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const VITE_IMAGE_BASE_URL =
  import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:4000";

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth(); // Access the current user from the auth context
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImageClass, setHeroImageClass] = useState(""); // Add the class state for the hero image transition
  const [modalDirection, setModalDirection] = useState(null); // For modal swipe animation direction
  const [heroSwipeClass, setHeroSwipeClass] = useState(""); // For hero swipe animation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  // useHeroParallax(); // Custom hook for parallax effect
  useScrollAnimation({
    infoContentId: "infoContent",
    heroSectionId: "heroSection",
  }); // Custom hook for scroll animation

  // Parallax effect for hero image
  useEffect(() => {
    const heroImage = document.getElementById("heroImage");
    if (!heroImage) return;

    const isMobile = window.innerWidth < 768;
    const parallaxSpeed = isMobile ? 0.1 : 0.25;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      heroImage.style.transform = `translateY(${scrollTop * parallaxSpeed}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchListing() {
      try {
        // Fetch listing data from the API
        const response = await fetch(`${API_URL}/listings/${id}`, {
          headers: {
            "Cache-Control": "no-cache", // Disable caching to force fresh response
          },
        });

        // Ensure response is okay and content type is JSON
        if (
          response.ok &&
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await response.json();
          setListing(data);

          // Check if the listing is favorited by the current user
          if (user) {
            const res = await fetch(`${API_URL}/users/${user._id}/favorites`);
            const favorites = await res.json();

            // Log favorites to check if we are receiving the correct data
            console.log("User Favorites:", favorites);

            // Set the favorite status based on the user's favorites
            const isFavorite = favorites.some((fav) => fav._id === id);
            setIsFavorited(isFavorite);
          }
        } else {
          setError("Failed to load listing data.");
          console.error("Unexpected response format:", response);
        }
      } catch (err) {
        setError("Failed to fetch listing.");
        console.error("Fetch error:", err);
      }
    }

    fetchListing();
  }, [id, user]); // Depend on `id` and `user` to re-fetch if they change

  const handleFavoriteClick = async () => {
    if (!user) {
      alert("You must be logged in to add or remove favorites");
      return;
    }

    try {
      let updatedFavorites;
      if (isFavorited) {
        updatedFavorites = await removeFavorite(user._id, id);
      } else {
        updatedFavorites = await addFavorite(user._id, id);
      }

      // Update the favorite state based on the response
      setIsFavorited(updatedFavorites.includes(id));
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  // Navigate to next image with crossfade and swipe animation
  const handleNextImage = () => {
    if (listing?.images?.length > 1) {
      setHeroImageClass("opacity-0");
      setHeroSwipeClass("animate-slide-left");
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1
        );
        setHeroImageClass("opacity-100");
        setTimeout(() => setHeroSwipeClass(""), 500);
      }, 100);
    }
  };

  // Navigate to previous image with crossfade and swipe animation
  const handlePreviousImage = () => {
    if (listing?.images?.length > 1) {
      setHeroImageClass("opacity-0");
      setHeroSwipeClass("animate-slide-right");
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1
        );
        setHeroImageClass("opacity-100");
        setTimeout(() => setHeroSwipeClass(""), 500);
      }, 100);
    }
  };

  useEffect(() => {
    if (!isModalOpen) return;

    let startX = 0;
    let animFrame;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(() => {
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        if (Math.abs(diffX) > 50) {
          const direction = diffX > 0 ? "left" : "right";
          setModalDirection(direction);
          setTimeout(() => {
            setCurrentImageIndex((prev) => {
              if (direction === "left") {
                return prev === listing.images.length - 1 ? 0 : prev + 1;
              } else {
                return prev === 0 ? listing.images.length - 1 : prev - 1;
              }
            });
            setModalDirection(null);
          }, 250); // Delay until animation completes
        }
      });
    };

    const modal = document.getElementById("imageModal");
    modal?.addEventListener("touchstart", handleTouchStart);
    modal?.addEventListener("touchend", handleTouchEnd);

    return () => {
      modal?.removeEventListener("touchstart", handleTouchStart);
      modal?.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animFrame);
    };
  }, [isModalOpen, listing]);

  // Add swipe support to main hero image (not just modal)
  useEffect(() => {
    if (isModalOpen) return;

    const hero = document.getElementById("heroImage");
    if (!hero) return;

    let startX = 0;
    let animFrame;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(() => {
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        if (Math.abs(diffX) > 50) {
          diffX > 0 ? handleNextImage() : handlePreviousImage();
        }
      });
    };

    hero.addEventListener("touchstart", handleTouchStart);
    hero.addEventListener("touchend", handleTouchEnd);

    return () => {
      hero.removeEventListener("touchstart", handleTouchStart);
      hero.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animFrame);
    };
  }, [listing, isModalOpen]);

  // Disable scroll/touchmove on body when modal is open, re-enable on cleanup
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isModalOpen]);

  // Autoplay: pause when hovering hero or modal open
  useEffect(() => {
    if (isHoveringHero || isModalOpen) return;

    const interval = setInterval(() => {
      handleNextImage();
    }, 10000);

    return () => clearInterval(interval);
  }, [listing, isHoveringHero, isModalOpen]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Image with Manual Navigation */}
      <div
        id="heroSection"
        className={`relative h-[77vh] overflow-hidden group`}
      >
        <div className="relative w-full h-full overflow-hidden group pointer-events-auto">
          <div
            className="w-full h-full"
            style={{ width: "100%", height: "100%" }}
            onClick={() => setIsModalOpen(true)}
            onMouseMove={(e) => {
              const magnifier = document.getElementById("magnifier");
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;

              const bgPosX = (x / rect.width) * 100;
              const bgPosY = (y / rect.height) * 100;

              if (magnifier) {
                magnifier.style.left = `${x - 125}px`;
                magnifier.style.top = `${y - 125}px`;
                magnifier.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
              }
            }}
            onMouseEnter={() => {
              setIsHoveringHero(true);
              const magnifier = document.getElementById("magnifier");
              if (magnifier) magnifier.style.display = "block";
            }}
            onMouseLeave={() => {
              setIsHoveringHero(false);
              const magnifier = document.getElementById("magnifier");
              if (magnifier) magnifier.style.display = "none";
            }}
          >
            <img
              id="heroImage"
              src={`/assets/${listing.images[currentImageIndex].replace(
                /^\/+/,
                ""
              )}`}
              alt="Listing"
              loading="lazy"
              className={`w-full h-full object-cover pointer-events-none transition-opacity duration-700 ease-in-out ${
                heroImageClass || "opacity-100"
              } ${heroSwipeClass}`}
            />
            <div
              id="magnifier"
              className="hidden absolute w-[250px] h-[250px] border-[0.5px] border-teal-700/70 rounded-lg pointer-events-none z-30"
              style={{
                backgroundImage: `url(/assets/${listing.images[
                  currentImageIndex
                ].replace(/^\/+/, "")})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "1000% 1000%",
                display: "none",
              }}
            ></div>
          </div>
          {/* Swipe hint arrows for mobile */}
          {listing.images?.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6 sm:hidden pointer-events-none z-50">
              <div className="text-white text-xl opacity-50 animate-bounce-left">
                ←
              </div>
              <div className="text-white text-xl opacity-50 animate-bounce-right">
                →
              </div>
            </div>
          )}
        </div>
        {/* Buttons for navigation */}
        {listing.images?.length > 1 && (
          <div
            id="heroButton"
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-8 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          >
            <button
              onClick={handlePreviousImage}
              className="bg-white bg-opacity-50 p-2 rounded-full z-50 pointer-events-auto transform transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-opacity-70"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden text-lg">←</span>
            </button>
            <button
              onClick={handleNextImage}
              className="bg-white bg-opacity-50 p-2 rounded-full z-50 pointer-events-auto transform transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-opacity-70"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden text-lg">→</span>
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail Carousel */}
      {listing.images?.length > 1 && (
        <div className="flex justify-center items-center gap-3 p-4 bg-white border-b border-gray-200">
          {listing.images.map((img, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentImageIndex(index);
              }}
              className={`w-20 h-16 rounded overflow-hidden border transform transition-transform duration-300 ${
                currentImageIndex === index
                  ? "border-blue-500"
                  : "border-transparent opacity-70 hover:opacity-100"
              } hover:scale-105`}
            >
              <img
                src={`/assets/${img.replace(/^\/+/, "")}`}
                alt={`Thumbnail ${index + 1}`}
                loading="lazy"
                className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-110"
              />
            </button>
          ))}
        </div>
      )}

      {/* Property Details */}
      <div
        id="infoContent"
        className="flex flex-col items-center p-8 space-y-8 mt-2 bg-gray-50"
      >
        <div className="w-full max-w-5xl text-center">
          <h1 className="text-4xl font-bold text-gray-900">{listing.title}</h1>
          <p className="text-lg text-gray-500 mt-1">{listing.location}</p>
          <p className="text-2xl font-semibold text-blue-600 mt-2">
            {listing.price && !isNaN(Number(listing.price))
              ? `$${Number(listing.price).toLocaleString()}`
              : "Price not available"}
          </p>
        </div>

        <p className="max-w-3xl text-gray-700 text-center leading-relaxed">
          {listing.description}
        </p>

        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
          {/* Overview */}
          <div className="space-y-3">
            <h4 className="text-xl font-semibold text-gray-800 border-b pb-1">
              Overview
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                <strong>Bedrooms:</strong> {listing.bedrooms ?? "N/A"}
              </li>
              <li>
                <strong>Bathrooms:</strong> {listing.bathrooms ?? "N/A"}
              </li>
              <li>
                <strong>Area:</strong> {listing.squareFootage ?? "N/A"} sq ft
              </li>
              <li>
                <strong>Year Built:</strong> {listing.yearBuilt ?? "N/A"}
              </li>
              <li>
                <strong>Property Type:</strong> {listing.propertyType ?? "N/A"}
              </li>
              <li>
                <strong>Listing Type:</strong> {listing.listingType ?? "N/A"}
              </li>
              <li>
                <strong>Available From:</strong>{" "}
                {listing.availableFrom
                  ? new Date(listing.availableFrom).toLocaleDateString()
                  : "N/A"}
              </li>
            </ul>
          </div>

          {/* Features & Amenities */}
          <div className="space-y-6">
            {/* Features */}
            <div>
              <h4 className="text-xl font-semibold text-gray-800 border-b pb-1">
                Features
              </h4>
              {listing.features?.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {listing.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No special features listed.
                </p>
              )}
            </div>

            {/* Amenities */}
            <div>
              <h4 className="text-xl font-semibold text-gray-800 border-b pb-1">
                Amenities
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {listing.parkingAvailable && (
                  <li>Parking: {listing.parkingAvailable}</li>
                )}
                {listing.amenities?.length > 0 ? (
                  listing.amenities.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))
                ) : (
                  <li className="text-gray-500">No additional amenities.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Favorite Button */}
        <Button
          onClick={handleFavoriteClick}
          size="lg"
          variant={isFavorited ? "primaryLight" : "cta"}
        >
          {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        </Button>

        {/* Contact Agent Button */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => alert("Contacting the agent...")}
            size="lg"
            variant="primaryLight"
          >
            Contact Agent
          </Button>
        </div>
      </div>
      {isModalOpen && (
        <div
          id="imageModal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={`/assets/${listing.images[currentImageIndex].replace(
              /^\/+/,
              ""
            )}`}
            alt="Full preview"
            loading="lazy"
            className={`max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out ${
              modalDirection === "left"
                ? "animate-slide-out-left"
                : modalDirection === "right"
                ? "animate-slide-out-right"
                : ""
            }`}
          />
          {/* Swipe hint arrows for modal preview (mobile only) */}
          {listing.images?.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6 sm:hidden pointer-events-none z-50">
              <div className="text-white text-xl opacity-50 animate-bounce-left">
                ←
              </div>
              <div className="text-white text-xl opacity-50 animate-bounce-right">
                →
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Separate functions for add and remove favorite actions (assuming you have them in api.js)
async function addFavorite(userId, listingId) {
  const res = await fetch(`${API_URL}/users/addFavorite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      listingId,
    }),
  });

  if (res.ok) {
    return await res.json();
  }
  throw new Error("Failed to add to favorites");
}

async function removeFavorite(userId, listingId) {
  const res = await fetch(`${API_URL}/users/removeFavorite`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      listingId,
    }),
  });

  if (res.ok) {
    return await res.json();
  }
  throw new Error("Failed to remove from favorites");
}
