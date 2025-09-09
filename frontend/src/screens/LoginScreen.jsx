import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    username: "", 
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username) newErrors.username = "Email or phone is required";
    if (!formData.password) newErrors.password = "Password is required";
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
      const res = await axios.post(
        "http://127.0.0.1:8000/user/login/",
        formData
      );
      setMessage(res.data.message || "Login successful!");
      console.log("error", res)
      setFormData({ username: "", password: "" });
      setErrors({});
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        const backendErrors = {};
        for (let key in data) backendErrors[key] = data[key][0];
        setErrors(backendErrors);
        setMessage(data.detail || "");
      } else {
        setMessage(data.detail);
      }

    console.log("error", err.response)
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/google-login/", {
        token: credentialResponse.credential,
      });
      setMessage("Google login successful!");
      console.log("User Data:", res.data);
    } catch (err) {
      setMessage("Google login failed!");
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Login
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Log in with your email or phone number, or sign in with Google.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-16 max-w-xl sm:mt-20 space-y-6"
        >
          {/* Email or Phone */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-900">
              Email or Phone
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`mt-2 block w-full rounded-md border-2 px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none ${
                errors.username ? "border-red-500" : "border-gray-300 focus:border-indigo-600"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-2 block w-full rounded-md border-2 px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300 focus:border-indigo-600"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-indigo-600"
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Sign-In */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setMessage("Google login failed!")}
          />
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Register
          </a>
        </p>

        {message && (
          <p className="mt-6 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
