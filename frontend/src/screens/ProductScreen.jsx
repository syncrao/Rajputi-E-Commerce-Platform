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
    getRequest(`products/inventory/${id}/`).then((res) => setInventory(res));
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
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side - Product Images */}
        <div className="space-y-4 relative">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full object-cover shadow rounded"
          />
          <button
            className="absolute top-1 right-2 p-2 rounded-full shadow hover:bg-gray-100"
            onClick={handleWishlistToggle}
          >
            {isInWishlist ? (
              <SolidHeart className="w-6 h-6 text-red-500" />
            ) : (
              <OutlineHeart className="w-6 h-6 text-gray-500" />
            )}
          </button>
          <div className="flex gap-3 mt-2">
            {product.images.map((img) => (
              <img
                key={img.id}
                src={img.image}
                alt="thumb"
                className={`w-20 h-20 object-cover rounded border cursor-pointer hover:ring-2 ${
                  selectedImage === img.image
                    ? "ring-indigo-500"
                    : "ring-transparent"
                }`}
                onClick={() => setSelectedImage(img.image)}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.mrp && (
              <span className="line-through text-gray-500">₹{product.mrp}</span>
            )}
            {product.discount_percentage > 0 && (
              <span className="text-green-600 font-semibold">
                {product.discount_percentage}% OFF
              </span>
            )}
          </div>

          <p>
            <strong>Category:</strong> {product.category}
          </p>

          {/* Variant Selection */}
          <div>
            <h3 className="font-semibold mb-1">Select Variant:</h3>
            {inventory.length === 0 && (
              <div className="flex gap-2 flex-wrap">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-20 h-8 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"
                  ></div>
                ))}
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {inventory.map((obj) => (
                <span
                  key={obj.id}
                  className={`px-3 py-1 border rounded cursor-pointer transition ${
                    selectedSize === obj.size && selectedColor === obj.color
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedSize(obj.size);
                    setSelectedColor(obj.color);
                    setSelectedInventory(obj);
                  }}
                >
                  {obj.size} - {obj.color}
                </span>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-4 w-full flex gap-3">
            <button
              className="bg-indigo-600 text-white px-6 py-3 w-full rounded-lg hover:bg-indigo-700 transition"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Ratings Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>

        {/* Ratings Summary */}
        {summary && (
          <div className="mb-4">
            <span className="text-lg font-bold">{summary.avg_rating.toFixed(1)}</span>{" "}
            <span className="text-gray-600">({summary.total_reviews} reviews)</span>
          </div>
        )}

        {/* Ratings List */}
        {loadingRatings ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        ) : ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.map((r) => (
              <div
                key={r.id}
                className="p-4 bg-gray-50 rounded-lg shadow-sm animate-fadeInUp"
              >
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, j) => (
                    <StarIcon
                      key={j}
                      className={`w-4 h-4 ${
                        j < r.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-gray-800 font-medium">{r.user}</span>
                </div>
                <p className="text-gray-600">{r.review}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet.</p>
        )}

        {/* Submit Rating */}
        {authTokens && (
          <div className="bg-white p-4 rounded-lg shadow mt-6">
            <h3 className="font-semibold mb-2">Leave a Review</h3>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <StarIcon
                  key={num}
                  className={`w-7 h-7 cursor-pointer transition ${
                    num <= userRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setUserRating(num)}
                />
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full p-2 border rounded-md mb-3 focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
            />
            <button
              onClick={handleSubmitRating}
              className={`px-5 py-2 rounded-md text-white transition ${
                submittingRating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              disabled={submittingRating}
            >
              {submittingRating ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}
      </div>

      {/* ✅ Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-sm text-center animate-scaleUp">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              🛒 Item Added to Cart!
            </h2>
            <p className="text-gray-600 mb-6">What would you like to do next?</p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔮 Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.25s ease-out forwards;
          }

          @keyframes scaleUp {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-scaleUp {
            animation: scaleUp 0.25s ease-out forwards;
          }

          .animate-shimmer {
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </div>
  );
}
