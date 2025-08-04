"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, TrendingUp, Users } from "lucide-react";
import { StoryCard } from "@/components/stories/StoryCard";
import { StoryContentStyles } from "@/components/stories/StoryContentRenderer";
import { useAuthStore } from "@/stores/auth-store";
import { getStoriesByAuthor } from "@/lib/firebase/stories";
import { Story } from "@/types/story";
import Link from "next/link";

export default function DashboardContent() {
  const { user, loading: authLoading } = useAuthStore();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStories = async () => {
      if (!user?.uid) {
        setStories([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching stories for user:", user.uid);

        const userStories = await getStoriesByAuthor(user.uid);
        console.log("Fetched stories:", userStories);

        setStories(userStories || []);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Failed to load stories");
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserStories();
    }
  }, [user?.uid, authLoading]);

  if (authLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Not authenticated
          </h2>
          <p className="text-gray-600">Please log in to view your stories.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <StoryContentStyles />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Stories
            </h1>
            <p className="text-gray-600">
              Welcome back, {user.name}! Manage and organize your personal
              stories
            </p>
          </div>
          <Link href="/stories/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Story
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Stories</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stories.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Text Stories</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading
                  ? "..."
                  : stories.filter((story) => story.type === "text").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Voice Stories</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading
                  ? "..."
                  : stories.filter((story) => story.type === "voice").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Your Stories</h2>
          {!loading && stories.length > 0 && (
            <span className="text-sm text-gray-500">
              {stories.length} {stories.length === 1 ? "story" : "stories"}
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading your stories...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                if (user?.uid) {
                  setLoading(true);
                  getStoriesByAuthor(user.uid)
                    .then(setStories)
                    .catch(() => setError("Failed to load stories"))
                    .finally(() => setLoading(false));
                }
              }}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && stories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No stories yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your storytelling journey by creating your first story!
            </p>
            <Link href="/stories/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create your first story
              </Button>
            </Link>
            <div className="mt-8 text-left max-w-md mx-auto">
              <h4 className="font-semibold text-gray-900 mb-2">
                What you can do:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create text stories with rich formatting</li>
                <li>• Record voice stories with audio</li>
                <li>• Edit and manage your stories</li>
                <li>• Your stories are private and only visible to you</li>
              </ul>
            </div>
          </div>
        )}

        {/* Stories Grid */}
        {!loading && !error && stories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onDelete={(storyId) => {
                  setStories((prevStories) =>
                    prevStories.filter((s) => s.id !== storyId)
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
