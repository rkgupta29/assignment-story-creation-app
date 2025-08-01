import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChange, signOutUser } from "@/lib/firebase/auth";
import { getDocument } from "@/lib/firebase/firestore";
import type { User } from "@/types/auth";

declare global {
  interface Window {
    __authUnsubscribe?: () => void;
  }
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  initialized: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setUserProfile: (profile: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
  fetchUserProfile: (uid: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  isAuthenticated: false,
  error: null,
  initialized: false,

  setUser: (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      set({
        isAuthenticated: false,
        loading: false,
        error: null,
        user: null,
      });
      return;
    }

    set({
      isAuthenticated: true,
      error: null,
    });

    get().fetchUserProfile(firebaseUser.uid);
  },

  setUserProfile: (profile: User | null) => {
    set({
      user: profile,
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
      const profile = await getDocument("users", uid);

      if (profile) {
        const user = {
          uid: profile.id || uid,
          email: profile.email,
          name: profile.name,
          emailVerified: profile.emailVerified || false,
          createdAt:
            profile.createdAt?.toDate?.() || new Date(profile.createdAt),
          updatedAt:
            profile.updatedAt?.toDate?.() || new Date(profile.updatedAt),
        } as User;

        get().setUserProfile(user);
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

      set({ loading: false, user: null });
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
