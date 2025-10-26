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
      <div className="flex flex-col items-center justify-center h-screen text-brand-subtext">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-brand-subtext">
        <p className="text-lg">You are not logged in.</p>
        <button
          onClick={handleLogout}
          className="w-full bg-brand-red border-2 border-brand-black text-brand-primaryText font-semibold py-3 rounded-xl shadow-lg hover:bg-brand-highlightText transition duration-300"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-brand-contentBg min-h-screen">
  {/* Header Section */}
  <div className="flex flex-col items-center justify-center py-10 bg-brand-primary rounded-b-3xl shadow-md">
    <img
      src={userInfo.profile_pic || "https://via.placeholder.com/120"}
      alt="Profile"
      className="w-28 h-28 rounded-full border-4 border-brand-liteGray shadow-lg"
    />
    <h2 className="mt-4 text-2xl font-bold text-brand-primaryText">
      {userInfo.first_name} {userInfo.last_name}
    </h2>
    <p className="text-brand-primaryText/80">{userInfo.email}</p>

    {/* Edit Profile Button */}
    <button
      onClick={handleEditProfile}
      className="mt-4 px-6 py-2 bg-brand-blue text-brand-primaryText font-semibold rounded-full shadow-md transition duration-300 hover:bg-brand-highlight"
    >
      Edit Profile
    </button>
  </div>

  {/* Details Section */}
  <div className="flex-1 p-6 space-y-6">
    <h3 className="text-xl font-semibold text-brand-title">My Details</h3>
    <div className="space-y-3 p-6 border-2 rounded-xl border-brand-liteGray bg-brand-secondary shadow-sm">
      <p>
        <span className="font-medium text-brand-green">Username:</span>{" "}
        {userInfo.username}
      </p>
      <p>
        <span className="font-medium text-brand-green">Phone:</span>{" "}
        {userInfo.phone || "Not provided"}
      </p>
      <p>
        <span className="font-medium text-brand-green">Email Verified:</span>{" "}
        {userInfo.is_email_verified ? "✅" : "❌"}
      </p>
      <p>
        <span className="font-medium text-brand-green">Phone Verified:</span>{" "}
        {userInfo.is_phone_verified ? "✅" : "❌"}
      </p>
    </div>
  </div>

  {/* Logout Button */}
  <div className="p-6">
    <button
      onClick={handleLogout}
      className="w-full bg-red-500 text-brand-primaryText font-semibold py-3 rounded-full shadow-lg hover:bg-brand-highlight transition duration-300"
    >
      Logout
    </button>
  </div>
</div>

  );
}
