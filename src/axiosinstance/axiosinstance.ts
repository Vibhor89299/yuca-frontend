import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { showErrorToast, authToasts } from "@/lib/toast";

const axiosinstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001",
});

// Request interceptor to add token
axiosinstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("yuca_auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for centralized error handling
axiosinstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    // Network error
    if (!error.response) {
      showErrorToast(
        "Connection error",
        "Unable to connect to server. Please check your internet connection.",
      );
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message =
      error.response.data?.message ||
      error.response.data?.error ||
      "An unexpected error occurred";

    switch (status) {
      case 401:
        // Only handle 401 if user was previously authenticated
        const wasAuthenticated = !!localStorage.getItem("yuca_auth_token");

        if (wasAuthenticated) {
          localStorage.removeItem("yuca_auth_token");
          authToasts.sessionExpired();
          if (window.location.pathname !== "/login") {
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          }
        }
        // For guest users (no token), don't show toast or redirect
        break;

      case 403:
        showErrorToast(
          "Access denied",
          "You do not have permission to perform this action.",
        );
        break;

      case 404:
        // Don't show toast for 404 - let components handle it
        break;

      case 422:
        showErrorToast("Validation error", message);
        break;

      case 429:
        showErrorToast(
          "Too many requests",
          "Please wait a moment before trying again.",
        );
        break;

      case 500:
      case 502:
      case 503:
        showErrorToast(
          "Server error",
          "Something went wrong on our end. Please try again later.",
        );
        break;

      default:
        // Only show toast for non-400 errors (400 errors are usually handled by forms)
        if (status !== 400) {
          showErrorToast("Error", message);
        }
    }

    return Promise.reject(error);
  },
);

// Function to update the authorization header
export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosinstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosinstance.defaults.headers.common["Authorization"];
  }
};

export default axiosinstance;
