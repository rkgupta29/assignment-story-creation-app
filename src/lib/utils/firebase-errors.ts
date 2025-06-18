/**
 * Formats Firebase authentication error messages into user-friendly text
 */
export const formatFirebaseAuthError = (errorMessage: string): string => {
  const errorCode = errorMessage.match(/\(([^)]+)\)/)?.[1] || errorMessage;

  switch (errorCode) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please try signing in instead.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Password is too weak. Please choose a stronger password.";

    case "auth/user-not-found":
      return "No account found with this email address. Please check your email or sign up.";

    case "auth/wrong-password":
      return "Incorrect password. Please try again.";

    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";

    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";

    case "auth/operation-not-allowed":
      return "This operation is not allowed. Please contact support.";

    case "auth/invalid-credential":
      return "Invalid credentials. Please check your email and password.";

    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email but different sign-in credentials.";

    case "auth/requires-recent-login":
      return "This operation requires recent authentication. Please sign in again.";

    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed. Please try again.";

    case "auth/popup-blocked":
      return "Sign-in popup was blocked. Please allow popups for this site.";

    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled. Please try again.";

    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed. Please try again.";

    default:
      return "An error occurred. Please try again.";
  }
};
