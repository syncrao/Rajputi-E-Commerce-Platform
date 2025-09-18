import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../slices/productSlice";

export default function HomeScreen() {
  // Hero Images
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

  const categories = [
    { name: "Dupatta", img: "/assets/hero/desktop1.jpg" },
    { name: "Poshak", img: "/assets/hero/desktop2.jpg" },
    { name: "Suit", img: "/assets/hero/desktop3.jpg" },
    { name: "Odhna", img: "/assets/hero/mobile1.jpg" },
  ];

  // Mock Data (4 products per section)
  const latestSuits = [
    {
      id: 1,
      name: "Elegant Floral Print Cotton Suit Set",
      img: "/assets/hero/desktop1.jpg",
      mrp: 2499,
      price: 1699,
    },
    {
      id: 2,
      name: "Designer Embroidered Silk Suit Collection",
      img: "/assets/hero/desktop2.jpg",
      mrp: 3999,
      price: 2899,
    },
    {
      id: 3,
      name: "Casual Daily Wear Cotton Suit Combo",
      img: "/assets/hero/desktop3.jpg",
      mrp: 1999,
      price: 1399,
    },
    {
      id: 4,
      name: "Festive Special Zari Work Anarkali Suit",
      img: "/assets/hero/mobile1.jpg",
      mrp: 4499,
      price: 3199,
    },
  ];

  const latestOdhna = [
    {
      id: 1,
      name: "Traditional Red Zari Work Odhna",
      img: "/assets/hero/mobile1.jpg",
      mrp: 1499,
      price: 999,
    },
    {
      id: 2,
      name: "Royal Blue Handcrafted Velvet Odhna",
      img: "/assets/hero/mobile2.jpg",
      mrp: 1999,
      price: 1399,
    },
    {
      id: 3,
      name: "Elegant Green Banarasi Silk Odhna",
      img: "/assets/hero/mobile3.jpg",
      mrp: 2499,
      price: 1799,
    },
    {
      id: 4,
      name: "Classic Black Georgette Embellished Odhna",
      img: "/assets/hero/desktop1.jpg",
      mrp: 1899,
      price: 1299,
    },
  ];

  const latestDupatta = [
    {
      id: 1,
      name: "Chiffon Dupatta with Golden Border",
      img: "/assets/hero/desktop3.jpg",
      mrp: 899,
      price: 599,
    },
    {
      id: 2,
      name: "Soft Cotton Block Print Dupatta",
      img: "/assets/hero/mobile3.jpg",
      mrp: 1099,
      price: 749,
    },
    {
      id: 3,
      name: "Designer Net Dupatta with Stone Work",
      img: "/assets/hero/desktop2.jpg",
      mrp: 1599,
      price: 1099,
    },
    {
      id: 4,
      name: "Silk Dupatta with Embroidery Pattern",
      img: "/assets/hero/mobile2.jpg",
      mrp: 1399,
      price: 999,
    },
  ];

  const latestPoshak = [
    {
      id: 1,
      name: "Bridal Heavy Embroidery Silk Poshak",
      img: "/assets/hero/desktop2.jpg",
      mrp: 9999,
      price: 7499,
    },
    {
      id: 2,
      name: "Rajasthani Traditional Handloom Poshak",
      img: "/assets/hero/desktop3.jpg",
      mrp: 7999,
      price: 5599,
    },
    {
      id: 3,
      name: "Festive Royal Zari Work Poshak Set",
      img: "/assets/hero/mobile3.jpg",
      mrp: 8999,
      price: 6399,
    },
    {
      id: 4,
      name: "Classic Velvet Bridal Ceremony Poshak",
      img: "/assets/hero/mobile1.jpg",
      mrp: 11999,
      price: 8799,
    },
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

  // Helper to calculate discount %
  const getDiscount = (mrp, price) =>
    Math.round(((mrp - price) / mrp) * 100);

  // Section Component
  const Section = ({ title, items }) => (
    <div className="px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <button className="text-indigo-600 hover:underline">See All</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg hover:shadow-md transition  relative"
          >
            {/* Discount Badge */}
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              {getDiscount(item.mrp, item.price)}% OFF
            </span>

            <img
              src={item.img}
              alt={item.name}
              className="w-full h-60 object-cover "
            />
            <h3 className="mt-3 text-gray-800 font-medium text-sm line-clamp-2">
              {item.name}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-gray-500 line-through text-sm">
                ₹{item.mrp}
              </span>
              <span className="text-indigo-600 font-semibold">
                ₹{item.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fullscreen Slider */}
      <div className="relative w-full h-screen overflow-hidden">
        {desktopImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className={`hidden sm:block absolute w-full h-full object-cover transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {mobileImages.map((img, index) => (
          <img
            key={`m-${index}`}
            src={img}
            alt={`Mobile Slide ${index}`}
            className={`block sm:hidden absolute w-full h-full object-cover transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-white p-6 rounded-lg"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-200"
              />
              <p className="mt-4 text-gray-800 font-medium text-lg">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Sections */}
      <Section title="Latest Suits" items={latestSuits} />
      <Section title="Latest Odhna" items={latestOdhna} />
      <Section title="Latest Dupatta" items={latestDupatta} />
      <Section title="Latest Poshak" items={latestPoshak} />
    </div>
  );
}
