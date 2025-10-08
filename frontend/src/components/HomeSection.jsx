import { Link } from "react-router-dom";

export function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
      <div className="relative p-2 space-y-3">
        <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

export default function HomeSection({ title, items, loading }) {
  const getDiscount = (mrp, price) => Math.round(((mrp - price) / mrp) * 100);

  return (
    <div className="px-4 mb-10 lg:mb-24 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-brand-title">{title}</h2>
        <Link to="/products" className="text-brand-black font-semibold hover:underline">
          See All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : items.slice(0, 4).map((item) => (
              <Link
                to={`/product/${item.id}`}
                key={item.id}
                className="rounded-lg transition relative"
              >
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  {getDiscount(item.mrp, item.price)}% OFF
                </span>

                <img
                  src={item.images[0].image}
                  alt={item.name}
                  className="w-full h-60 object-cover hover:scale-105 lg:h-full transition-transform"
                />
                <h3 className="mt-3 text-gray-700 font-medium text-sm line-clamp-2 hover:text-black">
                  {item.name}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-gray-500 line-through text-sm">
                    ₹{item.mrp}
                  </span>
                  <span className="text-black font-semibold">
                    ₹{item.price}
                  </span>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
