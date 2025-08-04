import { create } from "zustand";
import { Story } from "@/types/story";
import {
  getStoriesByAuthor,
  subscribeToStoriesByAuthor,
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
  currentUserId: string | null;
  setStories: (stories: Story[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  fetchStories: (userId: string) => Promise<void>;
  initializeStories: (userId: string) => void;
  addStory: (story: Story) => void;
  updateStory: (storyId: string, updatedStory: Partial<Story>) => void;
  deleteStory: (storyId: string) => Promise<void>;
  removeStoryFromState: (storyId: string) => void;
  resetStore: () => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: [],
  loading: true,
  error: null,
  initialized: false,
  currentUserId: null,

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

  fetchStories: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const stories = await getStoriesByAuthor(userId);
      set({ stories, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch stories",
        loading: false,
      });
    }
  },

  initializeStories: (userId: string) => {
    const { initialized, currentUserId } = get();

    // Reset if switching users or not initialized
    if (initialized && currentUserId === userId) return;

    // Clean up previous subscription
    if (typeof window !== "undefined" && window.__storiesUnsubscribe) {
      window.__storiesUnsubscribe();
    }

    set({ loading: true, initialized: true, currentUserId: userId });

    // Subscribe to real-time updates for specific user
    const unsubscribe = subscribeToStoriesByAuthor(userId, (stories) => {
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
      get().removeStoryFromState(storyId);
      await deleteStory(storyId);
    } catch (error) {
      const { currentUserId } = get();
      if (currentUserId) {
        get().fetchStories(currentUserId);
      }
      throw error;
    }
  },

  removeStoryFromState: (storyId: string) => {
    const { stories } = get();
    const updatedStories = stories.filter((story) => story.id !== storyId);
    set({ stories: updatedStories });
  },

  resetStore: () => {
    // Clean up subscription
    if (typeof window !== "undefined" && window.__storiesUnsubscribe) {
      window.__storiesUnsubscribe();
      window.__storiesUnsubscribe = undefined;
    }

    set({
      stories: [],
      loading: true,
      error: null,
      initialized: false,
      currentUserId: null,
    });
  },
}));

export const useStoryStoreWithInit = (userId?: string) => {
  const store = useStoryStore();

  // Reset store if user changes or logs out
  if (!userId) {
    if (store.initialized) {
      store.resetStore();
    }
    return { ...store, stories: [], loading: false };
  }

  // Initialize with user ID
  if (!store.initialized || store.currentUserId !== userId) {
    store.initializeStories(userId);
  }

  return store;
};
