import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, postRequest } from "../utils/request";

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { getState, rejectWithValue }) => {

    try {
      const { auth } = getState();
      const token = auth?.authTokens?.access;
      const userId = auth?.userInfo?.id;

      if (!token) return rejectWithValue("Not authenticated");
      const cached = localStorage.getItem(`addresses`);
      if (cached) return JSON.parse(cached);

      const data = await getRequest("orders/addresses/", token);
      localStorage.setItem(`addresses`, JSON.stringify(data));
      return data;
    } catch (err) {
      return rejectWithValue(err?.detail || "Failed to fetch addresses");
    }
  }
);

export const addNewAddress = createAsyncThunk(
  "address/addNewAddress",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth?.authTokens?.access;

      if (!token) return rejectWithValue("Not authenticated");

      const newAddress = await postRequest("orders/addresses/add/", formData, token);

      const cached = localStorage.getItem(`addresses`);

      const arr = cached ? [newAddress, ...JSON.parse(cached)] : [newAddress];
      localStorage.setItem(`addresses`, JSON.stringify(arr));

      return arr;
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

