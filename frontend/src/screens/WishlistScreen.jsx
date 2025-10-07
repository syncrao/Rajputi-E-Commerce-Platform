import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/outline";
import { removeFromWishlist } from "../slices/wishlistSlice";

export default function WishlistScreen() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.wishlist);

  if (!products.length) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500 text-lg">
        Your wishlist is empty.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-3 relative group hover:shadow-md transition-shadow"
          >
            <Link to={`/product/${product.id}`}>
              <img
                src={
                  product.images.find((img) => img.is_main)?.image ||
                  product.images[0]?.image
                }
                alt={product.name}
                className="w-full h-56 object-cover rounded-md mb-2"
              />
              <h2 className="text-sm font-medium text-gray-800">
                {product.name}
              </h2>
              <p className="text-xs text-gray-500">{product.category}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                ₹{product.price}
              </p>
            </Link>

            <button
              onClick={() => dispatch(removeFromWishlist(product.id))}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <HeartIcon className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
