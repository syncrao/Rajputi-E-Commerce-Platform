import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;

const authTokens = localStorage.getItem("authToken")
  ? JSON.parse(localStorage.getItem("authToken"))
  : null;

const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
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

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async ({ google_token }, { rejectWithValue }) => {
    try {
     const res = await axios.post(`${API_URL}/user/google/`, {
        google_token
      });
      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: "Login failed" });
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { getState, rejectWithValue }) => {
    console.log("req " )
    try {
      const { auth } = getState();
      const token = auth?.authTokens?.access;

      if (!token) {
        return rejectWithValue({ detail: "No access token found" });
      }

      const res = await axios.get(`${API_URL}/user/me/`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
    console.log("req " ,res)
      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: "Failed to fetch user" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authTokens: authTokens,
    loading: false,
    userInfo: userInfo,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.authTokens = null;
      state.userInfo = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
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
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user";
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.authTokens = action.payload
        state.userInfo = action.payload.user;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
        localStorage.setItem("authToken", JSON.stringify(action.payload));
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
