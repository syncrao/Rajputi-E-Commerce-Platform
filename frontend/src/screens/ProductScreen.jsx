import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../slices/productSlice";
import { addToCart } from "../slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../slices/wishlistSlice";
import { getRequest, postRequest } from "../utils/request";
import toast from "react-hot-toast";
import {
  HeartIcon as OutlineHeart,
  HeartIcon as SolidHeart,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

export default function ProductScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singleProduct, loading, error, products } = useSelector(
    (state) => state.products
  );
  const { products: wishlist } = useSelector((state) => state.wishlist);
  const { authTokens } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [inventory, setInventory] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  // ⭐ Ratings
  const [ratings, setRatings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [submittingRating, setSubmittingRating] = useState(false);

  const isInWishlist = wishlist.some((p) => p.id === parseInt(id, 10));

  // Fetch products if not in store
  useEffect(() => {
    const existingProduct = products.find((p) => p.id === parseInt(id, 10));
    if (!existingProduct) dispatch(getProducts());
  }, [dispatch, id, products]);

  const product =
    products.find((p) => p.id === parseInt(id, 10)) || singleProduct;

  // Set main image
  useEffect(() => {
    if (product) {
      const mainImg =
        product.images.find((img) => img.is_main)?.image ||
        product.images[0]?.image;
      setSelectedImage(mainImg);
    }
  }, [product]);

  // Fetch inventory
  useEffect(() => {
  getRequest(`products/inventory/${id}/`).then((res) => {
    setInventory(res);

    // ✅ Auto-select first available (in-stock) variant
    const firstAvailable = res.find((item) => item.quantity > 0);
    if (firstAvailable) {
      setSelectedSize(firstAvailable.size);
      setSelectedColor(firstAvailable.color);
      setSelectedInventory(firstAvailable);
    }
  });
}, [id]);

  // Fetch ratings
  useEffect(() => {
    const fetchRatings = async () => {
      setLoadingRatings(true);
      try {
        const [ratingList, summaryData] = await Promise.all([
          getRequest(`products/ratings/${id}/`, authTokens?.access),
          getRequest(`products/ratings/summary/${id}/`, authTokens?.access),
        ]);
        setRatings(ratingList);
        setSummary(summaryData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRatings(false);
      }
    };
    fetchRatings();
  }, [id, authTokens]);

  // Add to cart
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }
    dispatch(addToCart({ product, selectedInventory }));
    setShowPopup(true);
  };

  // Wishlist toggle
  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist");
    }
  };

  // Submit rating
  const handleSubmitRating = async () => {
    if (!userRating) return toast.error("Please select a rating");
    setSubmittingRating(true);
    try {
      await postRequest(
        `products/ratings/${id}/`,
        { rating: userRating, review: comment },
        authTokens?.access
      );
      toast.success("Thank you for your review!");
      setUserRating(0);
      setComment("");
      // Refresh ratings
      const newRatings = await getRequest(
        `products/ratings/${id}/`,
        authTokens?.access
      );
      setRatings(newRatings);
      const summaryData = await getRequest(
        `products/ratings/summary/${id}/`,
        authTokens?.access
      );
      setSummary(summaryData);
    } catch (err) {
      toast.error("Error submitting rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading && !product)
    return <p className="text-center py-10">Loading product...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!product) return <p className="text-center py-10">Product not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-brand-contentBg text-brand-secondaryText">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side - Product Images */}
        <div className="space-y-4 relative">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full object-cover shadow rounded-lg border border-brand-secondary"
          />
          <button
            className="absolute top-2 right-3 p-2 rounded-full shadow-md hover:bg-brand-secondary transition"
            onClick={handleWishlistToggle}
          >
            {isInWishlist ? (
              <SolidHeart className="w-6 h-6 text-red-500" />
            ) : (
              <OutlineHeart className="w-6 h-6 text-brand-liteGray" />
            )}
          </button>

          <div className="flex gap-3 mt-2">
            {product.images.map((img) => (
              <img
                key={img.id}
                src={img.image}
                alt="thumb"
                className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition ${
                  selectedImage === img.image
                    ? "ring-2 ring-brand-black"
                    : "hover:ring-1 hover:ring-brand-liteGray"
                }`}
                onClick={() => setSelectedImage(img.image)}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-brand-title">
            {product.name}
          </h1>
          <p className="text-brand-subtext leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-brand-black">
              ₹{product.price}
            </span>
            {product.mrp && (
              <span className="line-through text-brand-liteGray">
                ₹{product.mrp}
              </span>
            )}
            {product.discount_percentage > 0 && (
              <span className="text-green-600 font-semibold">
                {product.discount_percentage}% OFF
              </span>
            )}
          </div>

          <p>
            <strong className="text-brand-title">Category:</strong>{" "}
            {product.category}
          </p>

          {/* Variant Selection */}
          <div>
            <h3 className="font-semibold mb-1 text-brand-title">
              Select Variant:
            </h3>
            {inventory.length === 0 && (
              <div className="flex gap-2 flex-wrap">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-20 h-8 rounded bg-gradient-to-r from-brand-secondary via-brand-liteGray to-brand-secondary animate-shimmer"
                  ></div>
                ))}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              {inventory.map((obj) => {
                const isSelected =
                  selectedSize === obj.size && selectedColor === obj.color;
                const isOutOfStock = obj.quantity === 0;

                return (
                  <span
                    key={obj.id}
                    className={`px-3 py-1 border rounded cursor-pointer transition 
        ${isSelected ? "bg-brand-primary text-brand-primaryText" : ""}
        ${
          !isSelected && !isOutOfStock
            ? "hover:bg-brand-secondary hover:text-brand-black border-brand-liteGray"
            : ""
        }
        ${
          isOutOfStock
            ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
            : ""
        }
      `}
                    onClick={() => {
                      if (!isOutOfStock) {
                        setSelectedSize(obj.size);
                        setSelectedColor(obj.color);
                        setSelectedInventory(obj);
                      }
                    }}
                  >
                    {obj.size} - {obj.color} {isOutOfStock && "(Out of Stock)"}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Add to Cart Button */}
          {/* Add to Cart / Out of Stock Button */}
<div className="mt-4 w-full flex gap-3">
  {inventory.length > 0 && inventory.every((obj) => obj.quantity === 0) ? (
    <button
      disabled
      className="bg-gray-300 text-gray-600 px-6 py-3 w-full rounded-lg cursor-not-allowed"
    >
      Out of Stock
    </button>
  ) : (
    <button
      onClick={handleAddToCart}
      disabled={!selectedSize || !selectedColor}
      className={`px-6 py-3 w-full rounded-lg transition ${
        !selectedSize || !selectedColor
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-brand-primary text-brand-primaryText hover:bg-brand-black"
      }`}
    >
      Add to Cart
    </button>
  )}
</div>

        </div>
      </div>

      {/* Ratings Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-brand-title">Reviews</h2>

        {/* Ratings Summary */}
        {summary && (
          <div className="mb-4 text-brand-subtext">
            <span className="text-lg font-bold text-brand-black">
              {summary.avg_rating.toFixed(1)}
            </span>{" "}
            <span>({summary.total_reviews} reviews)</span>
          </div>
        )}

        {/* Ratings List */}
        {loadingRatings ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-brand-secondary rounded animate-pulse"
              />
            ))}
          </div>
        ) : ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.map((r) => (
              <div
                key={r.id}
                className="p-4 bg-brand-secondary rounded-lg shadow-sm animate-fadeInUp"
              >
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, j) => (
                    <StarIcon
                      key={j}
                      className={`w-4 h-4 ${
                        j < r.rating ? "text-yellow-400" : "text-brand-liteGray"
                      }`}
                    />
                  ))}
                  <span className="text-brand-title font-medium">{r.user}</span>
                </div>
                <p className="text-brand-subtext">{r.review}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-subtext">No reviews yet.</p>
        )}

        {/* Submit Rating */}
        {authTokens && (
          <div className="bg-brand-secondary p-4 rounded-lg shadow mt-6">
            <h3 className="font-semibold mb-2 text-brand-title">
              Leave a Review
            </h3>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <StarIcon
                  key={num}
                  className={`w-7 h-7 cursor-pointer transition ${
                    num <= userRating
                      ? "text-yellow-400"
                      : "text-brand-liteGray"
                  }`}
                  onClick={() => setUserRating(num)}
                />
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full p-2 border border-brand-liteGray rounded-md mb-3 focus:ring-brand-primary focus:border-brand-primary"
              rows="3"
            />
            <button
              onClick={handleSubmitRating}
              className={`px-5 py-2 rounded-md text-brand-primaryText transition ${
                submittingRating
                  ? "bg-brand-liteGray cursor-not-allowed"
                  : "bg-brand-primary hover:bg-brand-black"
              }`}
              disabled={submittingRating}
            >
              {submittingRating ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-brand-contentBg p-6 rounded-2xl shadow-xl w-[90%] max-w-sm text-center animate-scaleUp">
            <h2 className="text-lg font-semibold text-brand-title mb-3">
              🛒 Item Added to Cart!
            </h2>
            <p className="text-brand-subtext mb-6">
              What would you like to do next?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-lg border border-brand-liteGray text-brand-secondaryText hover:bg-brand-secondary transition"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="px-4 py-2 rounded-lg bg-brand-primary text-brand-primaryText hover:bg-brand-black transition"
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations (unchanged) */}
      <style>{/* same as your existing animation styles */}</style>
    </div>
  );
}
