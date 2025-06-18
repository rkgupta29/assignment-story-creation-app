import { create } from "zustand";
import { User } from "firebase/auth";
import { onAuthStateChange, signOutUser } from "@/lib/firebase/auth";

// Extend Window interface to include our global variable
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
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
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

      set({ loading: false });
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
