"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Play,
  Pause,
  Calendar,
  User,
  FileText,
  Mic,
  Download,
} from "lucide-react";
import { Story, StoryType } from "@/types/story";
import { getStoryBySlug } from "@/lib/firebase/stories";
import { useAuthStore } from "@/stores/auth-store";
import {
  StoryContentRenderer,
  StoryContentStyles,
} from "@/components/stories/StoryContentRenderer";
import Sidebar from "@/components/Sidebar";
import { exportStoryToPDF } from "@/utils/pdf-export";

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const slug = params.slug as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      if (!slug || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedStory = await getStoryBySlug(slug);

        if (fetchedStory) {
          // Check if the current user is the author of the story
          if (fetchedStory.authorId !== user.uid) {
            setError("You don't have permission to view this story");
            return;
          }
          setStory(fetchedStory);
        } else {
          setError("Story not found");
        }
      } catch {
        setError("Failed to load story");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [slug, user]);

  const handlePlayPause = () => {
    if (story?.type === StoryType.VOICE && story.audioUrl) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const handleExport = async () => {
    if (!story) return;
    
    try {
      setIsExporting(true);
      await exportStoryToPDF(story);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to export story";
      alert(`Error exporting story: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Story not found"}
          </h1>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Stories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Sidebar>
      <div className="min-h-screen bg-gray-50">
        <StoryContentStyles />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-8">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Stories
            </Button>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                {story.type === StoryType.TEXT ? (
                  <FileText className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
                <span className="capitalize">{story.type} Story</span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(story.createdAt)}</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {story.title}
              </h1>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-5 w-5" />
                  <span className="text-lg">by {story.authorName}</span>
                </div>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  {isExporting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isExporting ? "Exporting..." : "Export PDF"}
                </Button>
              </div>

              {story.type === StoryType.VOICE && story.audioUrl && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <Button
                      onClick={handlePlayPause}
                      className="flex items-center gap-2"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                      {isPlaying ? "Pause Audio" : "Play Audio"}
                    </Button>
                    <span className="text-sm text-gray-600">
                      Listen to the full audio story
                    </span>
                  </div>

                  <audio
                    ref={audioRef}
                    src={story.audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="w-full"
                    controls
                  />
                </div>
              )}

              <div className="mt-8">
                {story.type === StoryType.TEXT ? (
                  <StoryContentRenderer
                    content={story.content}
                    className="text-gray-800 leading-relaxed"
                  />
                ) : (
                  <div>
                    {story.audioTranscript && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          Transcript
                        </h3>
                        <StoryContentRenderer
                          content={story.audioTranscript}
                          className="text-gray-700 leading-relaxed"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button onClick={() => router.push("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Stories
            </Button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
