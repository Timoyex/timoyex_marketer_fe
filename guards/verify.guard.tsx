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
    if (requireVerified && user && !user?.isVerified) {
      router.push("/verify-email");
    }
  }, [isAuthenticated, requireAuth, router]);

  return <>{children}</>;
}
