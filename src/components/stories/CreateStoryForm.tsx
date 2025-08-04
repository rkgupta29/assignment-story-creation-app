"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, FileText, Mic } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { StoryContentStyles } from "@/components/stories/StoryContentRenderer";
import { VoiceRecorder } from "@/components/audio/VoiceRecorder";
import { StoryType, CreateStoryFormData } from "@/types/story";
import { createStory, mockVoiceToText } from "@/lib/firebase/stories";
import { useAuthStore } from "@/stores/auth-store";

const createStorySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  type: z.nativeEnum(StoryType),
});

type CreateStorySchema = z.infer<typeof createStorySchema>;

export function CreateStoryForm() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [storyType, setStoryType] = useState<StoryType>(StoryType.TEXT);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateStorySchema>({
    resolver: zodResolver(createStorySchema),
    defaultValues: {
      title: "",
      content: "",
      type: StoryType.TEXT,
    },
  });

  const watchedContent = watch("content");

  const handleAudioReady = async (file: File) => {
    try {
      setAudioFile(file);
      setIsProcessingAudio(true);
      setError(null);

      // Mock voice-to-text conversion
      const transcript = await mockVoiceToText();
      setValue("content", transcript);
      setValue("type", StoryType.VOICE);
      setStoryType(StoryType.VOICE);
    } catch (error) {
      console.error("Error processing audio:", error);
      setError("Failed to process audio file. Please try again.");
    } finally {
      setIsProcessingAudio(false);
    }
  };

  const handleStoryTypeChange = (type: StoryType) => {
    setStoryType(type);
    setValue("type", type);

    // Clear content when switching types
    if (type === StoryType.TEXT) {
      setAudioFile(null);
      setUploadProgress(0);
    }
    setValue("content", "");
    setError(null);
  };

  const onSubmit = async (data: CreateStorySchema) => {
    if (!user) {
      setError("You must be logged in to create a story");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setUploadProgress(0);

      const storyData: CreateStoryFormData = {
        title: data.title,
        content: data.content,
        type: data.type,
        audioFile:
          data.type === StoryType.VOICE ? audioFile || undefined : undefined,
        audioTranscript:
          data.type === StoryType.VOICE ? data.content : undefined,
      };

      // Create story with progress tracking for audio uploads
      await createStory(storyData, user.uid, user.name, (progress) =>
        setUploadProgress(progress)
      );

      // Redirect to home or story page
      router.push("/");
    } catch (err) {
      console.error("Error creating story:", err);
      setError(err instanceof Error ? err.message : "Failed to create story");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <StoryContentStyles />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create a New Story
        </h1>
        <p className="text-gray-600">
          Share your story with the world through text or voice
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Story Type Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Story Type</Label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleStoryTypeChange(StoryType.TEXT)}
              className={`flex items-center gap-2 p-4 border-2 rounded-lg transition-colors ${
                storyType === StoryType.TEXT
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Text Story</div>
                <div className="text-sm text-gray-500">
                  Write your story with rich formatting
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleStoryTypeChange(StoryType.VOICE)}
              className={`flex items-center gap-2 p-4 border-2 rounded-lg transition-colors ${
                storyType === StoryType.VOICE
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Mic className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Voice Story</div>
                <div className="text-sm text-gray-500">
                  Record or upload audio
                </div>
              </div>
            </button>
          </div>
        </div>

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
            {storyType === StoryType.TEXT ? "Story Content" : "Voice Story"}
          </Label>

          {storyType === StoryType.TEXT ? (
            <RichTextEditor
              value={watchedContent}
              onChange={(content) => setValue("content", content)}
              placeholder="Start writing your story..."
              className="min-h-[300px]"
            />
          ) : (
            <div className="space-y-4">
              <VoiceRecorder
                onAudioReady={handleAudioReady}
                className="border border-gray-300 rounded-md p-4"
              />

              {isProcessingAudio && (
                <div className="flex items-center gap-2 text-blue-600 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">
                    Processing audio and generating transcript...
                  </span>
                </div>
              )}

              {watchedContent && !isProcessingAudio && (
                <div className="space-y-2">
                  <Label>Generated Transcript (Editable)</Label>
                  <RichTextEditor
                    value={watchedContent}
                    onChange={(content) => setValue("content", content)}
                    placeholder="Audio transcript will appear here..."
                    className="min-h-[150px]"
                  />
                  <p className="text-xs text-gray-500">
                    You can edit the generated transcript above before
                    publishing your story.
                  </p>
                </div>
              )}
            </div>
          )}

          {errors.content && (
            <p className="text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isProcessingAudio}
            className="min-w-[120px]"
          >
            {isLoading
              ? uploadProgress > 0
                ? `Uploading... ${Math.round(uploadProgress)}%`
                : "Publishing..."
              : "Publish Story"}
          </Button>
        </div>

        {/* Upload Progress Bar */}
        {isLoading && uploadProgress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Uploading audio file...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
