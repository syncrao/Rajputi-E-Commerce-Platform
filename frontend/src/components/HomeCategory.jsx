import { Link } from "react-router-dom";

export default function HomeCategory() {
  const categories = [
    { name: "Dupatta", img: "/assets/hero/desktop1.jpg" },
    { name: "Poshak", img: "/assets/hero/mobile2.jpg" },
    { name: "Suit", img: "/assets/hero/mobile3.jpg" },
    { name: "Odhna", img: "/assets/hero/mobile1.jpg" },
  ];

  return (
    <div className="px-2 py-12">
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
        {categories.map((cat, i) => (
          <Link to="products/all/"  key={i} className="flex flex-col items-center rounded-lg">
            <img
              src={cat.img}
              alt={cat.name}
              className="w-16 h-16 border-2 border-gray-200 lg:w-28 lg:h-28 rounded-full object-cover"
            />
            <p className="mt-2 text-gray-800 font-medium text-lg">{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
