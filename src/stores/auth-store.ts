import { create } from "zustand";
import { User } from "firebase/auth";
import { onAuthStateChange, signOutUser } from "@/lib/firebase/auth";
import { getDocument } from "@/lib/firebase/firestore";
import type { Candidate, Organization } from "@/types/auth";

// Extend Window interface to include our global variable
declare global {
  interface Window {
    __authUnsubscribe?: () => void;
  }
}

interface AuthState {
  user: User | null;
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
    set({
      user,
      isAuthenticated: !!user,
      loading: false,
      error: null,
    });

    // Fetch user profile if user is authenticated
    if (user) {
      get().fetchUserProfile(user.uid);
    } else {
      set({ userProfile: null });
    }
  },

  setUserProfile: (profile: Candidate | Organization | null) => {
    set({ userProfile: profile });
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
      // Try to fetch from candidates collection first
      let profile = await getDocument("candidates", uid);

      if (!profile) {
        // If not found in candidates, try organizations
        profile = await getDocument("organizations", uid);
      }

      if (profile) {
        // Convert Firestore timestamp to Date and add uid
        const userProfile = {
          ...profile,
          uid: profile.id,
          createdAt:
            profile.createdAt?.toDate?.() || new Date(profile.createdAt),
          updatedAt:
            profile.updatedAt?.toDate?.() || new Date(profile.updatedAt),
        } as unknown as Candidate | Organization;

        get().setUserProfile(userProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Don't set error here as it's not critical for auth
    }
  },

  initializeAuth: () => {
    const { initialized } = get();

    // Only initialize once
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

// Auto-initialize auth when the store is first accessed
let isInitialized = false;

export const useAuthStoreWithInit = () => {
  const store = useAuthStore();

  // Initialize auth on first use
  if (!isInitialized) {
    isInitialized = true;
    store.initializeAuth();
  }

  return store;
};
