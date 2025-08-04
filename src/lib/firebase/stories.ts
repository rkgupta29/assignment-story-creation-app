import {
  getDocuments,
  addDocument,
  subscribeToDocuments,
  queryHelpers,
  deleteDocument,
  updateDocument,
} from "./firestore";
import { uploadAudioFileToCloudinary } from "../cloudinary/client";
import { Story, CreateStoryFormData, StoryUpdateData } from "../../types/story";

const COLLECTION_NAME = "stories";

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const removeUndefinedFields = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  const cleanedObj: Record<string, unknown> = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      cleanedObj[key] = value;
    }
  });
  return cleanedObj;
};

export const createStory = async (
  storyData: CreateStoryFormData,
  authorId: string,
  authorName: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const now = new Date();
  const slug = generateSlug(storyData.title);
  let audioUrl: string | undefined;
  let audioPublicId: string | undefined;

  if (storyData.audioFile && storyData.type === "voice") {
    try {
      const uploadResult = await uploadAudioFileToCloudinary(
        storyData.audioFile,
        authorId,
        storyData.title,
        onProgress
      );
      audioUrl = uploadResult.secure_url;
      audioPublicId = uploadResult.public_id;
    } catch (uploadError) {
      const errorMessage =
        uploadError instanceof Error
          ? uploadError.message
          : typeof uploadError === "string"
          ? uploadError
          : "Audio upload failed";
      throw new Error(`Audio upload failed: ${errorMessage}`);
    }
  }

  const story: Omit<Story, "id"> = {
    title: storyData.title,
    content: storyData.content,
    type: storyData.type,
    authorId,
    authorName,
    slug: `${slug}-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };

  if (audioUrl) story.audioUrl = audioUrl;
  if (audioPublicId) story.audioPublicId = audioPublicId;
  if (storyData.audioTranscript)
    story.audioTranscript = storyData.audioTranscript;

  const cleanStory = removeUndefinedFields(story);
  return await addDocument(COLLECTION_NAME, cleanStory);
};

export const getAllStories = async (): Promise<Story[]> => {
  return await getDocuments<Story>(COLLECTION_NAME, [
    queryHelpers.orderBy("createdAt", "desc"),
  ]);
};

export const getStoryBySlug = async (slug: string): Promise<Story | null> => {
  const stories = await getDocuments<Story>(COLLECTION_NAME, [
    queryHelpers.where("slug", "==", slug),
  ]);
  return stories.length > 0 ? stories[0] : null;
};

export const getStoryById = async (storyId: string): Promise<Story | null> => {
  const stories = await getDocuments<Story>(COLLECTION_NAME, [
    queryHelpers.where("id", "==", storyId),
  ]);
  return stories.length > 0 ? stories[0] : null;
};

export const getStoriesByAuthor = async (
  authorId: string
): Promise<Story[]> => {
  // Fetch stories without orderBy to avoid composite index requirement
  const stories = await getDocuments<Story>(COLLECTION_NAME, [
    queryHelpers.where("authorId", "==", authorId),
  ]);

  // Sort client-side by createdAt (descending - newest first)
  return stories.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
};

export const updateStory = async (
  storyId: string,
  updateData: StoryUpdateData
): Promise<void> => {
  const updatedData = { ...updateData, updatedAt: new Date() };
  const cleanUpdatedData = removeUndefinedFields(updatedData);
  await updateDocument(COLLECTION_NAME, storyId, cleanUpdatedData);
};

export const deleteStory = async (storyId: string): Promise<void> => {
  await deleteDocument(COLLECTION_NAME, storyId);
};

export const subscribeToStories = (callback: (stories: Story[]) => void) => {
  return subscribeToDocuments<Story>(
    COLLECTION_NAME,
    [queryHelpers.orderBy("createdAt", "desc")],
    callback
  );
};

/**
 * Sets up real-time subscription to stories for a specific author
 */
export const subscribeToStoriesByAuthor = (
  authorId: string,
  callback: (stories: Story[]) => void
) => {
  return subscribeToDocuments<Story>(
    COLLECTION_NAME,
    [queryHelpers.where("authorId", "==", authorId)],
    (stories) => {
      // Sort client-side by createdAt (descending - newest first)
      const sortedStories = stories.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      callback(sortedStories);
    }
  );
};

export const mockVoiceToText = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTranscripts = [
        "This is a sample transcription of the voice story. The content has been automatically generated from the audio file.",
        "Welcome to my voice story. Today I want to share something important with all of you.",
        "Once upon a time, there was a fascinating tale that needed to be told through voice.",
        "In this audio story, I explore the themes of technology and human connection.",
      ];

      const randomTranscript =
        mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      resolve(randomTranscript);
    }, 2000);
  });
};
