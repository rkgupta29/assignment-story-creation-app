import { isCloudinaryAvailable } from "../lib/cloudinary/client";

export const testCloudinaryConfig = async () => {
  console.log("=== Cloudinary Configuration Test ===");

  try {
    const isAvailable = await isCloudinaryAvailable();

    const config = {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      isAvailable,
    };

    console.log("Cloud Name:", config.cloudName || "❌ Missing");
    console.log("Overall Available:", config.isAvailable ? "✅ Yes" : "❌ No");

    if (!config.isAvailable) {
      console.warn("⚠️ Cloudinary is not properly configured!");
      console.warn("Please check your environment variables in .env.local");
      console.warn("Required variables:");
      console.warn("- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
      console.warn("- CLOUDINARY_API_KEY");
      console.warn("- CLOUDINARY_API_SECRET");
    }

    return config;
  } catch (error) {
    console.error("Failed to check Cloudinary configuration:", error);
    return { cloudName: null, isAvailable: false, error };
  }
};

export const testFileValidation = (file: File) => {
  console.log("=== File Validation Test ===");

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
  const isValidType = audioMimeTypes.includes(baseMimeType);
  const maxSize = 50 * 1024 * 1024;
  const isValidSize = file.size <= maxSize && file.size > 0;

  console.log("File name:", file.name);
  console.log("File type:", file.type);
  console.log("Base MIME type:", baseMimeType);
  console.log("File size:", `${(file.size / 1024 / 1024).toFixed(2)} MB`);
  console.log("Type validation:", isValidType ? "✅ Valid" : "❌ Invalid");
  console.log("Size validation:", isValidSize ? "✅ Valid" : "❌ Invalid");
  console.log(
    "Overall valid:",
    isValidType && isValidSize ? "✅ Yes" : "❌ No"
  );

  if (!isValidType) {
    console.warn(`⚠️ Unsupported file type: ${baseMimeType}`);
    console.warn("Supported types:", audioMimeTypes);
  }

  if (!isValidSize) {
    if (file.size === 0) {
      console.warn("⚠️ File is empty");
    } else {
      console.warn(
        `⚠️ File too large: ${(file.size / 1024 / 1024).toFixed(
          2
        )}MB (max: 50MB)`
      );
    }
  }

  return {
    isValid: isValidType && isValidSize,
    type: {
      valid: isValidType,
      detected: baseMimeType,
      allowed: audioMimeTypes,
    },
    size: {
      valid: isValidSize,
      bytes: file.size,
      mb: file.size / 1024 / 1024,
      maxMb: 50,
    },
  };
};

export const generateTestFileInfo = (file: File) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = file.name.split(".").pop() || "audio";

  const testAuthorId = "test-author-123";
  const testStoryTitle = "Test Story Title";
  const sanitizedTitle = testStoryTitle
    .replace(/[^a-zA-Z0-9]/g, "-")
    .substring(0, 50);
  const sanitizedAuthorId = testAuthorId.replace(/[^a-zA-Z0-9]/g, "-");

  const folder = `stories/${sanitizedAuthorId}/audio`;
  const publicId = `${sanitizedTitle}-${timestamp}-${randomString}`;
  const fullPath = `${folder}/${publicId}.${fileExtension}`;

  console.log("=== Generated File Info ===");
  console.log("Folder:", folder);
  console.log("Public ID:", publicId);
  console.log("Full path:", fullPath);
  console.log("File extension:", fileExtension);

  return { folder, publicId, fullPath, fileExtension, timestamp, randomString };
};

export const runCloudinaryTests = async (file?: File) => {
  console.log("🧪 Running Cloudinary Tests...\n");

  const configResult = await testCloudinaryConfig();
  console.log("\n");

  if (file) {
    const validationResult = testFileValidation(file);
    console.log("\n");

    const fileInfo = generateTestFileInfo(file);
    console.log("\n");

    return { config: configResult, validation: validationResult, fileInfo };
  }

  return { config: configResult };
};
