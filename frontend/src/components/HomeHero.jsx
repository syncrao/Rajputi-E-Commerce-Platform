import { useEffect, useState } from "react";

export default function HomeHero() {
  const desktopImages = [
    "/assets/hero/desktop1.jpg",
    "/assets/hero/desktop2.jpg",
    "/assets/hero/desktop3.jpg",
  ];

  const mobileImages = [
    "/assets/hero/mobile1.jpg",
    "/assets/hero/mobile2.jpg",
    "/assets/hero/mobile3.jpg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % desktopImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [desktopImages.length]);

  return (
    <div className="relative w-full overflow-hidden">
      {desktopImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Slide ${index}`}
          className={`hidden sm:block w-full transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
        />
      ))}

      {mobileImages.map((img, index) => (
        <img
          key={`m-${index}`}
          src={img}
          alt={`Mobile Slide ${index}`}
          className={`block sm:hidden w-full transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
        />
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3">
        {desktopImages.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition ${
              i === current ? "bg-white" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
