import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/solid";
import { removeFromWishlist } from "../slices/wishlistSlice";

export default function WishlistScreen() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.wishlist);

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-brand-liteGray text-lg">
        <p className="mb-4">Your wishlist is empty 💔</p>
        <Link
          to="/products/all"
          className="px-5 py-2 bg-brand-primary text-brand-primaryText rounded-lg hover:bg-brand-black transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-brand-contentBg">
      <h1 className="text-2xl font-semibold mb-6 text-brand-title">
        My Wishlist
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative rounded-xl overflow-hidden border border-brand-secondary hover:shadow-md transition group bg-brand-contentBg"
          >
            {/* Remove Button */}
            <button
              onClick={() => dispatch(removeFromWishlist(product.id))}
              className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition"
            >
              <HeartIcon className="w-6 h-6 text-red-500" />
            </button>

            {/* Product Image */}
            <Link to={`/product/${product.id}`}>
              <div className="overflow-hidden rounded-t-xl">
                <img
                  src={
                    product.images.find((img) => img.is_main)?.image ||
                    product.images[0]?.image
                  }
                  alt={product.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="p-3 space-y-1">
                <h2 className="text-sm font-medium text-brand-title line-clamp-2">
                  {product.name}
                </h2>
                <p className="text-xs text-brand-subtext">{product.category}</p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-brand-title font-semibold">
                    ₹{product.price}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-brand-liteGray line-through text-sm">
                      ₹{product.mrp}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
