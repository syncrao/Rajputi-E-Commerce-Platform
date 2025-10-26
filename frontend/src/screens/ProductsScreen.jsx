import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../slices/productSlice";
import { SkeletonCard } from "../components/HomeSection";
import { addToWishlist, removeFromWishlist } from "../slices/wishlistSlice";
import {
  HeartIcon as OutlineHeart,
  HeartIcon as SolidHeart,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { ArrowLeft, Filter } from "lucide-react";
import FilterPanel from "../components/FilterPanel";

export default function ProductsScreen() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { products: wishlist } = useSelector((state) => state.wishlist);
  const { category } = useParams();
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedPrice, setSelectedPrice] = useState([0, 5000]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const filterProducts =
    category === "all"
      ? products
      : products.filter((obj) => obj.category.toLowerCase() === category);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(getProducts());
      1;
    }
  }, [dispatch, products]);

  const getDiscount = (mrp, price) => {
    if (!mrp || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const handleWishlistToggle = (product) => {
    const isInWishlist = wishlist.some((p) => p.id === product.id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist");
    }
  };

  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div className="px-4">
      <div className="flex items-center justify-between my-4">
        {/* Left Section: Back + Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-brand-secondary transition"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-brand-title" />
          </button>

          <h1 className="font-semibold text-lg text-brand-title">
            {category === "all" ? "All Products" : `All ${category}s`}
          </h1>
        </div>

        {/* Right Section: Filter Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-1 px-3 py-2 border border-brand-liteGray rounded-lg text-sm hover:bg-brand-secondary transition"
        >
          <Filter className="w-4 h-4 text-brand-title" />
          <span className="text-brand-title">Filter</span>
        </button>
      </div>

      <FilterPanel
  show={showFilter}
  onClose={() => setShowFilter(false)}
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}
  selectedPrice={selectedPrice}
  setSelectedPrice={setSelectedPrice}
  selectedSize={selectedSize}
  setSelectedSize={setSelectedSize}
  selectedColor={selectedColor}
  setSelectedColor={setSelectedColor}
/>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : filterProducts.map((product) => {
              const mainImage =
                product.images.find((img) => img.is_main)?.image ||
                product.images[0]?.image;
              const isInWishlist = wishlist.some((p) => p.id === product.id);

              return (
                <div
                  key={product.id}
                  className="relative rounded-lg transition group"
                >
                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleWishlistToggle(product)}
                    className="absolute top-2 right-2 p-1 rounded-full shadow hover:bg-gray-100\ z-1"
                  >
                    {isInWishlist ? (
                      <SolidHeart className="w-6 h-6 text-red-500" />
                    ) : (
                      <OutlineHeart className="w-6 h-6 text-white" />
                    )}
                  </button>

                  <Link
                    to={`/product/${product.id}`}
                    className="block overflow-hidden"
                  >
                    {product.mrp && product.price < product.mrp && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded z-0">
                        {getDiscount(product.mrp, product.price)}% OFF
                      </span>
                    )}
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={mainImage?.replace("http://", "https://")}
                        alt={product.name}
                        className="w-full  object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="mt-3 text-gray-700 font-medium text-sm line-clamp-2 hover:text-black">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 pb-3">
                      {product.mrp && (
                        <span className="text-gray-500 line-through text-sm">
                          ₹{product.mrp}
                        </span>
                      )}
                      <span className="text-black font-semibold">
                        ₹{product.price}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
      </div>
    </div>
  );
}
