import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/lib/stores";
import { authApi } from "./auth";
import { FE_URL } from "@/app.config";

const API_BASE_URL = FE_URL || "https://timoyex-affiliate-dash-api.vercel.app";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Auth endpoints that should never have Authorization headers
const AUTH_ENDPOINTS = [
  "/v1/auth/login",
  "/v1/auth/refresh",
  "/v1/auth/register",
  "/v1/auth/refresh",
  "/v1/auth/forgot-password",
  "/v1/auth/reset-password",
  "/health",
];

// Queue management for concurrent requests during token refresh
let isRefreshing = false;

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().access_token;

    // Skip auth header for authentication endpoints
    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // Only add Authorization header to protected endpoints
    if (token && config.headers && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CRITICAL: Don't touch FormData at all - any interaction can corrupt it
    if (config.data instanceof FormData) {
      // Remove any Content-Type header - let browser set boundary
      if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }

      // DO NOT log FormData entries - this can corrupt the stream
      console.log(
        "Sending FormData (not logging contents to prevent corruption)"
      );
    } else {
      console.log("Regular data:", config.data);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Handle 401 errors with automatic token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, let TanStack Query handle the retry
      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refresh_token;

      if (!refreshToken) {
        isRefreshing = false;
        useAuthStore.getState().logout();

        // Invalidate all queries on logout
        if (typeof window !== "undefined") {
          const queryClient = (window as any).__REACT_QUERY_CLIENT__;
          if (queryClient) {
            queryClient.clear();
          }

          window.location.href = "/auth/login";
        }

        return Promise.reject(error);
      }

      try {
        console.log("Refreshing access token...");
        const response = await authApi.refreshToken(refreshToken);

        const { access_token } = response.data;
        // Update store with new token
        useAuthStore.getState().setAccessToken(access_token);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        isRefreshing = false;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed");
        isRefreshing = false;
        useAuthStore.getState().logout();

        // Clear TanStack Query cache on auth failure
        if (typeof window !== "undefined") {
          const queryClient = (window as any).__REACT_QUERY_CLIENT__;
          if (queryClient) {
            queryClient.clear();
          }

          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
