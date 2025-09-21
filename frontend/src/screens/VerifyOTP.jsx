import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export const API_URL = import.meta.env.VITE_API_URL;

export default function VerifyOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    const sendOtp = async () => {
      try {
        await axios.post(`${API_URL}/user/send_otp/`, { email });
        toast.success(`OTP sent to ${email}`);
      } catch (error) {
        toast.error("Failed to send OTP");
        console.error(error);
      }
    };
    sendOtp();
  }, [email]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      toast.error("Please enter 6 digit OTP");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/user/verify_otp/`, { email, code: finalOtp });
      toast.success("OTP verified successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Invalid OTP");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-6">
      <div className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-black text-center mb-2">
          Verify OTP  
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to <b>{email}</b>
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-2.5 rounded-xl border-2 border-black font-semibold shadow transition
            ${loading ? "bg-gray-400 text-white cursor-not-allowed" : "bg-gray-600 text-white hover:bg-black"}
          `}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
