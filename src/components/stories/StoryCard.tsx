"use client";

import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  FileText,
  Mic,
  User,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import { Story, StoryType } from "@/types/story";
import { useStoryStore } from "@/stores/story-store";
import { useAuthStore } from "@/stores/auth-store";
import { StoryContentRenderer } from "./StoryContentRenderer";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { deleteStory } = useStoryStore();
  const { user } = useAuthStore();
  const router = useRouter();

  // Check if current user is the author
  const isAuthor = user?.uid === story.authorId;

  const handlePlayPause = () => {
    if (story.type === StoryType.VOICE && story.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(story.audioUrl);
        audioRef.current.onended = () => setIsPlaying(false);
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleEdit = () => {
    router.push(`/stories/${story.slug}/edit`);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this story? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteStory(story.id);
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("Failed to delete story. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getPreviewContent = (content: string, maxLength: number = 150) => {
    // Strip HTML tags for preview
    const textContent = content.replace(/<[^>]*>/g, "");
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent;
  };

  const getTruncatedHTML = (html: string, maxLength: number = 150) => {
    // Create a temporary element to extract text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    if (textContent.length <= maxLength) {
      return html;
    }

    // If text is too long, return truncated text wrapped in a paragraph
    const truncatedText = textContent.substring(0, maxLength) + "...";
    return `<p>${truncatedText}</p>`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {story.type === StoryType.TEXT ? (
              <FileText className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            <span className="capitalize">{story.type} Story</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(story.createdAt)}</span>
            </div>
            {isAuthor && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-8 w-8 p-0"
                  title="Edit story"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Delete story"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <Link href={`/stories/${story.slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
            {story.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="pb-4 flex-1">
        {story.type === StoryType.TEXT ? (
          <div className="text-gray-600 line-clamp-3 max-h-20 overflow-hidden">
            <StoryContentRenderer
              content={getTruncatedHTML(story.content)}
              className="prose-sm line-clamp-3"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {story.audioUrl && (
              <div className="flex items-center gap-3 py-3 bg-gray-50 rounded-md">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                  className="flex items-center gap-2"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <span className="text-sm text-gray-600">Audio Story</span>
              </div>
            )}

            {story.audioTranscript && (
              <p className="text-gray-600 line-clamp-3">
                {getPreviewContent(story.audioTranscript)}
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>{story.authorName}</span>
          </div>

          <Link href={`/stories/${story.slug}`}>
            <Button variant="outline" size="sm">
              Read More
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
