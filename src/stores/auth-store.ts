import { create } from "zustand";
import { User } from "firebase/auth";
import { onAuthStateChange, signOutUser } from "@/lib/firebase/auth";
import { getDocument } from "@/lib/firebase/firestore";
import type { Candidate, Organization } from "@/types/auth";

declare global {
  interface Window {
    __authUnsubscribe?: () => void;
  }
}

interface AuthState {
  userProfile: Candidate | Organization | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: Candidate | Organization | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
  fetchUserProfile: (uid: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,
  isAuthenticated: false,
  error: null,
  initialized: false,

  setUser: (user: User | null) => {
    if (!user) {
      set({
        isAuthenticated: false,
        loading: false,
        error: null,
        userProfile: null,
      });
      return;
    }

    set({
      isAuthenticated: true,
      error: null,
    });

    get().fetchUserProfile(user.uid);
  },

  setUserProfile: (profile: Candidate | Organization | null) => {
    set({
      userProfile: profile,
      loading: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  fetchUserProfile: async (uid: string) => {
    try {
      let profile = await getDocument("candidates", uid);

      if (!profile) {
        profile = await getDocument("organizations", uid);
      }

      if (profile) {
        const userProfile = {
          ...profile,
          uid: profile.id,
          createdAt:
            profile.createdAt?.toDate?.() || new Date(profile.createdAt),
          updatedAt:
            profile.updatedAt?.toDate?.() || new Date(profile.updatedAt),
        } as unknown as Candidate | Organization;

        get().setUserProfile(userProfile);
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      set({ loading: false });
    }
  },

  initializeAuth: () => {
    const { initialized } = get();

    if (initialized) return;

    set({ loading: true, initialized: true });

    const unsubscribe = onAuthStateChange((user) => {
      get().setUser(user);
    });

    if (typeof window !== "undefined") {
      window.__authUnsubscribe = unsubscribe;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      const { error } = await signOutUser();

      if (error) {
        set({ error, loading: false });
        return;
      }

      set({ loading: false, userProfile: null });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to sign out",
        loading: false,
      });
    }
  },
}));

let isInitialized = false;

export const useAuthStoreWithInit = () => {
  const store = useAuthStore();

  if (!isInitialized) {
    isInitialized = true;
    store.initializeAuth();
  }

  return store;
};
