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

// Generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Helper function to remove undefined fields from object for Firestore
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

// Create story with Cloudinary audio handling
export const createStory = async (
  storyData: CreateStoryFormData,
  authorId: string,
  authorName: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const now = new Date();
    const slug = generateSlug(storyData.title);
    let audioUrl: string | undefined;
    let audioPublicId: string | undefined;

    // Handle audio file upload if provided
    if (storyData.audioFile && storyData.type === "voice") {
      console.log("Starting Cloudinary audio upload:", {
        fileName: storyData.audioFile.name,
        fileType: storyData.audioFile.type,
        fileSize: storyData.audioFile.size,
        title: storyData.title,
      });

      try {
        const uploadResult = await uploadAudioFileToCloudinary(
          storyData.audioFile,
          authorId,
          storyData.title,
          onProgress
        );
        audioUrl = uploadResult.secure_url;
        audioPublicId = uploadResult.public_id;

        console.log("Cloudinary audio upload successful:", {
          url: audioUrl,
          publicId: audioPublicId,
          format: uploadResult.format,
          size: uploadResult.bytes,
          duration: uploadResult.duration,
        });
      } catch (uploadError) {
        console.error("Error uploading audio file to Cloudinary:", uploadError);

        // Provide more specific error messages
        let errorMessage = "Audio upload failed";
        if (uploadError instanceof Error) {
          errorMessage = uploadError.message;
        } else if (typeof uploadError === "string") {
          errorMessage = uploadError;
        }

        throw new Error(`Audio upload failed: ${errorMessage}`);
      }
    }

    const story: Omit<Story, "id"> = {
      title: storyData.title,
      content: storyData.content,
      type: storyData.type,
      authorId,
      authorName,
      slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
      createdAt: now,
      updatedAt: now,
    };

    // Only add audio fields if they exist
    if (audioUrl) {
      story.audioUrl = audioUrl;
    }
    if (audioPublicId) {
      story.audioPublicId = audioPublicId;
    }
    if (storyData.audioTranscript) {
      story.audioTranscript = storyData.audioTranscript;
    }

    // Remove any remaining undefined fields before saving to Firestore
    const cleanStory = removeUndefinedFields(story);

    console.log("Creating story document:", {
      title: cleanStory.title,
      type: cleanStory.type,
      hasAudioUrl: !!cleanStory.audioUrl,
      hasAudioPublicId: !!cleanStory.audioPublicId,
      hasTranscript: !!cleanStory.audioTranscript,
    });

    const docId = await addDocument(COLLECTION_NAME, cleanStory);
    console.log("Story created successfully:", docId);

    return docId;
  } catch (error) {
    console.error("Error creating story:", error);
    throw error;
  }
};

// Get all stories
export const getAllStories = async (): Promise<Story[]> => {
  try {
    const stories = await getDocuments<Story>(COLLECTION_NAME, [
      queryHelpers.orderBy("createdAt", "desc"),
    ]);
    return stories;
  } catch (error) {
    console.error("Error getting stories:", error);
    throw error;
  }
};

// Get story by slug
export const getStoryBySlug = async (slug: string): Promise<Story | null> => {
  try {
    const stories = await getDocuments<Story>(COLLECTION_NAME, [
      queryHelpers.where("slug", "==", slug),
    ]);
    return stories.length > 0 ? stories[0] : null;
  } catch (error) {
    console.error("Error getting story by slug:", error);
    throw error;
  }
};

// Get story by ID
export const getStoryById = async (storyId: string): Promise<Story | null> => {
  try {
    const stories = await getDocuments<Story>(COLLECTION_NAME, [
      queryHelpers.where("id", "==", storyId),
    ]);
    return stories.length > 0 ? stories[0] : null;
  } catch (error) {
    console.error("Error getting story by ID:", error);
    throw error;
  }
};

// Get stories by author
export const getStoriesByAuthor = async (
  authorId: string
): Promise<Story[]> => {
  try {
    const stories = await getDocuments<Story>(COLLECTION_NAME, [
      queryHelpers.where("authorId", "==", authorId),
      queryHelpers.orderBy("createdAt", "desc"),
    ]);
    return stories;
  } catch (error) {
    console.error("Error getting stories by author:", error);
    throw error;
  }
};

// Update story
export const updateStory = async (
  storyId: string,
  updateData: StoryUpdateData
): Promise<void> => {
  try {
    const updatedData = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Remove undefined fields before updating
    const cleanUpdatedData = removeUndefinedFields(updatedData);

    await updateDocument(COLLECTION_NAME, storyId, cleanUpdatedData);
  } catch (error) {
    console.error("Error updating story:", error);
    throw error;
  }
};

// Delete story
export const deleteStory = async (storyId: string): Promise<void> => {
  try {
    await deleteDocument(COLLECTION_NAME, storyId);
  } catch (error) {
    console.error("Error deleting story:", error);
    throw error;
  }
};

// Real-time stories subscription
export const subscribeToStories = (callback: (stories: Story[]) => void) => {
  return subscribeToDocuments<Story>(
    COLLECTION_NAME,
    [queryHelpers.orderBy("createdAt", "desc")],
    callback
  );
};

// Mock voice-to-text conversion
export const mockVoiceToText = (): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate API delay
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
