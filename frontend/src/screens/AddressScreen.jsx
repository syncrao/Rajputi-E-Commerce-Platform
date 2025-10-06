import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getRequest, postRequest, putRequest, deleteRequest } from "../utils/request";

export default function AddressScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Authentication from localStorage
  const authTokens = JSON.parse(localStorage.getItem("authToken"));
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  // ✅ Fetch addresses from API
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

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Reset form after add/edit
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
    setShowModal(false);
  };

  // ✅ Add or update address
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  // ✅ Delete address
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteRequest(`orders/addresses/${id}/`, authTokens.access);
      await fetchAddresses();
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  // ✅ Edit existing address
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
    setShowModal(true);
  };

  // ✅ Select address for checkout
  const handleSelectAddress = (addr) => {
    localStorage.setItem(`selected_address_user_${userInfo?.id}`, JSON.stringify(addr));
    if (redirectBack) navigate("/checkout");
  };

  return (
    <div className="p-6 min-h-screen max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">My Addresses</h2>

      {loading && <p>Loading...</p>}

      {/* Address List */}
      <div className="space-y-3 mb-24">
        {addresses.length === 0 ? (
          <p className="text-gray-500">No addresses found.</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 border rounded-lg flex justify-between items-start ${
                addr.is_default ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <div>
                <p className="font-semibold">{addr.full_name}</p>
                <p>
                  {addr.street}, {addr.city}, {addr.state} - {addr.postal_code}
                </p>
                <p>{addr.country}</p>
                <p className="text-sm text-gray-500">📞 {addr.phone}</p>
                {addr.is_default && (
                  <span className="text-xs text-blue-600 font-medium">Default</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
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
                  {redirectBack ? "Select for Checkout" : "Select Address"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Address Button */}
      <div className="fixed bottom-4 left-0 w-full flex justify-center">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg"
        >
          Add New Address
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                "full_name",
                "phone",
                "street",
                "city",
                "state",
                "postal_code",
                "country",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required={field !== "country"}
                />
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

              <div className="flex gap-2 justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
