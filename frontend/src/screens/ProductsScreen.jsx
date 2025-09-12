import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProducts } from "../slices/productSlice";

export default function ProductsScreen() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, products]);

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const mainImage = product.images.find((img) => img.is_main)?.image || product.images[0]?.image;

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
            >
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="p-3">
                <h2 className="text-sm font-medium line-clamp-2">{product.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-semibold text-gray-900">₹{product.price}</span>
                  {product.mrp && (
                    <span className="line-through text-gray-500 text-sm">₹{product.mrp}</span>
                  )}
                  {product.discount_percentage > 0 && (
                    <span className="text-green-600 text-sm font-semibold">
                      {product.discount_percentage}% OFF
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
