import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRequest, postRequest } from "../utils/request";
import { useSelector } from "react-redux";

export default function PaymentScreen() {
  const { authTokens } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    getRequest(`orders/${id}/`, authTokens.access)
      .then((res) => {
        setOrder(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, authTokens]);

  const handlePayment = async () => {
  if (!order) return;
  setPaying(true);
  try {
    const res = await postRequest(
      `payments/mock/${order.id}/`,
      {},
      authTokens.access
    );

    console.log("PhonePe response:", res);

    if (res.success && res.checkout_url) {
      // Redirect user to PhonePe test payment page
      window.location.href = res.checkout_url;
    } else if (res.transaction_id) {
      // Fallback (in case checkout_url missing)
      alert(`✅ Payment successful! Transaction ID: ${res.transaction_id}`);
    } else {
      alert("Something went wrong while initiating payment.");
    }
  } catch (err) {
    console.error(err);
    alert(err?.error || "Payment failed");
  } finally {
    setPaying(false);
  }
};


  if (loading)
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );

  if (!order)
    return (
      <div className="flex items-center justify-center h-[80vh] text-gray-600">
        Order not found
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>

      {/* Address Section */}
      <div className="p-5 border border-gray-200 rounded-xl shadow-sm bg-white">
        <h2 className="font-semibold mb-3 text-gray-700">Shipping Address</h2>
        <div className="space-y-1 text-gray-600">
          <p>{order.address.full_name}</p>
          <p>
            {order.address.street}, {order.address.city},{" "}
            {order.address.state} - {order.address.postal_code}
          </p>
          <p>{order.address.country}</p>
          <p className="text-sm text-gray-500">📞 {order.address.phone}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-5 border border-gray-200 rounded-xl shadow-sm bg-white">
        <h2 className="font-semibold mb-3 text-gray-700">Order Items</h2>
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-3">
              <span className="text-gray-700">Item #{item.id}</span>
              <span className="text-gray-500">Qty: {item.quantity}</span>
              <span className="font-medium text-gray-800">₹{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Section */}
      {order.status === "pending" ? (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Total: ₹{order.total_price}
          </h2>
          <button
            onClick={handlePayment}
            disabled={paying}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${
              paying
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {paying ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </div>
            ) : (
              "Pay Now"
            )}
          </button>
        </div>
      ) : (
        <div className="p-4 text-center bg-green-100 text-green-800 rounded-lg font-medium">
          ✅ Payment Completed
        </div>
      )}
    </div>
  );
}
