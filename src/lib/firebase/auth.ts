import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
} from "firebase/auth";
import { auth } from "./config";

// Auth state listener type
export type AuthStateListener = (user: User | null) => void;

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    const authError = error as AuthError;
    return { user: null, error: authError.message };
  }
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update profile if display name is provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }

    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    const authError = error as AuthError;
    return { user: null, error: authError.message };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: unknown) {
    const authError = error as AuthError;
    return { error: authError.message };
  }
};

// Send password reset email
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: unknown) {
    const authError = error as AuthError;
    return { error: authError.message };
  }
};

// Confirm password reset
export const confirmPasswordReset = async (
  oobCode: string,
  newPassword: string
) => {
  try {
    await firebaseConfirmPasswordReset(auth, oobCode, newPassword);
    return { error: null };
  } catch (error: unknown) {
    const authError = error as AuthError;
    return { error: authError.message };
  }
};

// Google sign in
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    const authError = error as AuthError;
    return { user: null, error: authError.message };
  }
};

// Auth state listener
export const onAuthStateChange = (callback: AuthStateListener) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!auth.currentUser;
};
