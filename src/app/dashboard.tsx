"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, TrendingUp, Users } from "lucide-react";
import { StoryCard } from "@/components/stories/StoryCard";
import { StoryContentStyles } from "@/components/stories/StoryContentRenderer";
import { useStoryStoreWithInit } from "@/stores/story-store";
import Link from "next/link";

export default function DashboardContent() {
  const { stories, loading, error } = useStoryStoreWithInit();

  return (
    <div className="p-6">
      <StoryContentStyles />
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Stories Dashboard
            </h1>
            <p className="text-gray-600">
              Discover and share amazing stories from our community
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
                {stories.length}
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
                {stories.filter((story) => story.type === "text").length}
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
                {stories.filter((story) => story.type === "voice").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Latest Stories</h2>
          {stories.length > 0 && (
            <span className="text-sm text-gray-500">
              {stories.length} {stories.length === 1 ? "story" : "stories"}{" "}
              available
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading stories...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
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
              Be the first to share your story with the community!
            </p>
            <Link href="/stories/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create your first story
              </Button>
            </Link>
          </div>
        )}

        {/* Stories Grid */}
        {!loading && !error && stories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
