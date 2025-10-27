import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { postRequest, getRequest } from "../utils/request";
import { clearCart } from "../slices/cartSlice";
import toast from "react-hot-toast";

export default function CheckoutScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authTokens, userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authTokens) {
      navigate("/login");
      return;
    }

    const savedAddress = localStorage.getItem(
      `selected_address_user_${userInfo?.id}`
    );
    if (savedAddress) {
      setSelectedAddress(JSON.parse(savedAddress));
    } else {
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

  const handleChangeAddress = () => {
    navigate("/address", { state: { fromCheckout: true } });
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = Number(item.product.price) || 0;
    const quantity = item.quantity || 1;
    return acc + price * quantity;
  }, 0);

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address first.");
      return;
    }

    setLoading(true);
    const order = {
      address_id: selectedAddress.id,
      items: cartItems.map((obj) => ({
        inventory: obj.selectedInventory.id,
        quantity: obj.quantity || 1,
      })),
    };

    try {
      const res = await postRequest("orders/create/", order, authTokens.access);
      toast.success("Order placed successfully!");
      dispatch(clearCart());
      navigate(`/payment/${res.id}`);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0)
    return (
      <div className="max-w-5xl mx-auto p-6 text-center text-brand-secondaryText">
        <h2 className="text-2xl font-bold mb-4 text-brand-title">
          Your Cart is Empty
        </h2>
        <Link to="/products/all" className="text-brand-primary hover:underline">
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 md:pb-20 min-h-screen bg-brand-contentBg text-brand-secondaryText">
      <h1 className="text-2xl font-bold mb-6 text-brand-title">Checkout</h1>

      {/* Address Section */}
      <div className="mb-6 p-4 border border-brand-liteGray rounded-lg bg-brand-secondary">
        {selectedAddress ? (
          <div>
            <p className="font-semibold text-brand-title">
              {selectedAddress.full_name}
            </p>
            <p className="text-brand-subtext">
              {selectedAddress.street}, {selectedAddress.city},{" "}
              {selectedAddress.state}, {selectedAddress.postal_code},{" "}
              {selectedAddress.country} 📞 {selectedAddress.phone}
            </p>
          </div>
        ) : (
          <p className="text-brand-liteGray">No address selected.</p>
        )}
        <button
          onClick={handleChangeAddress}
          className="px-4 py-2 mt-3 w-full border border-brand-liteGray rounded bg-brand-contentBg hover:bg-brand-secondary transition text-brand-title"
        >
          {selectedAddress ? "Change Address" : "Add Address"}
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.map((item, idx) => {
          const price = Number(item.product.price) || 0;
          const quantity = item.quantity || 1;
          const total = price * quantity;
          return (
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
                  <p className="text-sm text-brand-subtext mt-1">
                    Price: ₹{price} × {quantity}
                  </p>
                </div>

                <p className="mt-3 font-semibold text-brand-title">
                  Total: ₹{total}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop total + Checkout */}
      <div className="hidden md:flex justify-between items-center border-t border-brand-liteGray mt-8 pt-4">
        <h2 className="text-xl font-bold text-brand-title">
          Total: ₹{totalPrice}
        </h2>
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`flex items-center justify-center gap-2 bg-brand-primary text-brand-primaryText px-6 py-3 rounded-lg hover:opacity-90 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Checkout"}
        </button>
      </div>

      {/* Mobile fixed button */}
      <div className="fixed z-50 bottom-0 left-0 w-full bg-brand-contentBg p-4 border-t border-brand-liteGray flex justify-between items-center shadow-lg md:hidden">
        <h2 className="text-lg font-bold text-brand-title">
          Total: ₹{totalPrice}
        </h2>
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`flex items-center justify-center gap-2 bg-brand-primary text-brand-primaryText px-6 py-3 rounded-lg hover:opacity-90 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}
