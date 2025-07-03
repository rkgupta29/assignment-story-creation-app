import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CandidateProfile } from "@/types/profile";
import {
  COMMON_INDUSTRIES,
  WORK_EXPERIENCE_OPTIONS,
  NOTICE_PERIOD_OPTIONS,
} from "@/lib/utils/profile-utils";
import { Briefcase, Clock, Building } from "lucide-react";

const professionalInfoSchema = z.object({
  totalWorkExperience: z.number().min(0, "Work experience must be 0 or more"),
  industry: z.string().min(1, "Industry is required"),
  noticePeriod: z.number().min(0, "Notice period must be 0 or more"),
});

type ProfessionalInfoFormData = z.infer<typeof professionalInfoSchema>;

interface ProfessionalInfoStepProps {
  profile: CandidateProfile | null;
  onComplete: (data: Partial<CandidateProfile>) => void;
  onBack: () => void;
  saving: boolean;
  isLastStep: boolean;
}

export default function ProfessionalInfoStep({
  profile,
  onComplete,
  onBack,
  saving,
  isLastStep,
}: ProfessionalInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfessionalInfoFormData>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      totalWorkExperience: profile?.totalWorkExperience || 0,
      industry: profile?.industry || "",
      noticePeriod: profile?.noticePeriod || 30,
    },
  });

  const onSubmit = async (data: ProfessionalInfoFormData) => {
    try {
      const updateData: Partial<CandidateProfile> = {
        totalWorkExperience: data.totalWorkExperience,
        industry: data.industry,
        noticePeriod: data.noticePeriod,
      };

      onComplete(updateData);
    } catch (error) {
      console.error("Error saving professional info:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Work Experience */}
      <div>
        <label
          htmlFor="totalWorkExperience"
          className="block text-sm font-medium text-gray-700"
        >
          Total Work Experience *
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="totalWorkExperience"
            {...register("totalWorkExperience", { valueAsNumber: true })}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {WORK_EXPERIENCE_OPTIONS.map((years) => (
              <option key={years} value={years}>
                {years === 0
                  ? "Fresher"
                  : years === 1
                  ? "1 year"
                  : `${years} years`}
              </option>
            ))}
          </select>
        </div>
        {errors.totalWorkExperience && (
          <p className="mt-1 text-sm text-red-600">
            {errors.totalWorkExperience.message}
          </p>
        )}
      </div>

      {/* Industry */}
      <div>
        <label
          htmlFor="industry"
          className="block text-sm font-medium text-gray-700"
        >
          Industry *
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="industry"
            {...register("industry")}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select industry</option>
            {COMMON_INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
        {errors.industry && (
          <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
        )}
      </div>

      {/* Notice Period */}
      <div>
        <label
          htmlFor="noticePeriod"
          className="block text-sm font-medium text-gray-700"
        >
          Notice Period *
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="noticePeriod"
            {...register("noticePeriod", { valueAsNumber: true })}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {NOTICE_PERIOD_OPTIONS.map((days) => (
              <option key={days} value={days}>
                {days === 0
                  ? "Immediate"
                  : days === 30
                  ? "1 month"
                  : days === 60
                  ? "2 months"
                  : days === 90
                  ? "3 months"
                  : days === 180
                  ? "6 months"
                  : `${days} days`}
              </option>
            ))}
          </select>
        </div>
        {errors.noticePeriod && (
          <p className="mt-1 text-sm text-red-600">
            {errors.noticePeriod.message}
          </p>
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
