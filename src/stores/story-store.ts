import { create } from "zustand";
import { Story } from "@/types/story";
import {
  getAllStories,
  subscribeToStories,
  deleteStory,
} from "@/lib/firebase/stories";

declare global {
  interface Window {
    __storiesUnsubscribe?: () => void;
  }
}

interface StoryState {
  stories: Story[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  setStories: (stories: Story[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  fetchStories: () => Promise<void>;
  initializeStories: () => void;
  addStory: (story: Story) => void;
  updateStory: (storyId: string, updatedStory: Partial<Story>) => void;
  deleteStory: (storyId: string) => Promise<void>;
  removeStoryFromState: (storyId: string) => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: [],
  loading: true,
  error: null,
  initialized: false,

  setStories: (stories: Story[]) => {
    set({ stories, loading: false });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error, loading: false });
  },

  clearError: () => {
    set({ error: null });
  },

  fetchStories: async () => {
    try {
      set({ loading: true, error: null });
      const stories = await getAllStories();
      set({ stories, loading: false });
    } catch (error) {
      console.error("Error fetching stories:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch stories",
        loading: false,
      });
    }
  },

  initializeStories: () => {
    const { initialized } = get();

    if (initialized) return;

    set({ loading: true, initialized: true });

    // Subscribe to real-time updates
    const unsubscribe = subscribeToStories((stories) => {
      get().setStories(stories);
    });

    // Store unsubscribe function globally for cleanup
    if (typeof window !== "undefined") {
      window.__storiesUnsubscribe = unsubscribe;
    }
  },

  addStory: (story: Story) => {
    const { stories } = get();
    set({ stories: [story, ...stories] });
  },

  updateStory: (storyId: string, updatedStory: Partial<Story>) => {
    const { stories } = get();
    const updatedStories = stories.map((story) =>
      story.id === storyId ? { ...story, ...updatedStory } : story
    );
    set({ stories: updatedStories });
  },

  deleteStory: async (storyId: string) => {
    try {
      // Optimistically remove from local state
      get().removeStoryFromState(storyId);

      // Delete from Firestore
      await deleteStory(storyId);
    } catch (error) {
      console.error("Error deleting story:", error);
      // Refetch stories to restore state if delete failed
      get().fetchStories();
      throw error;
    }
  },

  removeStoryFromState: (storyId: string) => {
    const { stories } = get();
    const updatedStories = stories.filter((story) => story.id !== storyId);
    set({ stories: updatedStories });
  },
}));

let isInitialized = false;

export const useStoryStoreWithInit = () => {
  const store = useStoryStore();

  if (!isInitialized) {
    isInitialized = true;
    store.initializeStories();
  }

  return store;
};
