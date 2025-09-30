import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, postRequest } from "../utils/request";

// Fetch addresses: check localStorage first
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth?.authTokens?.access;
      const userId = auth?.userInfo?.id;

      if (!token || !userId) return rejectWithValue("Not authenticated");

      // Check localStorage first
      const cached = localStorage.getItem(`addresses_user_${userId}`);
      if (cached) return JSON.parse(cached);

      // Fetch from backend only if no cache
      const data = await getRequest("orders/addresses/", token);
      localStorage.setItem(`addresses_user_${userId}`, JSON.stringify(data));
      return data;
    } catch (err) {
      return rejectWithValue(err?.detail || "Failed to fetch addresses");
    }
  }
);

// Add a new address
export const addNewAddress = createAsyncThunk(
  "address/addNewAddress",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth?.authTokens?.access;
      const userId = auth?.userInfo?.id;

      if (!token || !userId) return rejectWithValue("Not authenticated");

      const newAddress = await postRequest("orders/addresses/add/", formData, token);

      // Update localStorage
      const cached = localStorage.getItem(`addresses_user_${userId}`);
      const arr = cached ? [newAddress, ...JSON.parse(cached)] : [newAddress];
      localStorage.setItem(`addresses_user_${userId}`, JSON.stringify(arr));

      return newAddress;
    } catch (err) {
      return rejectWithValue(err?.detail || "Failed to add address");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    selectedAddressId: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectAddress: (state, action) => {
      state.selectedAddressId = action.payload;
    },
    clearAddresses: (state) => {
      state.addresses = [];
      state.selectedAddressId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.addresses.unshift(action.payload);
      });
  },
});

export const { selectAddress, clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;

