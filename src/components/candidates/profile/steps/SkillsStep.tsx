import React from "react";
import { CandidateProfile } from "@/types/profile";
import { Code } from "lucide-react";

interface SkillsStepProps {
  profile: CandidateProfile | null;
  onComplete: (data: Partial<CandidateProfile>) => void;
  onBack: () => void;
  saving: boolean;
  isLastStep: boolean;
}

export default function SkillsStep({
  onComplete,
  onBack,
  saving,
  isLastStep,
}: SkillsStepProps) {
  const handleSkip = () => {
    onComplete({});
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Code className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Skills & Languages
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          This step will allow you to add your skills and language
          proficiencies. For now, you can skip this step and add it later.
        </p>
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

        <div className="space-x-3">
          <button
            type="button"
            onClick={handleSkip}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Skip for now
          </button>

          <button
            type="button"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? "Saving..."
              : isLastStep
              ? "Complete Profile"
              : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}
