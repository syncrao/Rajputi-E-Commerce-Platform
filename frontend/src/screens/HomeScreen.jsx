import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../slices/productSlice";

export default function HomeScreen() {
  // Desktop images from public/assets/hero
  const desktopImages = [
    "/assets/hero/desktop1.jpg",
    "/assets/hero/desktop2.jpg",
    "/assets/hero/desktop3.jpg",
  ];

  // Mobile images from public/assets/hero
  const mobileImages = [
    "/assets/hero/mobile1.jpg",
    "/assets/hero/mobile2.jpg",
    "/assets/hero/mobile3.jpg",
  ];

  const categories = [
    { name: "Dupatta", img: "/assets/hero/desktop1.jpg" },
    { name: "Poshak", img: "/assets/hero/desktop2.jpg" },
    { name: "Suit", img: "/assets/hero/desktop3.jpg" },
    { name: "Odhna", img: "/assets/hero/mobile1.jpg" },
  ];

  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % desktopImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [desktopImages.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fullscreen Slider */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Desktop Images */}
        {desktopImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className={`hidden sm:block absolute w-full object-cover transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Mobile Images */}
        {mobileImages.map((img, index) => (
          <img
            key={`m-${index}`}
            src={img}
            alt={`Mobile Slide ${index}`}
            className={`block sm:hidden absolute w-full object-cover transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Dots */}
        <div className="absolute bottom-8 inset-x-0 flex justify-center gap-3">
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

     {/* Categories */}
<div className="px-6 py-12">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
    Shop by Category
  </h2>

  {/* Mobile: horizontal scroll | Desktop: centered grid */}
  <div className="flex gap-6 overflow-x-auto sm:overflow-x-hidden sm:grid sm:grid-cols-4 sm:gap-8 justify-center px-2">
    {categories.map((cat, i) => (
      <div
        key={i}
        className="flex-shrink-0 sm:flex-shrink flex flex-col items-center bg-white p-6 rounded-lg shadow hover:shadow-lg transition w-40"
      >
        <img
          src={cat.img}
          alt={cat.name}
          className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500"
        />
        <p className="mt-4 text-gray-800 font-medium text-lg">
          {cat.name}
        </p>
      </div>
    ))}
  </div>
</div>


    </div>
  );
}
