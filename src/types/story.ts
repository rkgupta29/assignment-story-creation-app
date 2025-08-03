export enum StoryType {
  TEXT = "text",
  VOICE = "voice",
}

export interface Story {
  id: string;
  title: string;
  content: string;
  type: StoryType;
  authorId: string;
  authorName: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  audioUrl?: string; // Keep for compatibility
  audioPublicId?: string; // Cloudinary public ID for audio files
  audioTranscript?: string;
}

export interface CreateStoryFormData {
  title: string;
  content: string;
  type: StoryType;
  audioFile?: File;
  audioTranscript?: string;
}

export interface StoryUpdateData {
  title?: string;
  content?: string;
  audioTranscript?: string;
}
