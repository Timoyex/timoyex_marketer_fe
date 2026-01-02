"use client";
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
    role,
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
    onSuccess: (data, variables) => {
      login({
        user: {
          sub: data.data.sub,
          id: data.data.profile.id,
          email: data.data.profile.email,
          isVerified: data.data.isVerified,
          role: data.data.role,
        },
        adminLogin: variables.isAdmin,
        access_token: data.data.access_token,
        refresh_token: data.data.refresh_token,
      });

      data.data.preferences && setPreferences(data.data.preferences);
      if (variables.isAdmin) {
        toast.success("Welcome Admin!");

        setTimeout(() => {
          console.log("logen in");
        }, 3000);

        return router.push("/admin/dashboard");
      }
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
        "Account created successfully! Please Verify Your Account."
      );

      setTimeout(() => {
        console.log("verify please");
      }, 3000);
      router.push("/verify-email");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed";
      console.log(message);
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

  // Resend Verify mutation

  const resendVerifyMutation = useMutation({
    mutationFn: authApi.resendVerify,
    onMutate: () => {
      toast.success("Resending");
    },
    onSuccess: () => {
      toast.success("Verification Mail Sent");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Verification failed. Try aain later";
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
    onMutate: () => {
      toast.success("Logging out...");
    },
    onSuccess: () => {
      logout();
      toast.success("Logged out successfully");
      return;
    },
    onError: () => {
      logout();
      return;
    },
  });

  // Forgot Password Mutation
  const forgotPwdMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Reset Link Sent");
    },
    onError: (err: any) => {
      toast.error("Failed to send reset link. Please try again.");
      return err?.response?.data;
    },
  });

  // Reset Pwd Mutation
  const resetPwdMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success("Password has been reset");
    },
    onError: (error: any) => {
      toast.error("Failed to reset password. Please try again.");
    },
  });

  // Change Pwd Mutation

  const changePwdMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success("Password has been changed.Please login again.");
    },
    onError: (error: any) => {
      toast.error("Failed to change password. Please try again in a while.");
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending,

    // Actions
    login: (data: LoginRequest) => loginMutation.mutateAsync(data),
    register: (data: RegisterRequest) => registerMutation.mutateAsync(data),
    refresh: (data: string) => refreshMutation.mutateAsync(data),
    verify: (data: { token: string }) => verifyMutation.mutateAsync(data),
    resendVerify: (data: { email: string }) =>
      resendVerifyMutation.mutateAsync(data),
    logout: () =>
      logoutMutation.mutateAsync({
        token: refresh_token || undefined,
        role,
      }),
    forgotPwd: (email: string) => forgotPwdMutation.mutateAsync(email),
    resetPwd: (data: { token: string; password: string }) =>
      resetPwdMutation.mutateAsync(data),
    changePwd: (data: { oldPwd: string; newPwd: string }) =>
      changePwdMutation.mutateAsync(data),

    // States
    loginError: loginMutation.error,
    registerError: registerMutation.error?.response?.data?.message,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    verifyError: verifyMutation?.error?.response?.data?.message,
    isVerifyPending: verifyMutation.isPending,
    verifySuccess: verifyMutation.isSuccess,
    resenVerifySuccess: resendVerifyMutation.isSuccess,
    resendVerifyError: resendVerifyMutation.error,
    resendVerifyLoading: resendVerifyMutation.isPending,
    forgotPwdSuccess: forgotPwdMutation.isSuccess,
    forgotPwdError: forgotPwdMutation.error,
    forgotPwdReset: forgotPwdMutation.reset,
    resetPwdSuccess: resetPwdMutation.isSuccess,
    resetPwdError: resetPwdMutation.error,
    changePwdSuccess: changePwdMutation.isSuccess,
    changePwdError: changePwdMutation.error,
    changePwdReset: changePwdMutation.reset,
  };
}
