// Audio format validation test utility
export const testAudioFormats = () => {
  console.log("=== Audio Format Support Test ===");

  const formats = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4",
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/m4a",
    "audio/aac",
  ];

  const supportedFormats: string[] = [];
  const unsupportedFormats: string[] = [];

  formats.forEach((format) => {
    const isSupported =
      typeof MediaRecorder !== "undefined" &&
      MediaRecorder.isTypeSupported(format);
    if (isSupported) {
      supportedFormats.push(format);
    } else {
      unsupportedFormats.push(format);
    }
    console.log(
      `${format}: ${isSupported ? "✅ Supported" : "❌ Not supported"}`
    );
  });

  console.log("\n=== Summary ===");
  console.log(
    `Supported formats (${supportedFormats.length}):`,
    supportedFormats
  );
  console.log(
    `Unsupported formats (${unsupportedFormats.length}):`,
    unsupportedFormats
  );

  return {
    supported: supportedFormats,
    unsupported: unsupportedFormats,
    hasMediaRecorder: typeof MediaRecorder !== "undefined",
  };
};

export const validateAudioFile = (file: File) => {
  console.log("=== Audio File Validation ===");
  console.log("File name:", file.name);
  console.log("File type:", file.type);
  console.log("File size:", `${(file.size / 1024 / 1024).toFixed(2)} MB`);

  // Extract base MIME type
  const baseMimeType = file.type.split(";")[0].toLowerCase();
  console.log("Base MIME type:", baseMimeType);

  const allowedTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/mp4",
    "audio/m4a",
    "audio/aac",
  ];

  const isValidType = allowedTypes.includes(baseMimeType);
  const maxSize = 50 * 1024 * 1024; // 50MB
  const isValidSize = file.size <= maxSize && file.size > 0;

  console.log("Type validation:", isValidType ? "✅ Valid" : "❌ Invalid");
  console.log("Size validation:", isValidSize ? "✅ Valid" : "❌ Invalid");

  return {
    isValid: isValidType && isValidSize,
    type: {
      valid: isValidType,
      detected: baseMimeType,
      allowed: allowedTypes,
    },
    size: {
      valid: isValidSize,
      bytes: file.size,
      mb: file.size / 1024 / 1024,
      maxMb: 50,
    },
  };
};

export const testBrowserCapabilities = () => {
  console.log("=== Browser Capabilities Test ===");

  const capabilities = {
    mediaRecorder: typeof MediaRecorder !== "undefined",
    getUserMedia: !!(
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    ),
    audioContext:
      typeof AudioContext !== "undefined" ||
      typeof (
        window as typeof window & { webkitAudioContext?: typeof AudioContext }
      ).webkitAudioContext !== "undefined",
    fileAPI: typeof File !== "undefined" && typeof FileReader !== "undefined",
    promises: typeof Promise !== "undefined",
  };

  Object.entries(capabilities).forEach(([feature, supported]) => {
    console.log(
      `${feature}: ${supported ? "✅ Supported" : "❌ Not supported"}`
    );
  });

  return capabilities;
};
