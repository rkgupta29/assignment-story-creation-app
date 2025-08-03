import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  StorageReference,
  UploadResult,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import { storage } from "./config";

// Upload file to storage with progress tracking
export const uploadFile = async (
  file: File,
  path: string,
  metadata?: { contentType?: string; customMetadata?: Record<string, string> },
  onProgress?: (progress: number) => void
): Promise<{ url: string; ref: StorageReference }> => {
  try {
    const storageRef = ref(storage, path);

    // Set content type based on file type if not provided
    const uploadMetadata = {
      contentType: file.type,
      ...metadata,
    };

    // Use resumable upload for better reliability with large files
    if (file.size > 1024 * 1024) {
      // Files larger than 1MB
      return new Promise((resolve, reject) => {
        const uploadTask: UploadTask = uploadBytesResumable(
          storageRef,
          file,
          uploadMetadata
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.(progress);
          },
          (error) => {
            console.error("Upload error:", error);

            // Provide more specific error messages
            let errorMessage = "Upload failed. Please try again.";

            if (error.code === "storage/unauthorized") {
              errorMessage =
                "You don't have permission to upload files. Please check your authentication.";
            } else if (error.code === "storage/canceled") {
              errorMessage = "Upload was canceled.";
            } else if (error.code === "storage/quota-exceeded") {
              errorMessage = "Storage quota exceeded. Please try again later.";
            } else if (error.code === "storage/retry-limit-exceeded") {
              errorMessage =
                "Upload failed after multiple retries. Please check your connection.";
            } else if (error.code === "storage/invalid-format") {
              errorMessage =
                "Invalid file format. Please upload a supported audio file.";
            } else if (error.code === "storage/invalid-url") {
              errorMessage =
                "Storage configuration error. Please contact support.";
            }

            reject(new Error(errorMessage));
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                url: downloadURL,
                ref: uploadTask.snapshot.ref,
              });
            } catch (urlError) {
              console.error("Error getting download URL:", urlError);
              reject(
                new Error(
                  "Upload completed but failed to get download URL. Please try again."
                )
              );
            }
          }
        );
      });
    } else {
      // Use regular upload for smaller files
      const uploadResult: UploadResult = await uploadBytes(
        storageRef,
        file,
        uploadMetadata
      );
      const downloadURL = await getDownloadURL(uploadResult.ref);

      return {
        url: downloadURL,
        ref: uploadResult.ref,
      };
    }
  } catch (error: unknown) {
    console.error("Error uploading file:", error);

    // Handle specific Firebase Storage errors
    let errorMessage = "Upload failed. Please try again.";

    const err = error as { code?: string; message?: string };

    if (err.code === "storage/object-not-found") {
      errorMessage = "File not found. Please try uploading again.";
    } else if (err.code === "storage/bucket-not-found") {
      errorMessage = "Storage bucket not found. Please contact support.";
    } else if (err.code === "storage/project-not-found") {
      errorMessage = "Project configuration error. Please contact support.";
    } else if (err.code === "storage/quota-exceeded") {
      errorMessage = "Storage quota exceeded. Please try again later.";
    } else if (err.code === "storage/unauthenticated") {
      errorMessage = "Please log in to upload files.";
    } else if (err.code === "storage/unauthorized") {
      errorMessage = "You don't have permission to upload files.";
    } else if (err.code === "storage/retry-limit-exceeded") {
      errorMessage =
        "Upload failed after multiple retries. Please check your connection.";
    } else if (err.code === "storage/invalid-argument") {
      errorMessage = "Invalid file. Please try a different file.";
    } else if (err.code === "storage/no-default-bucket") {
      errorMessage = "Storage not configured. Please contact support.";
    } else if (err.code === "storage/cannot-slice-blob") {
      errorMessage = "File processing error. Please try a different file.";
    } else if (err.code === "storage/server-file-wrong-size") {
      errorMessage = "File size mismatch. Please try uploading again.";
    } else if (err.message?.includes("CORS")) {
      errorMessage =
        "Network configuration error. Please try again or contact support.";
    } else if (err.message?.includes("XMLHttpRequest")) {
      errorMessage =
        "Network error. Please check your connection and try again.";
    }

    throw new Error(errorMessage);
  }
};

// Upload audio file with specific validation and handling
export const uploadAudioFile = async (
  file: File,
  authorId: string,
  storyTitle: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; ref: StorageReference }> => {
  try {
    // Validate file type - handle both base types and codec specifications
    const allowedBaseTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/webm",
      "audio/mp4",
      "audio/m4a",
      "audio/aac",
    ];

    // Extract base MIME type (remove codec specifications)
    const baseMimeType = file.type.split(";")[0].toLowerCase();

    if (!allowedBaseTypes.includes(baseMimeType)) {
      throw new Error(
        `Unsupported audio format: ${baseMimeType}. Please use MP3, WAV, OGG, WebM, MP4, or M4A.`
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error("Audio file too large. Maximum size is 50MB.");
    }

    if (file.size === 0) {
      throw new Error("File is empty. Please select a valid audio file.");
    }

    // Generate unique file path
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop() || "audio";
    const sanitizedTitle = storyTitle
      .replace(/[^a-zA-Z0-9]/g, "-")
      .substring(0, 50);
    const fileName = `${sanitizedTitle}-${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `stories/${authorId}/audio/${fileName}`;

    // Upload with metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        authorId: authorId,
        storyTitle: storyTitle,
      },
    };

    return await uploadFile(file, filePath, metadata, onProgress);
  } catch (error) {
    console.error("Error uploading audio file:", error);
    throw error;
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (
  files: File[],
  basePath: string,
  metadata?: { contentType?: string; customMetadata?: Record<string, string> },
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<Array<{ url: string; ref: StorageReference; fileName: string }>> => {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${Date.now()}_${index}_${file.name}`;
      const filePath = `${basePath}/${fileName}`;
      const result = await uploadFile(file, filePath, metadata, (progress) =>
        onProgress?.(index, progress)
      );

      return {
        ...result,
        fileName,
      };
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error;
  }
};

// Get download URL for a file
export const getFileDownloadURL = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error getting download URL:", error);
    throw error;
  }
};

// Delete file from storage
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

// Delete multiple files
export const deleteMultipleFiles = async (paths: string[]): Promise<void> => {
  try {
    const deletePromises = paths.map((path) => deleteFile(path));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting multiple files:", error);
    throw error;
  }
};

// List all files in a directory
export const listFiles = async (path: string): Promise<StorageReference[]> => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    return result.items;
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
};

// Get file metadata
export const getFileMetadata = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    // Note: Firebase Storage doesn't have a direct getMetadata method in v9
    // You can get the download URL and infer some metadata
    const downloadURL = await getDownloadURL(storageRef);
    return { downloadURL, path };
  } catch (error) {
    console.error("Error getting file metadata:", error);
    throw error;
  }
};

// Generate unique file path
export const generateUniqueFilePath = (
  originalName: string,
  basePath: string
): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = originalName.split(".").pop();
  const fileName = `${timestamp}_${randomString}.${fileExtension}`;

  return `${basePath}/${fileName}`;
};

// Validate file type
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type);
};

// Validate file size
export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// File upload with validation
export const uploadFileWithValidation = async (
  file: File,
  path: string,
  options: {
    allowedTypes?: string[];
    maxSizeInMB?: number;
    metadata?: {
      contentType?: string;
      customMetadata?: Record<string, string>;
    };
    onProgress?: (progress: number) => void;
  } = {}
): Promise<{ url: string; ref: StorageReference }> => {
  const { allowedTypes, maxSizeInMB, metadata, onProgress } = options;

  // Validate file type
  if (allowedTypes && !validateFileType(file, allowedTypes)) {
    throw new Error(
      `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`
    );
  }

  // Validate file size
  if (maxSizeInMB && !validateFileSize(file, maxSizeInMB)) {
    throw new Error(`File too large. Maximum size: ${maxSizeInMB}MB`);
  }

  return await uploadFile(file, path, metadata, onProgress);
};

// Check if Firebase Storage is available
export const isStorageAvailable = (): boolean => {
  try {
    return !!storage;
  } catch (error) {
    console.error("Firebase Storage not available:", error);
    return false;
  }
};
