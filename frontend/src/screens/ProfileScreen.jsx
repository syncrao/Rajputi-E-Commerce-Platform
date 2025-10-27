import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, getUser } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, authTokens, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authTokens?.access && !userInfo) {
      dispatch(getUser());
    }
  }, [dispatch, authTokens, userInfo]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/editProfile");
  };

  if (loading && !userInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-brand-contentBg text-gray-600">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-brand-primary rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-brand-contentBg text-gray-600">
        <p className="text-lg mb-4">You are not logged in.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow hover:bg-brand-title transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center py-10 bg-white rounded-b-3xl shadow-sm border-b border-gray-200">
        <img
          src={userInfo.profile_pic || "https://via.placeholder.com/120"}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-gray-200 shadow-md object-cover"
        />
        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          {userInfo.first_name} {userInfo.last_name}
        </h2>
        <p className="text-gray-500">{userInfo.email}</p>

        {/* Edit Profile Button */}
        <button
          onClick={handleEditProfile}
          className="mt-4 px-6 py-2 bg-brand-primary text-white font-semibold rounded-full shadow-md hover:bg-brand-title transition duration-300"
        >
          Edit Profile
        </button>
      </div>

      {/* Details Section */}
      <div className="flex-1 p-6 space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">My Details</h3>
        <div className="space-y-3 p-6 border rounded-xl border-gray-200 bg-white shadow-sm">
          <p>
            <span className="font-medium text-brand-primary">Username:</span>{" "}
            {userInfo.username}
          </p>
          <p>
            <span className="font-medium text-brand-primary">Phone:</span>{" "}
            {userInfo.phone || "Not provided"}
          </p>
          <p>
            <span className="font-medium text-brand-primary">Email Verified:</span>{" "}
            {userInfo.is_email_verified ? "✅ Yes" : "❌ No"}
          </p>
          <p>
            <span className="font-medium text-brand-primary">Phone Verified:</span>{" "}
            {userInfo.is_phone_verified ? "✅ Yes" : "❌ No"}
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-6 bg-white border-t border-gray-200 shadow-sm">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white font-semibold py-3 rounded-full shadow hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
