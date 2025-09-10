import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL

const authTokens = localStorage.getItem("authToken")
  ? JSON.parse(localStorage.getItem("authToken"))
  : null;


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/user/login/`, {
        username,
        password,
      });
      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: "Login failed" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authTokens: authTokens,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.authTokens = null;
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authTokens = action.payload;
        localStorage.setItem("authToken", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
