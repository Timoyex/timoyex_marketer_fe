"use client";

import { EndpointResponse } from "../stores";
import { UserProfile } from "../stores/profile.store";
import { apiClient } from "./client";
import { Preferences } from "./settings";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  isAdmin?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse extends EndpointResponse {
  data: {
    profile: UserProfile;
    access_token: string;
    refresh_token: string;
    isVerified: boolean;
    sub: string;
    preferences?: Preferences;
    role: string;
    token?: string;
  };
}

export const authApi = {
  // Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/v1/auth/login", data);
    return response.data;
  },

  // Register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/v2/auth/register", data);
    return response.data;
  },

  //Verify

  verify: async (data: { token: string }): Promise<AuthResponse> => {
    const response = await apiClient.post("/v1/auth/verify", data);
    return response.data;
  },

  // Logout
  logout: async (token?: string): Promise<void> => {
    await apiClient.post("/v1/auth/logout", {
      refresh_token: token,
    });
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post("/v1/auth/refresh", {
      token: refreshToken,
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post("/v1/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  // Reset password
  resetPassword: async (
    token: string,
    password: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.post("/v1/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },
};
