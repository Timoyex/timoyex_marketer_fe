import { useMutation } from "@tanstack/react-query";
import { authApi, type LoginRequest, type RegisterRequest } from "@/lib/api";
import { useAuthStore, useSettingsStore } from "@/lib/stores";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // or your preferred toast library

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

  const { setPreferences } = useSettingsStore();
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
          role: data.data.role,
        },
        access_token: data.data.access_token,
        refresh_token: data.data.refresh_token,
      });

      data.data.preferences && setPreferences(data.data.preferences);
      if (data.data.role === "admin") {
        toast.success("Welcome Admin!");
      } else {
        toast.success("Welcome back!");
      }

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
      toast.success("Account created successfully! Please Log In");

      setTimeout(() => {
        console.log("log in please");
      }, 3000);
      router.push("/verify-email");
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
      router.push("/login");
    },
    onError: () => {
      // Still logout locally even if API call fails
      logout();
      router.push("/login");
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
