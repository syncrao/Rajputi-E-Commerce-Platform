import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../slices/cartSlice";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function CartScreen() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const handleRemove = (item) => {
    dispatch(
      removeFromCart({
        productId: item.product.id,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      })
    );
  };

  const handleQuantityChange = (item, qty) => {
    if (qty < 1) return;
    dispatch(
      updateQuantity({
        productId: item.product.id,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        quantity: qty,
      })
    );
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = Number(item.product.price) || 0;
    const quantity = item.quantity || 1;
    return acc + price * quantity;
  }, 0);

  if (cartItems.length === 0)
    return (
      <div className="max-w-5xl h-screen mx-auto p-6 text-center text-brand-secondaryText">
        <h2 className="text-2xl font-bold mb-4 text-brand-title">
          Your Cart is Empty
        </h2>
        <Link to="/products/all" className="text-brand-primary hover:underline">
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl min-h-screen mx-auto p-6 md:pb-20">
      <h1 className="text-2xl font-bold mb-6 text-brand-title">
        Shopping Cart
      </h1>

      <div className="space-y-4">
        {cartItems.map((item, idx) => (
          <div
            key={idx}
            className="flex  sm:flex-row items-start gap-4 border border-brand-liteGray p-4 rounded-lg bg-brand-contentBg"
          >
            {/* Left - Image */}
            <img
              src={item.product.images[0]?.image}
              alt={item.product.name}
              className="w-20 object-cover rounded-md"
            />

            {/* Right - Details */}
            <div className="flex flex-col justify-between w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold w-60 text-brand-title text-lg">
                    {item.product.name}
                  </h2>
                  <p className="text-sm text-brand-secondaryText">
                    Size: {item.selectedInventory.size}
                  </p>
                  <p className="text-sm text-brand-secondaryText">
                    Color: {item.selectedInventory.color}
                  </p>
                  <p className="text-sm text-brand-subtext font-medium mt-1">
                    Price: ₹{item.product.price}
                  </p>
                </div>

                {/* Quantity Controls + Remove Button */}
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  <button
                    onClick={() =>
                      handleQuantityChange(item, (item.quantity || 1) - 1)
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-lg font-bold hover:opacity-80 transition"
                  >
                    –
                  </button>

                  <span className="min-w-[32px  text-center text-brand-title font-medium text-lg">
                    {item.quantity || 1}
                  </span>

                  <button
                    onClick={() =>
                      handleQuantityChange(item, (item.quantity || 1) + 1)
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-lg font-bold hover:opacity-80 transition"
                  >
                    +
                  </button>

                  <button
                    onClick={() => handleRemove(item)}
                    className=" px-4 py-1  text-black rounded-full text-sm font-medium hover:bg-red-700 transition"
                  >
                    <Trash2 size={30} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop total and button */}
      <div className="hidden md:flex justify-between items-center border-t border-brand-liteGray mt-8 pt-4">
        <h2 className="text-xl font-bold text-brand-title">
          Total: ₹{totalPrice}
        </h2>
        <Link
          to="/checkout"
          className="bg-brand-primary text-brand-primaryText px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Place Order
        </Link>
      </div>

      {/* Mobile fixed button */}
      <div className="fixed z-50 bottom-0 left-0 w-full bg-brand-contentBg p-4 border-t border-brand-liteGray flex justify-between items-center shadow-lg md:hidden">
        <h2 className="text-lg font-bold text-brand-title">
          Total: ₹{totalPrice}
        </h2>
        <Link
          to="/checkout"
          className="bg-brand-primary text-brand-primaryText px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Place Order
        </Link>
      </div>
    </div>
  );
}
