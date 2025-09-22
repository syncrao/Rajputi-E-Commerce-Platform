import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest, getRequest, patchRequest } from "../utils/request";

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
      return await postRequest(`user/login/`, { username, password });
    } catch (err) {
      console.log(err, "djfkdjfk");
      return rejectWithValue(err?.detail || { detail: "Login failed" });
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async ({ google_token }, { rejectWithValue }) => {
    try {
      return await postRequest(`user/google/`, { google_token });
    } catch (err) {
      return rejectWithValue(err.detail || { detail: "Login failed" });
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { getState, rejectWithValue }) => {
    console.log("req ");
    try {
      const { auth } = getState();
      const token = auth?.authTokens?.access;

      if (!token) {
        return rejectWithValue({ detail: "No access token found" });
      }

      return await getRequest(`user/me/`, token);
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { detail: "Failed to fetch user" }
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (formDataObj, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth?.authTokens?.access;
      const userId = auth?.userInfo?.id;

      if (!token) return rejectWithValue({ detail: "No access token" });
      if (!userId) return rejectWithValue({ detail: "User ID not found" });

      return await patchRequest(`user/${userId}/`, formDataObj, token, true);
    } catch (err) {
      return rejectWithValue(err);
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
        state.authTokens = action.payload;
        state.userInfo = action.payload.user;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
        localStorage.setItem("authToken", JSON.stringify(action.payload));
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
