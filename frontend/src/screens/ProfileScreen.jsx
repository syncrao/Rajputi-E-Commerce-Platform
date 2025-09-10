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

    console.log(userInfo)
  }, [dispatch, authTokens, userInfo]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (loading && !userInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p className="text-lg">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center py-10 bg-white shadow">
        <img
          src={userInfo.profile_pic || "https://via.placeholder.com/100"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-indigo-600"
        />
        <h2 className="mt-4 text-xl font-semibold text-gray-800">
          {userInfo.first_name} {userInfo.last_name}
        </h2>
        <p className="text-gray-500">{userInfo.email}</p>
      </div>

      <div className="flex-1 p-6">
        <h3 className="text-lg font-semibold mb-2">My Details</h3>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-medium">Username:</span> {userInfo.username}</p>
          <p><span className="font-medium">Phone:</span> {userInfo.phone || "Not provided"}</p>
          <p><span className="font-medium">Email Verified:</span> {userInfo.is_email_verified ? "✅" : "❌"}</p>
          <p><span className="font-medium">Phone Verified:</span> {userInfo.is_phone_verified ? "✅" : "❌"}</p>
        </div>
      </div>

      <div className="p-6 bg-white shadow-inner">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
