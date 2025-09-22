import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, getUser } from "../slices/authSlice"; 
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditProfileScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    profile_pic: "", // can be string (url) or File
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        first_name: userInfo.first_name || "",
        last_name: userInfo.last_name || "",
        phone: userInfo.phone || "",
        profile_pic: userInfo.profile_pic || "",
      });
    } else {
      dispatch(getUser());
    }
  }, [userInfo, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData({ ...formData, profile_pic: e.target.files[0] });
    }
  };

  const handleFocus = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("first_name", formData.first_name);
      formDataObj.append("last_name", formData.last_name);
      formDataObj.append("phone", formData.phone);

      if (formData.profile_pic instanceof File) {
        formDataObj.append("profile_pic", formData.profile_pic);
      }

      await dispatch(updateUser(formDataObj)).unwrap();

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !userInfo) {
    return (
      <div className="flex items-center justify-center h-screen text-rajputi-brown">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 lg:px-8">
      <div className="w-full max-w-xl bg-white  rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-rajputi-green mb-6">
          Edit Profile
        </h2>

        {/* Profile Preview */}
        <div className="flex flex-col items-center mb-6">
  <div className="relative">
    {/* Profile Image */}
    <img
      src={
        formData.profile_pic
          ? typeof formData.profile_pic === "string"
            ? formData.profile_pic
            : URL.createObjectURL(formData.profile_pic)
          : "https://via.placeholder.com/120"
      }
      alt="Profile"
      className="w-28 h-28 rounded-full  shadow-lg cursor-pointer"
      onClick={() => fileInputRef.current.click()}
    />

    {/* Pencil Icon at bottom-right of the image */}
    {/* <button
      type="button"
      onClick={() => fileInputRef.current.click()}
      className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 w-10 h-10 bg-rajputi-green border-2 border-white rounded-full flex items-center justify-center shadow-lg hover:bg-rajputi-orange transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536M9 11l6 6m0 0H3v-6m12 6l3.536-3.536"
        />
      </svg>
    </button> */}
  </div>

  {/* Hidden file input */}
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
  />
</div>


        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              First Name
            </label>
            <input
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              onFocus={handleFocus}
              className={`mt-2 block w-full rounded-md border-2 px-3.5 py-2 text-gray-900 ${
                errors.first_name
                  ? "border-red-500"
                  : "border-gray-300 focus:border-black"
              }`}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Last Name
            </label>
            <input
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              onFocus={handleFocus}
              className="mt-2 block w-full rounded-md border-2 px-3.5 py-2 text-gray-900 border-gray-300 focus:border-black"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Phone
            </label>
            <input
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              onFocus={handleFocus}
              className={`mt-2 block w-full rounded-md border-2 px-3.5 py-2 text-gray-900 ${
                errors.phone
                  ? "border-red-500"
                  : "border-gray-300 focus:border-black"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className={`w-full py-3 border-2 border-black rounded-xl text-white font-semibold shadow-lg transition ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-700 hover:bg-black"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full mt-3 bg-gray-400 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
