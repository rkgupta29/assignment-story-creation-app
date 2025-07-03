import React, { useState, useEffect } from "react";
import { onAuthStateChange } from "@/lib/firebase/auth";
import { getCandidateProfile } from "@/lib/firebase/profile";
import { CandidateProfile } from "@/types/profile";
import ProfileCompletionForm from "../profile/ProfileCompletionForm";
import { User } from "firebase/auth";

export default function CandidateDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      if (user) {
        loadProfile(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadProfile = async (uid: string) => {
    try {
      const profileData = await getCandidateProfile(uid);
      setProfile(profileData);

      // Show profile form if profile is incomplete or doesn't exist
      if (!profileData || !profileData.isProfileComplete) {
        setShowProfileForm(true);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = () => {
    setShowProfileForm(false);
    // Reload profile data
    if (user?.uid) {
      getCandidateProfile(user.uid).then(setProfile);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showProfileForm) {
    return (
      <ProfileCompletionForm
        candidateId={user?.uid || ""}
        onComplete={handleProfileComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.fullName || "Candidate"}!
          </h1>
          <p className="text-gray-600">
            Your profile is {profile?.profileCompletionPercentage || 0}%
            complete
          </p>
        </div>

        {/* Profile Status */}
        {profile && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Status
                </h2>
                <p className="text-gray-600 mt-1">
                  Keep your profile updated to get better job matches
                </p>
              </div>
              <button
                onClick={() => setShowProfileForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Profile
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Profile Completion</span>
                <span>{profile.profileCompletionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profile.profileCompletionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Work Experience</span>
                <span className="font-medium">
                  {profile?.totalWorkExperience || 0} years
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Industry</span>
                <span className="font-medium">
                  {profile?.industry || "Not specified"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-medium">
                  {profile?.currentLocation?.city || "Not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activity</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                View Job Matches
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                Update Resume
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                Edit Profile
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                View Applications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
