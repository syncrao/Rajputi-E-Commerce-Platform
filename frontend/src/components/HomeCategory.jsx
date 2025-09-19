export default function HomeCategory() {
  const categories = [
    { name: "Dupatta", img: "/assets/hero/desktop1.jpg" },
    { name: "Poshak", img: "/assets/hero/desktop2.jpg" },
    { name: "Suit", img: "/assets/hero/desktop3.jpg" },
    { name: "Odhna", img: "/assets/hero/mobile1.jpg" },
  ];

  return (
    <div className="px-6 py-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
        {categories.map((cat, i) => (
          <div key={i} className="flex flex-col items-center p-6 rounded-lg">
            <img
              src={cat.img}
              alt={cat.name}
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-200"
            />
            <p className="mt-4 text-gray-800 font-medium text-lg">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
