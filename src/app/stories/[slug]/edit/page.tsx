"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { StoryContentStyles } from "@/components/stories/StoryContentRenderer";
import { StoryType, StoryUpdateData, Story } from "@/types/story";
import { getStoryBySlug, updateStory } from "@/lib/firebase/stories";
import { useAuthStore } from "@/stores/auth-store";
import { useStoryStore } from "@/stores/story-store";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

const editStorySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
});

type EditStorySchema = z.infer<typeof editStorySchema>;

export default function EditStoryPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const { updateStory: updateStoryInStore } = useStoryStore();

  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStory, setIsLoadingStory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EditStorySchema>({
    resolver: zodResolver(editStorySchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const watchedContent = watch("content");

  // Load the story on component mount
  useEffect(() => {
    const loadStory = async () => {
      try {
        const slug = params.slug as string;
        const storyData = await getStoryBySlug(slug);

        if (!storyData) {
          setError("Story not found");
          return;
        }

        // Check if user is the author
        if (!user || storyData.authorId !== user.uid) {
          setError("You don't have permission to edit this story");
          return;
        }

        setStory(storyData);
        reset({
          title: storyData.title,
          content:
            storyData.type === StoryType.TEXT
              ? storyData.content
              : storyData.audioTranscript || "",
        });
      } catch (err) {
        setError("Failed to load story");
        console.error("Error loading story:", err);
      } finally {
        setIsLoadingStory(false);
      }
    };

    if (user) {
      loadStory();
    }
  }, [params.slug, user, reset]);

  const onSubmit = async (data: EditStorySchema) => {
    if (!story || !user) {
      setError("Unable to update story");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const updateData: StoryUpdateData = {
        title: data.title,
      };

      // Update content based on story type
      if (story.type === StoryType.TEXT) {
        updateData.content = data.content;
      } else {
        updateData.audioTranscript = data.content;
      }

      await updateStory(story.id, updateData);

      // Update local store
      updateStoryInStore(story.id, {
        ...updateData,
        updatedAt: new Date(),
      });

      // Redirect back to story
      router.push(`/stories/${story.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update story");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoadingStory) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading story...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !story) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Story not found"}
          </h3>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto p-6">
        <StoryContentStyles />
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/stories/${story.slug}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Story
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Story</h1>
          <p className="text-gray-600">
            Make changes to your {story.type.toLowerCase()} story
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Story Title</Label>
            <Input
              {...register("title")}
              type="text"
              placeholder="Enter a compelling title for your story"
              className="text-lg"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <Label className="text-base font-medium">
              {story.type === StoryType.TEXT ? "Story Content" : "Transcript"}
            </Label>

            {story.type === StoryType.TEXT ? (
              <RichTextEditor
                value={watchedContent}
                onChange={(content) => setValue("content", content)}
                placeholder="Start writing your story..."
                className="min-h-[300px]"
              />
            ) : (
              <div className="space-y-4">
                {story.audioUrl && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Original Audio
                    </Label>
                    <audio controls className="w-full">
                      <source src={story.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Edit Transcript</Label>
                  <RichTextEditor
                    value={watchedContent}
                    onChange={(content) => setValue("content", content)}
                    placeholder="Edit the transcript..."
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            )}

            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6">
            <Link href={`/stories/${story.slug}`}>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
}
