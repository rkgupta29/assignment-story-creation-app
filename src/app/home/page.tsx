import { AuthStatus } from "@/components/auth/AuthStatus";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import React from "react";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        <AuthStatus />
        <h1>this is the homepage for the user</h1>
      </div>
    </ProtectedRoute>
  );
}
