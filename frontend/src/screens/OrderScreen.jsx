import { useEffect, useState } from "react";
import { getRequest } from "../utils/request";
import dayjs from "dayjs";

export default function OrderScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const authTokens = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    if (!authTokens?.access) return;
    getRequest("orders", authTokens.access)
      .then((res) => {
        setOrders(res);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
        <p className="text-gray-600">You haven’t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex flex-wrap justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">
                Order #{order.id}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-2">
              Placed on: {dayjs(order.created_at).format("DD MMM YYYY, hh:mm A")}
            </p>

            <div className="border rounded-lg p-3 bg-gray-50 mb-4">
              <p className="font-medium">{order.address.full_name}</p>
              <p className="text-sm text-gray-600">
                {order.address.street}, {order.address.city}, {order.address.state} -{" "}
                {order.address.postal_code}
              </p>
              <p className="text-sm text-gray-600">
                {order.address.country} | 📞 {order.address.phone}
              </p>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    {item.size && item.color && (
                      <p className="text-sm text-gray-500">
                        Size: {item.size}, Color: {item.color}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="font-semibold text-lg">
                Total: ₹{Number(order.total_price).toFixed(2)}
              </p>
              <button
                onClick={() => alert(`Order ID: ${order.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
