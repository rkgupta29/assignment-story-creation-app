import React from "react";
import { ProfileCompletionStatus } from "@/types/profile";
import { Check, AlertCircle } from "lucide-react";

interface ProfileProgressProps {
  currentStep: number;
  totalSteps: number;
  completionStatus: ProfileCompletionStatus | null;
  onStepClick: (stepIndex: number) => void;
}

const STEP_LABELS = [
  "Basic Info",
  "Contact",
  "Location",
  "Professional",
  "Experience",
  "Education",
  "Resume",
  "Salary",
  "Skills",
];

export default function ProfileProgress({
  currentStep,
  totalSteps,
  completionStatus,
  onStepClick,
}: ProfileProgressProps) {
  const getStepStatus = (stepIndex: number) => {
    if (!completionStatus) return "pending";

    const stepKeys = [
      "basicInfo",
      "contactInfo",
      "locationInfo",
      "professionalInfo",
      "experience",
      "education",
      "resume",
      "salaryInfo",
      "skills",
    ];

    const stepKey = stepKeys[stepIndex];
    return completionStatus[stepKey as keyof ProfileCompletionStatus]
      ? "completed"
      : "pending";
  };

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between mt-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const status = getStepStatus(index);
          const isCurrent = index === currentStep;

          return (
            <button
              key={index}
              onClick={() => onStepClick(index)}
              className={`flex flex-col items-center space-y-2 ${
                isCurrent ? "text-blue-600" : "text-gray-500"
              } hover:text-blue-600 transition-colors`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isCurrent
                    ? "border-blue-600 bg-blue-600 text-white"
                    : status === "completed"
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {status === "completed" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span className="text-xs font-medium hidden sm:block">
                {STEP_LABELS[index]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Completion Status */}
      {completionStatus && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
              <span className="text-sm font-medium text-blue-900">
                Profile Completion
              </span>
            </div>
            <span className="text-sm font-semibold text-blue-900">
              {completionStatus.percentage}%
            </span>
          </div>
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {Object.entries(completionStatus)
                .filter(([key]) => key !== "overall" && key !== "percentage")
                .map(([key, completed]) => (
                  <span
                    key={key}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      completed
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {completed ? (
                      <Check className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    )}
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
