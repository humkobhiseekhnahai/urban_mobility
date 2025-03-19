import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollDownButton() {
  const [isVisible, setIsVisible] = useState(true);

  // Hide button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 0.5,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollDown}
      className={`fixed left-1/2 bottom-16 z-50 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 md:hidden animate-bounce hover:animate-none bg-white text-black ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-label="Scroll down"
    >
      <ChevronDown className="h-5 w-5" />
    </button>
  );
}
