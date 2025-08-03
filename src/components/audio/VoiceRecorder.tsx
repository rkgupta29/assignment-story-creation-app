"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mic,
  Square,
  Play,
  Pause,
  Upload,
  Trash2,
  Download,
} from "lucide-react";
import { testAudioFormats, testBrowserCapabilities } from "@/utils/audio-test";
import { runCloudinaryTests } from "@/utils/cloudinary-test";

interface VoiceRecorderProps {
  onAudioReady: (audioFile: File) => void;
  className?: string;
}

export function VoiceRecorder({
  onAudioReady,
  className = "",
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Run diagnostics on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("VoiceRecorder: Running diagnostics...");

      // Test browser capabilities
      testBrowserCapabilities();

      // Test audio format support
      testAudioFormats();

      // Test Cloudinary configuration (async)
      runCloudinaryTests().catch(console.error);
    }
  }, []);

  const getSupportedMimeType = () => {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/ogg",
      "audio/mp4",
      "audio/mpeg",
      "audio/wav",
    ];

    console.log("Checking supported MIME types...");

    for (const type of types) {
      const isSupported = MediaRecorder.isTypeSupported(type);
      console.log(`${type}: ${isSupported ? "supported" : "not supported"}`);
      if (isSupported) {
        console.log(`Selected MIME type: ${type}`);
        return type;
      }
    }

    console.log("No supported MIME type found, using fallback: audio/webm");
    return "audio/webm"; // Fallback
  };

  const startRecording = useCallback(async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Create blob with the correct MIME type
        const blob = new Blob(chunks, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Determine file extension based on MIME type
        let extension = "webm";
        if (mimeType.includes("ogg")) extension = "ogg";
        else if (mimeType.includes("mp4")) extension = "mp4";
        else if (mimeType.includes("wav")) extension = "wav";
        else if (mimeType.includes("mp3") || mimeType.includes("mpeg"))
          extension = "mp3";

        // Create file from blob
        const file = new File(
          [blob],
          `voice-story-${Date.now()}.${extension}`,
          {
            type: mimeType,
          }
        );

        // Test the recorded file before passing it on
        console.log("Testing recorded file:");
        runCloudinaryTests(file);

        onAudioReady(file);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError("Recording error occurred. Please try again.");
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError(
        "Could not access microphone. Please check permissions and try again."
      );
    }
  }, [onAudioReady]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  }, [isRecording]);

  const playAudio = useCallback(() => {
    if (audioUrl && audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayerRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setError("Could not play audio. Please try again.");
        });
        setIsPlaying(true);
      }
    }
  }, [audioUrl, isPlaying]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        console.log("File selected for upload:");

        // Run Cloudinary-specific file validation
        const cloudinaryTest = await runCloudinaryTests(file);

        if (!cloudinaryTest.validation?.isValid) {
          if (!cloudinaryTest.validation?.type.valid) {
            setError(
              `Please select a valid audio file. Detected format: ${cloudinaryTest.validation?.type.detected}`
            );
          } else if (!cloudinaryTest.validation?.size.valid) {
            setError(
              `File too large. Size: ${cloudinaryTest.validation?.size.mb.toFixed(
                2
              )}MB (max: ${cloudinaryTest.validation?.size.maxMb}MB)`
            );
          }
          return;
        }

        // Check if Cloudinary is properly configured
        if (!cloudinaryTest.config.isAvailable) {
          setError(
            "Cloudinary is not properly configured. Please check your environment variables."
          );
          console.error(
            "Cloudinary configuration issue:",
            cloudinaryTest.config
          );
          return;
        }

        setError(null);
        setUploadedFile(file);
        setAudioUrl(URL.createObjectURL(file));
        setAudioBlob(null); // Clear recorded blob
        onAudioReady(file);
      }
    },
    [onAudioReady]
  );

  const clearAudio = useCallback(() => {
    setAudioBlob(null);
    setAudioUrl(null);
    setUploadedFile(null);
    setIsPlaying(false);
    setRecordingTime(0);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const downloadAudio = useCallback(() => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = uploadedFile?.name || `voice-story-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [audioUrl, uploadedFile]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Error Display */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <Button
              type="button"
              onClick={startRecording}
              variant="outline"
              size="sm"
              disabled={!!audioUrl}
              className="flex items-center gap-2"
            >
              <Mic className="h-4 w-4" />
              Start Recording
            </Button>
          ) : (
            <Button
              type="button"
              onClick={stopRecording}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Stop Recording
            </Button>
          )}
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 text-red-600">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            <span className="font-mono text-sm">
              {formatTime(recordingTime)}
            </span>
          </div>
        )}
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Or upload an audio file</Label>
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.ogg,.webm,.mp4,.m4a"
            onChange={handleFileUpload}
            disabled={isRecording || !!audioBlob}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isRecording || !!audioBlob}
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Supported formats: MP3, WAV, OGG, WebM, MP4, M4A (max 50MB)
        </p>
      </div>

      {/* Audio Player */}
      {audioUrl && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {uploadedFile?.name || "Recorded Audio"}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={playAudio}
                className="flex items-center gap-1"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadAudio}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAudio}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <audio
            ref={audioPlayerRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              setError("Error loading audio. Please try a different file.");
              setIsPlaying(false);
            }}
            className="w-full"
            controls
            preload="metadata"
          />
        </div>
      )}
    </div>
  );
}
