"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStoreWithInit } from "@/stores/auth-store";
import FullPageLoader from "../../components/loaders/full-page";

interface ShouldBeAuthenticatedProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ShouldBeAuthenticated({
  children,
  redirectTo = "/login",
}: ShouldBeAuthenticatedProps) {
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
