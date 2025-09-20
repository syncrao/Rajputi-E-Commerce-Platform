import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin } from "../slices/authSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate()

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(loginUser(formData))
      .unwrap()
      .then((res) => {
        toast.success("Login successful!");
        navigate("/")
        setFormData({ username: "", password: "" });
        setErrors({});
      })
      .catch((err) => {
        toast.error(err || "Login failed!");
        console.log("error", err);
        const backendErrors = {};
        for (let key in err.data) backendErrors[key] = err.data[key][0];
        setErrors(backendErrors);
      });
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
      <div className="isolate px-6 py-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Sign in
          </h2> 
          <p className="mt-2 text-lg text-gray-700">
            Sign-in with your email or phone number, or sign in with Google.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-16 max-w-xl sm:mt-20 space-y-6"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-800"
            >
              Email or Phone
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`mt-2 block w-full rounded-md border-2 px-3.5 py-2 text-base text-gray-800 placeholder:text-gray-600 focus:outline-none ${
                errors.username
                  ? "border-black"
                  : "border-gray-400 focus:border-black"
              }`}
            />
            {errors.username && (
              <p className="text-rajputi-pink text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-2 block w-full rounded-md border-2 px-3.5 py-2 text-base text-gray-800 placeholder:text-gray-600 focus:outline-none ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-400 focus:border-black"
              }`}
            />
        

            <div className="text-left mt-2">
              <Link
                to="/reset-password"
                className="text-sm font-medium text-gray-600 hover:text-black"
              >
                Forgot password ?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className={`block w-full border-2 border-black rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow 
                       ${
                         loading
                           ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                           : "bg-gray-600 text-white hover:bg-black focus:outline-rajputi-yellow"
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
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-rajputi-brown"></div>
          <span className="px-4 text-rajputi-brown text-sm">OR</span>
          <div className="flex-grow border-t border-rajputi-brown"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed!")}
          />
        </div>

        <p className="mt-6 text-center text-sm text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold  hover:text-black"
          >
            Create account
          </Link>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
}
