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
        window.location.href = res.checkout_url;
      } else if (res.transaction_id) {
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
        <div className="w-12 h-12 border-4 border-brand-liteGray border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );

  if (!order)
    return (
      <div className="flex items-center justify-center h-[80vh] text-brand-subtext">
        Order not found
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-brand-secondaryText bg-brand-contentBg md:pb-12">
      <h1 className="text-2xl font-bold text-brand-title">
        Order #{order.id}
      </h1>

      {/* Shipping Address */}
      <div className="p-5 border border-brand-liteGray rounded-xl bg-brand-secondary shadow-sm">
        <h2 className="font-semibold mb-3 text-brand-title">
          Shipping Address
        </h2>
        <div className="space-y-1 text-brand-subtext">
          <p>{order.address.full_name}</p>
          <p>
            {order.address.street}, {order.address.city},{" "}
            {order.address.state} - {order.address.postal_code}
          </p>
          <p>{order.address.country}</p>
          <p className="text-sm text-brand-liteGray">
            📞 {order.address.phone}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-5 border border-brand-liteGray rounded-xl bg-brand-secondary shadow-sm">
        <h2 className="font-semibold mb-3 text-brand-title">Order Items</h2>
        <div className="divide-y divide-brand-liteGray">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between py-3 text-brand-secondaryText"
            >
              <span>Item #{item.id}</span>
              <span className="text-brand-subtext">Qty: {item.quantity}</span>
              <span className="font-medium text-brand-title">₹{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Payment Section */}
      {order.status === "pending" ? (
        <div className="hidden md:flex justify-between items-center border-t border-brand-liteGray mt-8 pt-4">
          <h2 className="text-xl font-semibold text-brand-title">
            Total: ₹{order.total_price}
          </h2>
          <button
            onClick={handlePayment}
            disabled={paying}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              paying
                ? "bg-brand-liteGray text-brand-primaryText cursor-not-allowed"
                : "bg-brand-primary text-brand-primaryText hover:opacity-90"
            }`}
          >
            {paying ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-brand-primaryText border-t-transparent rounded-full animate-spin"></span>
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

      {/* Mobile Fixed Bottom Payment Bar */}
      {order.status === "pending" && (
        <div className="fixed bottom-0 left-0 z-50 w-full bg-brand-contentBg border-t border-brand-liteGray shadow-lg p-4 flex justify-between items-center md:hidden">
          <h2 className="text-lg font-semibold text-brand-title">
            Total: ₹{order.total_price}
          </h2>
          <button
            onClick={handlePayment}
            disabled={paying}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              paying
                ? "bg-brand-liteGray text-brand-primaryText cursor-not-allowed"
                : "bg-brand-primary text-brand-primaryText hover:opacity-90"
            }`}
          >
            {paying ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-brand-primaryText border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </div>
            ) : (
              "Pay Now"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
