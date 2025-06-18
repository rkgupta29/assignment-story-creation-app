import { AuthStatus } from "@/components/auth/AuthStatus";
import { ShouldBeAuthenticated } from "@/lib/guards/ShouldBeAuthenticated";
import React from "react";

export default function DashboardPage() {
  return (
    <ShouldBeAuthenticated>
      <div>
        <AuthStatus />
        <h1>this is the homepage for the user</h1>
      </div>
    </ShouldBeAuthenticated>
  );
}
