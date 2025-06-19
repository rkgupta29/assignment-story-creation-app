"use client";

import CandidateDashboard from "@/components/candiadates/dashboard";
import OrganizationDashboard from "@/components/organizations/dashboard";
import { useAuthStoreWithInit } from "@/stores/auth-store";
import { notFound } from "next/navigation";
import React from "react";

export default function DashboardPage() {
  const { userProfile, loading } = useAuthStoreWithInit();

  if (loading) return <div>Loading...</div>;

  if (!userProfile) return notFound();

  if (userProfile?.userType === "candidate") {
    return <CandidateDashboard />;
  }

  if (userProfile?.userType === "organization") {
    return <OrganizationDashboard />;
  }

  return notFound();
}
