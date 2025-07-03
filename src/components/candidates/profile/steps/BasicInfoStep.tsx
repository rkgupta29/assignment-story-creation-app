import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CandidateProfile, Gender } from "@/types/profile";
import { validateProfileImage } from "@/lib/utils/profile-utils";
import { Upload, User } from "lucide-react";

const basicInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  gender: z.nativeEnum(Gender).optional(),
  profileImage: z.instanceof(File).optional(),
});

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

interface BasicInfoStepProps {
  profile: CandidateProfile | null;
  onComplete: (data: Partial<CandidateProfile>) => void;
  onBack: () => void;
  saving: boolean;
  isLastStep: boolean;
}

export default function BasicInfoStep({
  profile,
  onComplete,
  onBack,
  saving,
  isLastStep,
}: BasicInfoStepProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    profile?.profileImage || null
  );
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      fullName: profile?.fullName || "",
      gender: profile?.gender,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateProfileImage(file);
    if (validationError) {
      setImageError(validationError);
      return;
    }

    setImageError(null);
    setValue("profileImage", file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: BasicInfoFormData) => {
    try {
      const updateData: Partial<CandidateProfile> = {
        fullName: data.fullName,
        gender: data.gender,
      };

      // Note: profileImage will be handled by the parent component
      // since it needs to be uploaded to Firebase Storage first

      onComplete(updateData);
    } catch (error) {
      console.error("Error saving basic info:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Image */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Profile Picture
        </label>

        <div className="flex items-center space-x-6">
          {/* Image Preview */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Upload Button */}
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-600">
              Upload a professional photo (JPEG, PNG, or WebP, max 5MB)
            </p>
            {imageError && (
              <p className="text-sm text-red-600 mt-1">{imageError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          {...register("fullName")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700"
        >
          Gender
        </label>
        <select
          id="gender"
          {...register("gender")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select gender</option>
          <option value={Gender.MALE}>Male</option>
          <option value={Gender.FEMALE}>Female</option>
          <option value={Gender.OTHER}>Other</option>
          <option value={Gender.PREFER_NOT_TO_SAY}>Prefer not to say</option>
        </select>
        {errors.gender && (
          <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back
        </button>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : isLastStep ? "Complete Profile" : "Next Step"}
        </button>
      </div>
    </form>
  );
}
