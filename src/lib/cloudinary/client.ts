export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  bytes: number;
  duration?: number;
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

export const uploadFileToCloudinary = async (
  file: File,
  options: {
    folder?: string;
    public_id?: string;
    tags?: string[];
    onProgress?: (progress: number) => void;
  } = {}
): Promise<CloudinaryUploadResult> => {
  if (!file || file.size === 0) {
    throw new Error("Invalid file: File is empty or undefined");
  }

  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(
      `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max: 50MB)`
    );
  }

  const formData = new FormData();
  formData.append("file", file);

  if (options.folder) formData.append("folder", options.folder);
  if (options.public_id) formData.append("public_id", options.public_id);
  if (options.tags?.length)
    formData.append("tags", JSON.stringify(options.tags));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

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
  });
};

export const uploadAudioFileToCloudinary = async (
  file: File,
  authorId: string,
  storyTitle: string,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
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

  const baseMimeType = file.type.split(";")[0].toLowerCase();

  if (!audioMimeTypes.includes(baseMimeType)) {
    throw new Error(
      `Unsupported audio format: ${baseMimeType}. Please use MP3, WAV, OGG, WebM, M4A, AAC, or FLAC.`
    );
  }

  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const sanitizedTitle = storyTitle
    .replace(/[^a-zA-Z0-9]/g, "-")
    .substring(0, 50);
  const publicId = `${sanitizedTitle}-${timestamp}-${randomString}`;
  const sanitizedAuthorId = authorId.replace(/[^a-zA-Z0-9]/g, "-");
  const folder = `stories/${sanitizedAuthorId}/audio`;

  return uploadFileToCloudinary(file, {
    folder,
    public_id: publicId,
    tags: ["story", "audio", "voice", authorId],
    onProgress,
  });
};

export const deleteFileFromCloudinary = async (
  publicId: string
): Promise<void> => {
  const response = await fetch("/api/cloudinary/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_id: publicId }),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Delete failed");
  }
};

export const isCloudinaryAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/cloudinary/config");
    const result = await response.json();
    return result.available === true;
  } catch {
    return false;
  }
};

export const getFileInfo = async (
  publicId: string
): Promise<CloudinaryFileInfo> => {
  const response = await fetch(
    `/api/cloudinary/info?public_id=${encodeURIComponent(publicId)}`
  );
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to get file info");
  }

  return result.data;
};
