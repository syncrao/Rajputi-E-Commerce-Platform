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

  if (loading && !userInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-rajputi-brown">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-rajputi-brown">
        <p className="text-lg">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-rajputi-ivory">
      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center py-10 bg-rajputi-pink shadow-md rounded-b-3xl">
        <img
          src={userInfo.profile_pic || "https://via.placeholder.com/120"}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-rajputi-yellow shadow-lg"
        />
        <h2 className="mt-4 text-2xl font-bold text-rajputi-green">
          {userInfo.first_name} {userInfo.last_name}
        </h2>
        <p className="text-rajputi-brown">{userInfo.email}</p>
      </div>

      {/* Profile Details */}
      <div className="flex-1 p-6 space-y-6">
        <h3 className="text-xl font-semibold text-rajputi-green border-b border-rajputi-brown pb-2">
          My Details
        </h3>
        <div className="space-y-3 text-rajputi-brown bg-white p-6 rounded-xl shadow-md">
          <p>
            <span className="font-medium text-rajputi-green">Username:</span>{" "}
            {userInfo.username}
          </p>
          <p>
            <span className="font-medium text-rajputi-green">Phone:</span>{" "}
            {userInfo.phone || "Not provided"}
          </p>
          <p>
            <span className="font-medium text-rajputi-green">Email Verified:</span>{" "}
            {userInfo.is_email_verified ? "✅" : "❌"}
          </p>
          <p>
            <span className="font-medium text-rajputi-green">Phone Verified:</span>{" "}
            {userInfo.is_phone_verified ? "✅" : "❌"}
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-6 bg-rajputi-ivory">
        <button
          onClick={handleLogout}
          className="w-full bg-rajputi-orange text-rajputi-ivory font-semibold py-3 rounded-xl shadow-lg hover:bg-rajputi-pink transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
