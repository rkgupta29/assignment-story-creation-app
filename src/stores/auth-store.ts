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
  fetchUserProfile: (firebaseUser: FirebaseUser) => Promise<void>;
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

    get().fetchUserProfile(firebaseUser);
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
    set({ error, loading: false });
  },

  clearError: () => {
    set({ error: null });
  },

  fetchUserProfile: async (firebaseUser: FirebaseUser) => {
    try {
      const profile = await getDocument("users", firebaseUser.uid);

      if (profile) {
        const user = {
          uid: profile.id || firebaseUser.uid,
          email: profile.email || firebaseUser.email || "",
          name: profile.name || firebaseUser.displayName || "User",
          emailVerified:
            firebaseUser.emailVerified || profile.emailVerified || false,
          createdAt:
            profile.createdAt?.toDate?.() ||
            new Date(profile.createdAt) ||
            new Date(),
          updatedAt:
            profile.updatedAt?.toDate?.() ||
            new Date(profile.updatedAt) ||
            new Date(),
        } as User;

        get().setUserProfile(user);
      } else {
        // If no profile exists, create a basic user from Firebase data
        const fallbackUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "User",
          emailVerified: firebaseUser.emailVerified,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as User;

        get().setUserProfile(fallbackUser);
      }
    } catch {
      // If there's an error fetching profile, create a basic user from Firebase data
      const fallbackUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || "User",
        emailVerified: firebaseUser.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      get().setUserProfile(fallbackUser);
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

      set({ loading: false, user: null, isAuthenticated: false });
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
