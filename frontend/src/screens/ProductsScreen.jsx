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

  const getDiscount = (mrp, price) => {
    if (!mrp || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {products.map((product) => {
          const mainImage =
            product.images.find((img) => img.is_main)?.image ||
            product.images[0]?.image;

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="rounded-lg transition relative group bg-white shadow-sm "
            >
              {/* Discount Badge */}
              {product.mrp && product.price < product.mrp && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  {getDiscount(product.mrp, product.price)}% OFF
                </span>
              )}

              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-60 object-cover group-hover:scale-105 transition-transform"
              />
              <h3 className="mt-3 text-gray-700 font-medium text-sm line-clamp-2 px-2 hover:text-black">
                {product.name}
              </h3>
              <div className="mt-2 flex items-center gap-2 px-2 pb-3">
                {product.mrp && (
                  <span className="text-gray-500 line-through text-sm">
                    ₹{product.mrp}
                  </span>
                )}
                <span className="text-black font-semibold">₹{product.price}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
