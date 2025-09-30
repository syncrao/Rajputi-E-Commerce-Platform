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
            const res = await postRequest(`payments/pay/${order.id}/`, {}, authTokens.access);
            alert(`Payment successful! Transaction ID: ${res.transaction_id}`);
            
            // Optionally, refresh order details after payment
            const updatedOrder = await getRequest(`orders/${id}/`, authTokens.access);
            setOrder(updatedOrder);
        } catch (err) {
            console.error(err);
            alert(err?.error || "Payment failed");
        } finally {
            setPaying(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!order) return <div className="p-6">Order not found</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>

            {/* Address */}
            <div className="p-4 border rounded-lg">
                <h2 className="font-semibold mb-2">Shipping Address</h2>
                <p>{order.address.full_name}</p>
                <p>{order.address.street}, {order.address.city}, {order.address.state} - {order.address.postal_code}</p>
                <p>{order.address.country}</p>
                <p className="text-sm text-gray-500">📞 {order.address.phone}</p>
            </div>

            {/* Items */}
            <div className="p-4 border rounded-lg">
                <h2 className="font-semibold mb-2">Order Items</h2>
                {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between border-b py-2">
                        <span>Item #{item.id}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>₹{item.price}</span>
                    </div>
                ))}
            </div>

            {/* Total & Payment */}
            {order.status === "pending" ? (
                <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t flex justify-between items-center shadow-lg">
                    <h2 className="text-xl font-bold">Total: ₹{order.total_price}</h2>
                    <button
                        onClick={handlePayment}
                        disabled={paying}
                        className={`px-6 py-3 rounded-lg text-white ${paying ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {paying ? "Processing..." : "Pay Now"}
                    </button>
                </div>
            ) : (
                <div className="p-4 text-center bg-green-100 text-green-800 rounded-lg">
                    Payment Completed ✅
                </div>
            )}
        </div>
    );
}
