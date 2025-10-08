import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getRequest, postRequest, putRequest, deleteRequest } from "../utils/request";

export default function AddressScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const authTokens = JSON.parse(localStorage.getItem("authToken"));
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_default: false,
  });

  const redirectBack = location.state?.fromCheckout || false;

  useEffect(() => {
    if (!authTokens) {
      navigate("/login");
      return;
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await getRequest("orders/addresses/", authTokens.access);
      setAddresses(data);
      localStorage.setItem(`addresses_user_${userInfo?.id}`, JSON.stringify(data));
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      is_default: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      if (editingId) {
        await putRequest(`orders/addresses/${editingId}/`, formData, authTokens.access);
      } else {
        await postRequest("orders/addresses/add/", formData, authTokens.access);
      }
      await fetchAddresses();
      resetForm();
    } catch (err) {
      console.error("Failed to save address:", err);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteRequest(`orders/addresses/${id}/`, authTokens.access);
      await fetchAddresses();
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  const handleEdit = (addr) => {
    setEditingId(addr.id);
    setFormData({
      full_name: addr.full_name,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
      country: addr.country,
      is_default: addr.is_default,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectAddress = (addr) => {
    localStorage.setItem(`selected_address_user_${userInfo?.id}`, JSON.stringify(addr));
    if (redirectBack) navigate("/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 ">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {showForm ? (editingId ? "Edit Address" : "Add New Address") : "My Addresses"}
          </h2>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow"
            >
              + Add New
            </button>
          )}
        </div>

        {/* Form View */}
        {showForm ? (
          <div className="">
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "full_name", label: "Full Name" },
                { name: "phone", label: "Phone Number" },
                { name: "street", label: "Address" },
                { name: "city", label: "City" },
                { name: "state", label: "State" },
                { name: "postal_code", label: "Postal Code" },
                { name: "country", label: "Country" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.label}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
                    required={field.name !== "country"}
                  />
                </div>
              ))}

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleChange}
                />
                <span>Set as default</span>
              </label>

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={btnLoading}
                  className={`flex-1 flex justify-center items-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${
                    btnLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {btnLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : editingId ? (
                    "Update Address"
                  ) : (
                    "Save Address"
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Loader */}
            {loading && (
              <div className="flex justify-center items-center py-10">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Address List */}
            {!loading && (
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <p className="text-gray-500 text-center">No addresses found.</p>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 border rounded-lg bg-white shadow-sm transition hover:shadow-md ${
                        addr.is_default ? "border-blue-500" : "border-gray-300"
                      }`}
                    >
                      <p className="font-semibold text-lg">{addr.full_name}</p>
                      <p className="text-gray-700">
                        {addr.street}, {addr.city}, {addr.state} - {addr.postal_code}, {addr.country}
                      </p>
                    
                      <p className="text-sm text-gray-500 mt-1">📞 {addr.phone}</p>
                      {addr.is_default && (
                        <span className="text-xs text-blue-600 font-medium mt-1 inline-block">
                          Default Address
                        </span>
                      )}
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={() => handleEdit(addr)}
                          className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(addr.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleSelectAddress(addr)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
