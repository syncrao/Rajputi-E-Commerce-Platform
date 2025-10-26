import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      <div className="max-w-5xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/products/all" className="text-indigo-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between border p-4 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.product.images[0]?.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h2 className="font-semibold">{item.product.name}</h2>
                <p>Size: {item.selectedInventory.size}</p>
                <p>Color: {item.selectedInventory.color}</p>
                <p>Price: ₹{item.product.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={item.quantity || 1}
                min="1"
                className="w-16 border rounded text-center"
                onChange={(e) =>
                  handleQuantityChange(item, parseInt(e.target.value))
                }
              />
              <button
                onClick={() => handleRemove(item)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed z-50 bottom-0 left-0 w-full bg-white p-4 border-t flex justify-between items-center shadow-lg">
        <h2 className="text-xl font-bold">Total: ₹{totalPrice}</h2>
        <Link
          to="/checkout"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Place Order
        </Link>
      </div>
    </div>
  );
}
