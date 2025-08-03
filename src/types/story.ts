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
  audioUrl?: string;
  audioTranscript?: string;
  createdAt: Date;
  updatedAt: Date;
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
  audioUrl?: string;
  audioTranscript?: string;
}
