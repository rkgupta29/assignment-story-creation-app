"use client";

import { useAuthStoreWithInit } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

export function AuthStatus() {
  const { userProfile, loading, isAuthenticated, error, clearError, signOut } =
    useAuthStoreWithInit();

  if (loading) {
    return <div className="p-4">Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <div className="p-4">No user</div>;
  }
  console.log(userProfile);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-3">Authenticated User</h3>

        {userProfile ? (
          <div className="p-3 bg-blue-50 rounded-md">
            <h4 className="font-medium text-sm text-blue-700 mb-2">
              Profile Data ({userProfile.userType}):
            </h4>

            {userProfile.userType === "candidate" && (
              <div className="space-y-1">
                <p className="text-sm">Full Name: {userProfile.fullName}</p>
                <p className="text-sm">
                  Created: {userProfile.createdAt.toDateString()}
                </p>
                <p>{userProfile.userType}</p>
                <p>{userProfile.emailVerified ? "Verified" : "Not Verified"}</p>
              </div>
            )}

            {userProfile.userType === "organization" && (
              <div className="space-y-1">
                <p className="text-sm">
                  Organization Name: {userProfile.companyName}
                </p>
                <p className="text-sm">Website: {userProfile.websiteUrl}</p>
                {userProfile.companyDescription && (
                  <p className="text-sm">
                    Description: {userProfile.companyDescription}
                  </p>
                )}
                <p className="text-sm">
                  Created: {userProfile.createdAt.toDateString()}
                </p>
                <p className="text-sm">
                  Updated: {userProfile.updatedAt.toDateString()}
                </p>
                <p>{userProfile.userType}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-700">
              Profile data not found in Firestore
            </p>
          </div>
        )}
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
