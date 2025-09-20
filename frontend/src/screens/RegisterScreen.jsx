import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { googleLogin } from "../slices/authSlice";

export const API_URL = import.meta.env.VITE_API_URL;

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCheckbox = (e) => {
    setAgree(e.target.checked);
    if (e.target.checked) setErrors({ ...errors, agree: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!agree) newErrors.agree = "You must agree to Privacy Policy & Terms";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/user/register/`, formData);
      setFormData({ username: "", email: "", phone: "", password: "" });
      setAgree(false);
      setErrors({});
      toast.success(res.data.message);
      navigate("/verifyOTP", { state: { email: formData.email } });
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        const backendErrors = {};
        for (let key in data) backendErrors[key] = data[key][0];
        setErrors(backendErrors);
        if (data.detail) toast.success(data.detail);
      } else {
        toast.error(data?.detail || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await dispatch(
        googleLogin({ google_token: credentialResponse.credential })
      ).unwrap();
      toast.success("Google login successful!");
      navigate("/")
    } catch (err) {
      toast.error("Google login failed!");
      console.error("Google login error:", err);
    }
  };

  return (
    <GoogleOAuthProvider clientId="136419210304-emidhp4v69n2oslarprvj8l6s4l61tj6.apps.googleusercontent.com">
      <div className="flex flex-col items-center justify-center p-6 lg:px-8">
        <div className=" w-full text-center m-4">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Create Account
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Register with your email and phone number, or sign in with Google.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-xl space-y-4"
        >
          {["username", "email", "phone", "password"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-semibold text-gray-800"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type={field === "password" ? "password" : "text"}
                value={formData[field]}
                onChange={handleChange}
                onFocus={handleFocus}
                className={`mt-2 block w-full rounded-md border-2 px-3.5 py-2 text-gray-900 placeholder-gray-400 focus:outline-none ${
                  errors[field]
                    ? "border-red-500"
                    : "border-gray-300 focus:border-black"
                }`}
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          <div className="flex items-center gap-3">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={agree}
              onChange={handleCheckbox}
              className={`h-4 w-4 rounded border-gray-300 ${
                errors.agree ? "border-red-500" : ""
              }`}
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              I agree to the{" "}
              <a
                href="/privacy-policy"
                className="font-semibold hover:text-black"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/terms"
                className="font-semibold hover:text-black"
              >
                Terms & Conditions
              </a>
              .
            </label>
          </div>
          {errors.agree && (
            <p className="text-red-500 text-sm mt-1">{errors.agree}</p>
          )}

          <button
            type="submit"
            className={`w-full py-3 border-2 border-black rounded-xl text-white font-semibold shadow-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-600  hover:bg-black focus:outline-rajputi-yellow"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
                Creating...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="flex items-center my-6 w-full max-w-xl">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex justify-center mb-6 w-full max-w-xl">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed!")}
          />
        </div>

        <p className="text-sm text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold  hover:text-black"
          >
            Sign in
          </Link>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
}
