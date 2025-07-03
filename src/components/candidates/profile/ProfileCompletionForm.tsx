import React, { useState, useEffect } from "react";
import { CandidateProfile, ProfileCompletionStatus } from "@/types/profile";
import {
  getCandidateProfile,
  subscribeToProfile,
} from "@/lib/firebase/profile";
import { getProfileSectionStatus } from "@/lib/utils/profile-utils";
import BasicInfoStep from "./steps/BasicInfoStep";
import ContactInfoStep from "./steps/ContactInfoStep";
import LocationInfoStep from "./steps/LocationInfoStep";
import ProfessionalInfoStep from "./steps/ProfessionalInfoStep";
import ExperienceStep from "./steps/ExperienceStep";
import EducationStep from "./steps/EducationStep";
import ResumeStep from "./steps/ResumeStep";
import SalaryInfoStep from "./steps/SalaryInfoStep";
import SkillsStep from "./steps/SkillsStep";
import ProfileProgress from "./ProfileProgress";

interface ProfileCompletionFormProps {
  candidateId: string;
  onComplete?: () => void;
}

const STEPS = [
  { id: "basicInfo", title: "Basic Information", component: BasicInfoStep },
  {
    id: "contactInfo",
    title: "Contact Information",
    component: ContactInfoStep,
  },
  { id: "locationInfo", title: "Location", component: LocationInfoStep },
  {
    id: "professionalInfo",
    title: "Professional Summary",
    component: ProfessionalInfoStep,
  },
  { id: "experience", title: "Work Experience", component: ExperienceStep },
  { id: "education", title: "Education", component: EducationStep },
  { id: "resume", title: "Resume", component: ResumeStep },
  { id: "salaryInfo", title: "Salary Information", component: SalaryInfoStep },
  { id: "skills", title: "Skills & Languages", component: SkillsStep },
];

export default function ProfileCompletionForm({
  candidateId,
  onComplete,
}: ProfileCompletionFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completionStatus, setCompletionStatus] =
    useState<ProfileCompletionStatus | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await getCandidateProfile(candidateId);
        setProfile(profileData);

        if (profileData) {
          const status = getProfileSectionStatus(profileData);
          setCompletionStatus(status);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToProfile(candidateId, (updatedProfile) => {
      setProfile(updatedProfile);
      if (updatedProfile) {
        const status = getProfileSectionStatus(updatedProfile);
        setCompletionStatus(status);
      }
    });

    return () => unsubscribe();
  }, [candidateId]);

  const handleStepComplete = async (stepData: any) => {
    setSaving(true);
    try {
      // Update profile with step data
      if (profile) {
        const updatedProfile = { ...profile, ...stepData };
        setProfile(updatedProfile);

        // Update completion status
        const status = getProfileSectionStatus(updatedProfile);
        setCompletionStatus(status);

        // Move to next step if not the last step
        if (currentStep < STEPS.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          // Profile is complete
          onComplete?.();
        }
      }
    } catch (error) {
      console.error("Error saving step data:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepJump = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Let's build your professional profile step by step
          </p>
        </div>

        {/* Progress Bar */}
        <ProfileProgress
          currentStep={currentStep}
          totalSteps={STEPS.length}
          completionStatus={completionStatus}
          onStepClick={handleStepJump}
        />

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Step Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {STEPS[currentStep].title}
            </h2>
            <p className="text-gray-600 mt-1">
              Step {currentStep + 1} of {STEPS.length}
            </p>
          </div>

          {/* Step Content */}
          <CurrentStepComponent
            profile={profile}
            onComplete={handleStepComplete}
            onBack={handleStepBack}
            saving={saving}
            isLastStep={currentStep === STEPS.length - 1}
          />
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleStepBack}
            disabled={currentStep === 0 || saving}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="text-sm text-gray-500">
            {completionStatus && (
              <span>Profile {completionStatus.percentage}% complete</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
