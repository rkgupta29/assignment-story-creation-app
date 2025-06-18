import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  StorageReference,
  UploadResult,
} from "firebase/storage";
import { storage } from "./config";

// Upload file to storage
export const uploadFile = async (
  file: File,
  path: string,
  metadata?: { contentType?: string; customMetadata?: Record<string, string> }
): Promise<{ url: string; ref: StorageReference }> => {
  try {
    const storageRef = ref(storage, path);
    const uploadResult: UploadResult = await uploadBytes(
      storageRef,
      file,
      metadata
    );
    const downloadURL = await getDownloadURL(uploadResult.ref);

    return {
      url: downloadURL,
      ref: uploadResult.ref,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (
  files: File[],
  basePath: string,
  metadata?: { contentType?: string; customMetadata?: Record<string, string> }
): Promise<Array<{ url: string; ref: StorageReference; fileName: string }>> => {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${Date.now()}_${index}_${file.name}`;
      const filePath = `${basePath}/${fileName}`;
      const result = await uploadFile(file, filePath, metadata);

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
  } = {}
): Promise<{ url: string; ref: StorageReference }> => {
  const { allowedTypes, maxSizeInMB, metadata } = options;

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

  return await uploadFile(file, path, metadata);
};
