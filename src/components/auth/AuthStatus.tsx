"use client";

import { useAuthStoreWithInit } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

export function AuthStatus() {
  const { user, loading, isAuthenticated, error, clearError, signOut } =
    useAuthStoreWithInit();

  if (loading) {
    return <div className="p-4">Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <div className="p-4">Not authenticated</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold">Authenticated User</h3>
        <p>Email: {user?.email}</p>
        <p>UID: {user?.uid}</p>

        {user?.displayName && <p>Name: {user.displayName}</p>}
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            className="ml-2"
          >
            Dismiss
          </Button>
        </div>
      )}

      <Button onClick={signOut} variant="outline">
        Sign Out
      </Button>
    </div>
  );
}
