import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProducts } from "../slices/productSlice";
import { addToCart } from "../slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../slices/wishlistSlice";
import { getRequest } from "../utils/request";
import toast from "react-hot-toast";
import { HeartIcon as OutlineHeart, HeartIcon as SolidHeart } from "@heroicons/react/24/outline";

export default function ProductScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleProduct, loading, error, products } = useSelector(
    (state) => state.products
  );
  const { products: wishlist } = useSelector((state) => state.wishlist);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [inventory, setInventory] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState({});

  const isInWishlist = wishlist.some((p) => p.id === parseInt(id, 10));

  useEffect(() => {
    const existingProduct = products.find((p) => p.id === parseInt(id, 10));
    if (!existingProduct) dispatch(getProducts());
  }, [dispatch, id, products]);

  const product =
    products.find((p) => p.id === parseInt(id, 10)) || singleProduct;

  useEffect(() => {
    if (product) {
      const mainImg =
        product.images.find((img) => img.is_main)?.image ||
        product.images[0]?.image;
      setSelectedImage(mainImg);
    }
  }, [product]);

  useEffect(() => {
    getRequest(`products/inventory/${id}/`).then((res) => setInventory(res));
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return alert("Select size and color");
    dispatch(addToCart({ product, selectedInventory }));
    toast.success("Added to cart");
  };

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

  if (loading && !product)
    return <p className="text-center py-10">Loading product...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!product) return <p className="text-center py-10">Product not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4 relative">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full object-cover shadow rounded"
          />
          <button
            className="absolute top-2 right-2 p-2 rounded-full bg-white shadow hover:bg-gray-100"
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

        {/* Product Details */}
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

          <div>
            <h3 className="font-semibold mb-1">Select Variant:</h3>
            <div className="flex gap-2 flex-wrap">
              {inventory.map((obj) => (
                <span
                  key={obj.id}
                  className={`px-3 py-1 border rounded cursor-pointer ${
                    selectedSize === obj.size && selectedColor === obj.color
                      ? "bg-indigo-600 text-white"
                      : ""
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

          {/* Add to Cart */}
          <div className="mt-4 flex gap-3">
            <button
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
