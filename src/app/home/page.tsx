import { AuthStatus } from "@/components/auth/AuthStatus";
import React from "react";

export default function DashboardPage() {
  return (
    <div>
      <AuthStatus />
      <h1>this is the homepage for the user</h1>
    </div>
  );
}
