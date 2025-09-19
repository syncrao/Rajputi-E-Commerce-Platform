import { Link } from "react-router-dom"

export default function HomeSection ({ title, items }) {
    
  const getDiscount = (mrp, price) => Math.round(((mrp - price) / mrp) * 100)

    return (
    <div className="px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <Link to="/products" className="text-indigo-600 hover:underline">See All</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link 
            to={`/product/${item.id}`}
            key={item.id}
            className="rounded-lg transition  relative"
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
)};
