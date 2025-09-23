import { useMutation } from "@tanstack/react-query";
import { authApi, type LoginRequest, type RegisterRequest } from "@/lib/api";
import { useAuthStore } from "@/lib/stores";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // or your preferred toast library
import { useEffect } from "react";

export function useAuth() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,

    login,
    logout,
    setLoading,
    setAccessToken,
    setVerifyError,

    refresh_token,
  } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      login({
        user: {
          sub: data.data.sub,
          id: data.data.profile.id,
          email: data.data.profile.email,
          isVerified: data.data.isVerified,
        },
        access_token: data.data.access_token,
        refresh_token: data.data.refresh_token,
      });
      toast.success("Welcome back!");
      setTimeout(() => {
        console.log("logen in");
      }, 3000);
      router.push("/overview");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Login failed";
      console.log(error);
      toast.error(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      login({
        user: {
          sub: data.data.sub,
          id: data.data.profile.id,
          email: data.data.profile.email,
          isVerified: data.data.isVerified,
        },
        access_token: data.data.access_token,
        refresh_token: data.data.refresh_token,
      });
      toast.success(
        "Account created successfully! Please check you mail for verification"
      );

      setTimeout(() => {
        console.log("log in please");
      }, 3000);
      router.push("/auth");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  //Verify mutation

  const verifyMutation = useMutation({
    mutationFn: authApi.verify,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      login({
        user: {
          sub: data.data.sub,
          id: data.data.profile.id,
          email: data.data.profile.email,
          isVerified: data.data.isVerified,
        },
        access_token: data.data.access_token,
        refresh_token: data.data.refresh_token,
      });
      toast.success("Welcome Back");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Verification failed";
      setVerifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const refreshMutation = useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      setAccessToken(data.token);
    },
    onError: () => logout(),
    onSettled: () => {
      setLoading(false);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      toast.success("Logged out successfully");
      router.push("/auth");
    },
    onError: () => {
      // Still logout locally even if API call fails
      logout();
      router.push("/auth");
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending,

    // Actions
    login: (data: LoginRequest) => loginMutation.mutate(data),
    register: (data: RegisterRequest) => registerMutation.mutate(data),
    refresh: (data: string) => refreshMutation.mutate(data),
    verify: (data: { token: string }) => verifyMutation.mutate(data),
    logout: () => logoutMutation.mutate(refresh_token || undefined),

    // States
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    verifyError: verifyMutation?.error?.response?.data?.message,
    isVerifyPending: verifyMutation.isPending,
    verifySuccess: verifyMutation.isSuccess,
  };
}
