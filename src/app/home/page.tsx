"use client";

import { ShouldBeAuthenticated } from "@/lib/guards/ShouldBeAuthenticated";

export default function DashboardPage() {
  return (
    <ShouldBeAuthenticated>
      <div>this is the homepage</div>
    </ShouldBeAuthenticated>
  );
}
