import {
  getDocument,
  addDocumentWithId,
  subscribeToDocument,
} from "./firestore";
import { uploadFile } from "./storage";
import { UserProfile, ProfileUpdateData } from "../../types/profile";

const COLLECTION_NAME = "users";

// Get user profile
export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    return await getDocument<UserProfile>(COLLECTION_NAME, userId);
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Create or update user profile
export const upsertUserProfile = async (
  userId: string,
  profileData: ProfileUpdateData
): Promise<void> => {
  try {
    const existingProfile = await getUserProfile(userId);
    const now = new Date();

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...profileData,
      updatedAt: now,
    } as UserProfile;

    if (!existingProfile) {
      updatedProfile.createdAt = now;
    }

    await addDocumentWithId(COLLECTION_NAME, userId, updatedProfile);
  } catch (error) {
    console.error("Error upserting user profile:", error);
    throw error;
  }
};

// Update basic profile information
export const updateProfile = async (
  userId: string,
  updateData: { name?: string; profileImage?: File }
): Promise<void> => {
  try {
    let profileImageUrl: string | undefined;

    // Handle profile image upload if provided
    if (updateData.profileImage) {
      const fileName = `profiles/${userId}/profile-image-${Date.now()}`;
      const uploadResult = await uploadFile(updateData.profileImage, fileName);
      profileImageUrl = uploadResult.url;
    }

    const profileData: ProfileUpdateData = {
      ...(updateData.name && { name: updateData.name }),
      ...(profileImageUrl && { profileImage: profileImageUrl }),
    };

    await upsertUserProfile(userId, profileData);
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Real-time profile subscription
export const subscribeToUserProfile = (
  userId: string,
  callback: (profile: UserProfile | null) => void
) => {
  return subscribeToDocument<UserProfile>(COLLECTION_NAME, userId, callback);
};
