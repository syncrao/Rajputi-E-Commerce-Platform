import { Link } from "react-router-dom";

export function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Shimmer effect using brand secondary shades */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary via-brand-liteGray to-brand-secondary animate-shimmer"></div>
      <div className="relative p-2 space-y-3">
        <div className="w-full h-40 bg-brand-secondary rounded-lg"></div>
        <div className="h-4 bg-brand-secondary rounded w-3/4"></div>
        <div className="h-4 bg-brand-secondary rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-4 bg-brand-secondary rounded w-12"></div>
          <div className="h-4 bg-brand-secondary rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

export default function HomeSection({ title, items, category, loading }) {
  const getDiscount = (mrp, price) => Math.round(((mrp - price) / mrp) * 100);

  return (
    <div className="px-4 mb-10 lg:mb-24 lg:px-8 bg-brand-contentBg">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-brand-title">{title}</h2>
        <Link
          to={`/products/${category}`}
          className="text-brand-primary font-semibold hover:underline"
        >
          See All
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : items.slice(0, 4).map((item) => (
              <Link
                to={`/product/${item.id}`}
                key={item.id}
                className="rounded-lg transition relative group"
              >
                {/* Discount Badge */}
                <span className="absolute top-2 left-2 bg-brand-primary text-brand-primaryText text-xs font-semibold px-2 py-1 rounded">
                  {getDiscount(item.mrp, item.price)}% OFF
                </span>

                {/* Product Image */}
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={item.images[0].image}
                    alt={item.name}
                    className="w-full h-60 object-cover group-hover:scale-105 lg:h-full transition-transform duration-300"
                  />
                </div>

                {/* Product Name */}
                <h3 className="mt-3 text-brand-secondaryText font-medium text-sm line-clamp-2 group-hover:text-brand-primary transition-colors">
                  {item.name}
                </h3>

                {/* Pricing */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-brand-liteGray line-through text-sm">
                    ₹{item.mrp}
                  </span>
                  <span className="text-brand-title font-semibold">
                    ₹{item.price}
                  </span>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
