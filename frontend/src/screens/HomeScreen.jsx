import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../slices/productSlice"

export default function HomeScreen() {
  const images = [
    "https://saundaryamfashions.com/cdn/shop/files/1_e790972e-684b-4e99-8502-9b2c448061b7.jpg?v=1702719698&width=600",
    "https://www.royalranisa.com/wp-content/uploads/2018/10/ASP_2583.jpg",
    "https://www.royalranisa.com/wp-content/uploads/2018/10/ASP_2239.jpg",
  ];

  const categories = [
    { name: "Dupatta", img: "https://www.royalranisa.com/wp-content/uploads/2018/10/ASP_2239.jpg" },
    { name: "Poshak", img: "https://www.royalranisa.com/wp-content/uploads/2018/10/ASP_2583.jpg" },
    { name: "Suit", img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS-0vlMTsAtY81AOUmBRhX7YDQ0Alboy6x4QKrXimyR_txRTPn0FZh9OGWu2cSBUWvh0TXK7IJv9sGa4G2YOR3yVyAdV0t_bc0h4SaDIcgqR9LIY11RXD8e" },
    { name: "Odhna", img: "https://www.royalranisa.com/wp-content/uploads/2018/10/ASP_2239.jpg" },
  ];

  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch()
  const {products, loading, error} = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);


  }, [images.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fullscreen Slider */}
      <div className="relative w-full h-screen overflow-hidden">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-4 h-4 rounded-full ${
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
              className="flex flex-col items-center bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500"
              />
              <p className="mt-4 text-gray-800 font-medium text-lg">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
