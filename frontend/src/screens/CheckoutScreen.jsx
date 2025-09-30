import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { postRequest, getRequest } from "../utils/request";

export default function CheckoutScreen() {
  const navigate = useNavigate();
  const { authTokens, userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [selectedAddress, setSelectedAddress] = useState(null);

  // Load selected address from localStorage or fetch default
  useEffect(() => {
    if (!authTokens) {
      navigate("/login");
      return;
    }

    const savedAddress = localStorage.getItem(`selected_address_user_${userInfo?.id}`);
    if (savedAddress) {
      setSelectedAddress(JSON.parse(savedAddress));
    } else {
      // If no address in localStorage, fetch addresses and select default
      getRequest("orders/addresses/", authTokens.access).then((res) => {
        const defaultAddr = res.find((addr) => addr.is_default) || null;
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
          localStorage.setItem(
            `selected_address_user_${userInfo?.id}`,
            JSON.stringify(defaultAddr)
          );
        }
      });
    }
  }, [authTokens, navigate, userInfo]);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/products" className="text-indigo-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = Number(item.product.price) || 0;
    const quantity = item.quantity || 1;
    return acc + price * quantity;
  }, 0);

  const handlePayment = () => {
    if (!selectedAddress) {
      alert("Please select a shipping address first.");
      return;
    }

    const order = {
      address_id: selectedAddress.id,
      items: cartItems.map((obj) => ({
        inventory: obj.selectedInventory.id,
        quantity: obj.quantity || 1,
      })),
    };

    postRequest("orders/create/", order, authTokens.access).then((res) => {
      console.log(res, "order created");
      alert("Order placed successfully!");
      // Optionally, clear cart or redirect
    });
  };

  const handleChangeAddress = () => {
    navigate("/address", { state: { fromCheckout: true } });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Selected Address */}
      <div className="mb-6 p-4 border rounded-lg flex justify-between items-center">
        {selectedAddress ? (
          <div>
            <p className="font-semibold">{selectedAddress.full_name}</p>
            <p>
              {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} -{" "}
              {selectedAddress.postal_code}
            </p>
            <p>{selectedAddress.country}</p>
            <p className="text-sm text-gray-500">📞 {selectedAddress.phone}</p>
          </div>
        ) : (
          <p className="text-gray-500">No address selected.</p>
        )}
        <button
          onClick={handleChangeAddress}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {selectedAddress ? "Change Address" : "Add Address"}
        </button>
      </div>

      {/* Cart Items */}
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
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
            <div>
              <p className="font-bold text-lg">
                ₹{Number(item.product.price) * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t flex justify-between items-center shadow-lg">
        <h2 className="text-xl font-bold">Total: ₹{totalPrice}</h2>
        <button
          onClick={handlePayment}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
