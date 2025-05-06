import axios from "axios";
import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",
  withCredentials: true, // include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple logout requests
let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token); // Not actually using the token here, just resolving
    }
  });
  failedQueue = [];
};

// Add a response interceptor
api.interceptors.response.use(
  (response) => response, // simple return sucessfull response
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const dispatch = useAppDispatch();
    // Check if it's a 403 error and not already retrying or refreshing
    if (status === 403 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true; // Mark request as retried
      isRefreshing = true;

      try {
        console.log("Attempting token refresh...");
        // Call your backend endpoint to refresh tokens
        // This endpoint should use the refresh token cookie and return new tokens
        // (which the backend should set as new HttpOnly cookies)
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });

        console.log("Token refresh successful");
        processQueue(null); // Process queue indicating success

        // Retry the original request - cookies should be updated automatically
        return api(originalRequest);
      } catch (refreshError: any) {
        console.error("Token refresh failed:", refreshError);
        processQueue(refreshError); // Process queue indicating failure
        dispatch(logout()); // Logout the user if refresh fails
        // Redirect to login page - handled by ProtectedRoute now
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else if (isRefreshing) {
      // If currently refreshing, queue the failed request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          // Retry the original request after refresh is done
          return api(originalRequest);
        })
        .catch((err) => {
          // If refresh failed, reject the queued request
          return Promise.reject(err);
        });
    }

    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);


export default api;