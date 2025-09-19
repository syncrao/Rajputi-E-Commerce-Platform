export default function HomeCategory() {
  const categories = [
    { name: "Dupatta", img: "/assets/hero/desktop1.jpg" },
    { name: "Poshak", img: "/assets/hero/mobile2.jpg" },
    { name: "Suit", img: "/assets/hero/mobile3.jpg" },
    { name: "Odhna", img: "/assets/hero/mobile1.jpg" },
  ];

  return (
    <div className="px-6 py-12">
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
        {categories.map((cat, i) => (
          <div key={i} className="flex flex-col items-center rounded-lg">
            <img
              src={cat.img}
              alt={cat.name}
              className="w-20 h-20 lg:w-28 lg:h-28 rounded-full object-cover"
            />
            <p className="mt-4 text-gray-800 font-medium text-lg">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
