import axios from "axios";

export default function PayButton() {
  const handlePay = async () => {
    try {
      // 👇 use POST instead of GET for proper API call
      const res = await axios.post("http://127.0.0.1:8000/payments/create/");

      console.log("Response:", res.data);

      // ✅ Handle PhonePe test redirect URL safely
      const redirectUrl =
        res.data?.data?.instrumentResponse?.redirectInfo?.url ||
        res.data?.instrumentResponse?.redirectInfo?.url;

      if (redirectUrl) {
        console.log("Redirecting to:", redirectUrl);
        window.location.href = redirectUrl;
      } else {
        alert("No redirect URL found. Check PhonePe sandbox response.");
      }
    } catch (err) {
      console.error("Payment creation failed:", err);
      alert("Payment creation failed. Check console for details.");
    }
  };

  return (
    <button
      onClick={handlePay}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
    >
      💳 Pay ₹500 (Test)
    </button>
  );
}
