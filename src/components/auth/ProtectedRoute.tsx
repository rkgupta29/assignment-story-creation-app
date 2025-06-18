"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStoreWithInit } from "@/stores/auth-store";
import FullPageLoader from "../loaders/full-page";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { loading, isAuthenticated } = useAuthStoreWithInit();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [loading, isAuthenticated, router, redirectTo]);

  if (loading) {
    return <FullPageLoader text="Loading..." direction="bottom" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
