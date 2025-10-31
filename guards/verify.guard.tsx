"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerified?: boolean;
}

export function VerifyGuard({
  children,
  requireAuth = true,
  requireVerified = true,
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (
      !requireAuth &&
      isAuthenticated &&
      requireVerified &&
      !user?.isVerified
    ) {
      router.push("/verify-rmail");
    }

    if (!requireAuth && isAuthenticated) {
      router.push("/overview");
    }
  }, [isAuthenticated, requireAuth, router]);

  // Show loading or redirect
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  if (requireVerified && !user?.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent">
          Please verify your email address
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
