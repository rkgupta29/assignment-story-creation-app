"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStoreWithInit } from "@/stores/auth-store";
import FullPageLoader from "@/components/loaders/full-page";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, isAuthenticated } = useAuthStoreWithInit();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/home");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <FullPageLoader text="Loading..." direction="bottom" />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <div className="min-h-screen grid">{children}</div>;
}
