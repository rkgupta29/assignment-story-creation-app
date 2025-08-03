// Client-side Cloudinary service that uses Next.js API routes
export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  bytes: number;
  duration?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface CloudinaryFileInfo {
  public_id: string;
  format: string;
  resource_type: string;
  bytes: number;
  url: string;
  secure_url: string;
  created_at: string;
  tags: string[];
  context?: Record<string, string>;
  duration?: number;
  [key: string]: unknown;
}

// Upload file to Cloudinary via API route
export const uploadFileToCloudinary = async (
  file: File,
  options: {
    folder?: string;
    public_id?: string;
    tags?: string[];
    onProgress?: (progress: number) => void;
  } = {}
): Promise<CloudinaryUploadResult> => {
  try {
    // Validate file
    if (!file || file.size === 0) {
      throw new Error("Invalid file: File is empty or undefined");
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(
        `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max: 50MB)`
      );
    }

    console.log("Starting Cloudinary upload via API:", {
      fileName: file.name,
      fileType: file.type,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      folder: options.folder,
    });

    // Create FormData for the upload
    const formData = new FormData();
    formData.append("file", file);

    if (options.folder) {
      formData.append("folder", options.folder);
    }
    if (options.public_id) {
      formData.append("public_id", options.public_id);
    }
    if (options.tags && options.tags.length > 0) {
      formData.append("tags", JSON.stringify(options.tags));
    }

    // Upload with progress tracking
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable && options.onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            options.onProgress(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.success) {
                console.log("Cloudinary upload successful:", response.data);
                resolve(response.data);
              } else {
                reject(new Error(response.error || "Upload failed"));
              }
            } catch {
              reject(new Error("Failed to parse response"));
            }
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        xhr.open("POST", "/api/cloudinary/upload");
        xhr.send(formData);
      }
    );

    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);

    // Reset progress on error
    if (options.onProgress) {
      options.onProgress(0);
    }

    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`Upload failed: ${String(error)}`);
    }
  }
};

// Specialized function for audio file uploads
export const uploadAudioFileToCloudinary = async (
  file: File,
  authorId: string,
  storyTitle: string,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  try {
    // Validate audio file type
    const audioMimeTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/webm",
      "audio/mp4",
      "audio/m4a",
      "audio/aac",
      "audio/flac",
    ];

    // Extract base MIME type
    const baseMimeType = file.type.split(";")[0].toLowerCase();

    if (!audioMimeTypes.includes(baseMimeType)) {
      throw new Error(
        `Unsupported audio format: ${baseMimeType}. Please use MP3, WAV, OGG, WebM, M4A, AAC, or FLAC.`
      );
    }

    // Generate unique public_id
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedTitle = storyTitle
      .replace(/[^a-zA-Z0-9]/g, "-")
      .substring(0, 50);
    const publicId = `${sanitizedTitle}-${timestamp}-${randomString}`;

    // Generate folder path
    const sanitizedAuthorId = authorId.replace(/[^a-zA-Z0-9]/g, "-");
    const folder = `stories/${sanitizedAuthorId}/audio`;

    // Upload options for audio
    const uploadOptions = {
      folder,
      public_id: publicId,
      tags: ["story", "audio", "voice", authorId],
      onProgress,
    };

    return await uploadFileToCloudinary(file, uploadOptions);
  } catch (error) {
    console.error("Error uploading audio file to Cloudinary:", error);
    throw error;
  }
};

// Delete file from Cloudinary via API route
export const deleteFileFromCloudinary = async (
  publicId: string
): Promise<void> => {
  try {
    console.log("Deleting file from Cloudinary:", publicId);

    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_id: publicId }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Delete failed");
    }

    console.log("File deleted successfully:", result);
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw error;
  }
};

// Check if Cloudinary is properly configured (client-side check)
export const isCloudinaryAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/cloudinary/config");
    const result = await response.json();
    return result.available === true;
  } catch (error) {
    console.error("Error checking Cloudinary availability:", error);
    return false;
  }
};

// Get file info from Cloudinary via API route
export const getFileInfo = async (
  publicId: string
): Promise<CloudinaryFileInfo> => {
  try {
    const response = await fetch(
      `/api/cloudinary/info?public_id=${encodeURIComponent(publicId)}`
    );
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to get file info");
    }

    return result.data;
  } catch (error) {
    console.error("Error getting file info:", error);
    throw error;
  }
};
