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
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-brand-contentBg">
      <div className="flex flex-col items-center justify-center py-10">
        <img
          src={userInfo.profile_pic || "https://via.placeholder.com/120"}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-brand-secondary shadow-md"
        />
        <h2 className="mt-4 text-2xl font-bold text-brand-black">
          {userInfo.first_name} {userInfo.last_name}
        </h2>
        <p className="text-brand-secondaryText">{userInfo.email}</p>

        {/* Edit Profile Button */}
        <button
          onClick={handleEditProfile}
          className="mt-4 px-6 py-2 bg-brand-blue text-brand-primaryText font-semibold rounded-xl shadow-md transition duration-300 hover:bg-brand-highlight"
        >
          Edit Profile
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <h3 className="text-xl font-semibold text-brand-black">My Details</h3>
        <div className="space-y-3 p-6 border-2 rounded-xl border-brand-secondary">
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

      <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full bg-brand-red border-2 border-brand-black text-brand-primaryText font-semibold py-3 rounded-xl shadow-lg hover:bg-brand-highlight transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
