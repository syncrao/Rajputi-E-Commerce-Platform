import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProducts } from "../slices/productSlice";

export default function ProductScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleProduct, loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    // Prefetch optimization: if product already in products list, use it
    const existingProduct = products.find((p) => p.id === parseInt(id, 10));
    if (existingProduct) return;

    dispatch(getProducts());
  }, [dispatch, id, products]);

  const product =
    products.find((p) => p.id === parseInt(id, 10)) || singleProduct;

  if (loading && !product) return <p className="text-center py-10">Loading product...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!product) return <p className="text-center py-10">Product not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <img
            src={product.images.find((img) => img.is_main)?.image || product.images[0]?.image}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-lg shadow"
          />
          <div className="flex gap-3">
            {product.images.map((img) => (
              <img
                key={img.id}
                src={img.image}
                alt="thumb"
                className="w-20 h-20 object-cover rounded border hover:ring-2 hover:ring-indigo-500 cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
            {product.mrp && (
              <span className="line-through text-gray-500">₹{product.mrp}</span>
            )}
            {product.discount_percentage > 0 && (
              <span className="text-green-600 font-semibold">
                {product.discount_percentage}% OFF
              </span>
            )}
          </div>

          <p className="mb-2"><strong>Category:</strong> {product.category}</p>
          <p className="mb-2"><strong>Fabric:</strong> {product.fabric}</p>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Available Sizes:</h3>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="border px-3 py-1 rounded cursor-pointer hover:bg-gray-100"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
