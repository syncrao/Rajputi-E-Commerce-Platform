import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const API_URL = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const [step, setStep] = useState(1); // 1 = email, 2 = otp + password
  const [formData, setFormData] = useState({
    identifier: "",
    new_password: "",
    confirm_password: "",
  });
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!formData.identifier) {
      setErrors({ identifier: "Email is required" });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/user/send_otp/`, { email: formData.identifier });
      toast.success(`OTP sent to ${formData.identifier}`);
      setStep(2);
    } catch (error) {
      toast.error("Failed to send OTP");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) newErrors.otp = "Enter 6-digit OTP";
    if (!formData.new_password) newErrors.new_password = "Password is required";
    if (formData.new_password.length < 6) newErrors.new_password = "Password must be at least 6 characters";
    if (formData.new_password !== formData.confirm_password) newErrors.confirm_password = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/user/reset_password/`, {
        identifier: formData.identifier,
        code: finalOtp,
        new_password: formData.new_password,
      });
      toast.success(res.data.message || "Password reset successfully");
      setFormData({ identifier: "", new_password: "", confirm_password: "" });
      setOtp(new Array(6).fill(""));
      navigate("/login");
    } catch (error) {
      console.error(error);
      const data = error.response?.data;
      if (data?.error) toast.error(data.error);
      else toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-black text-center mb-4">
          Reset Password
        </h2>

        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-5">
            <p className="text-gray-600 text-center mb-4">
              Enter your email to receive OTP.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-800">Email</label>
              <input
                type="email"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className={`mt-2 block w-full rounded-md border-2 px-3.5 py-2 focus:outline-none ${
                  errors.identifier ? "border-red-500" : "border-gray-300 focus:border-black"
                }`}
              />
              {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-xl text-white font-semibold shadow border-2 border-black ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600  hover:bg-black focus:outline-black"
              }`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-gray-600 text-center mb-4">Enter OTP and your new password.</p>

            <div>
              <label className="block text-sm font-medium text-gray-700">OTP Code</label>
              <div className="flex justify-center gap-3 mt-2 mb-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                ))}
              </div>
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800">New Password</label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className={`mt-2 block w-full rounded-md border-2 px-3.5 py-2 focus:outline-none ${
                  errors.new_password ? "border-red-500" : "border-gray-300 focus:border-black"
                }`}
              />
              {errors.new_password && <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={`mt-2 block w-full rounded-md border-2 px-3.5 py-2 focus:outline-none ${
                  errors.confirm_password ? "border-red-500" : "border-gray-300 focus:border-black"
                }`}
              />
              {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5  rounded-xl text-white font-semibold shadow border-2 border-black ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-black focus:outline-rajputi-yellow"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
