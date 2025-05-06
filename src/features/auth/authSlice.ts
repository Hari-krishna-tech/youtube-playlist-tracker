import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "./types";
import api from "../../services/api";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true, // start loading to check auth status initially
  error: null,
};

// async thunk to check initial authentication status (e.g., call /api/users/me)
// this relies on cookies being sentautomattically by the browser
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      // this endpoint should return the user info if cookies are valid
      // and 401/403 otherwise
      const response = await api.get("/users/me");
      return response.data; // assuming the response contains user data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to auth login again"
      );
    }
  }
);

// Note: Login logic primarily happens via redirects.
// refresh logic is handled by the api interceptor

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = null;

      api.post("/auth/logout").catch((error: any) => {
        console.error("logout failed", error);
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to check auth status";
      });
  },
});

export const { setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
