import {
  getDocument,
  addDocumentWithId,
  subscribeToDocument,
} from "./firestore";
import { uploadFile, deleteFile } from "./storage";
import {
  CandidateProfile,
  ProfileCompletionStatus,
  ProfileUpdateData,
  Experience,
  Education,
  Location,
  SalaryInfo,
  Gender,
} from "../../types/profile";

const COLLECTION_NAME = "candidateProfiles";

export const calculateProfileCompletion = (
  profile: Partial<CandidateProfile>
): ProfileCompletionStatus => {
  const sections = {
    basicInfo: !!profile.fullName,
    contactInfo: !!(
      profile.contactInfo?.mobileNumber && profile.contactInfo?.countryCode
    ),
    locationInfo: !!(
      profile.currentLocation?.city && profile.currentLocation?.country
    ),
    professionalInfo: !!(
      profile.totalWorkExperience !== undefined &&
      profile.industry &&
      profile.noticePeriod !== undefined
    ),
    experience: !!(profile.experiences && profile.experiences.length > 0),
    education: !!(profile.education && profile.education.length > 0),
    resume: !!(profile.resumes && profile.resumes.length > 0),
    salaryInfo: !!(
      profile.salaryInfo?.currency && profile.salaryInfo?.salaryPeriod
    ),
    skills: !!(profile.skills && profile.skills.length > 0),
  };

  const completedSections = Object.values(sections).filter(Boolean).length;
  const totalSections = Object.keys(sections).length;
  const percentage = Math.round((completedSections / totalSections) * 100);

  return {
    ...sections,
    overall: percentage === 100,
    percentage,
  };
};

// Get candidate profile
export const getCandidateProfile = async (
  candidateId: string
): Promise<CandidateProfile | null> => {
  try {
    return await getDocument<CandidateProfile>(COLLECTION_NAME, candidateId);
  } catch (error) {
    console.error("Error getting candidate profile:", error);
    throw error;
  }
};

// Create or update candidate profile
export const upsertCandidateProfile = async (
  candidateId: string,
  profileData: ProfileUpdateData
): Promise<void> => {
  try {
    const existingProfile = await getCandidateProfile(candidateId);
    const now = new Date();

    const updatedProfile: CandidateProfile = {
      ...existingProfile,
      ...profileData,
      updatedAt: now,
      lastActiveAt: now,
    } as CandidateProfile;

    // Calculate completion status
    const completionStatus = calculateProfileCompletion(updatedProfile);
    updatedProfile.profileCompletionPercentage = completionStatus.percentage;
    updatedProfile.isProfileComplete = completionStatus.overall;

    await addDocumentWithId(COLLECTION_NAME, candidateId, updatedProfile);
  } catch (error) {
    console.error("Error upserting candidate profile:", error);
    throw error;
  }
};

// Update specific profile sections
export const updateBasicInfo = async (
  candidateId: string,
  basicInfo: { fullName: string; gender?: string; profileImage?: File }
): Promise<void> => {
  try {
    let profileImageUrl: string | undefined;

    // Handle profile image upload if provided
    if (basicInfo.profileImage) {
      const fileName = `profiles/${candidateId}/profile-image-${Date.now()}`;
      const uploadResult = await uploadFile(basicInfo.profileImage, fileName);
      profileImageUrl = uploadResult.url;
    }

    const updateData: ProfileUpdateData = {
      fullName: basicInfo.fullName,
      gender: basicInfo.gender as Gender,
      ...(profileImageUrl && { profileImage: profileImageUrl }),
    };

    await upsertCandidateProfile(candidateId, updateData);
  } catch (error) {
    console.error("Error updating basic info:", error);
    throw error;
  }
};

export const updateContactInfo = async (
  candidateId: string,
  contactInfo: {
    mobileNumber: string;
    countryCode: string;
    contactEmail: string;
  }
): Promise<void> => {
  try {
    const updateData: ProfileUpdateData = {
      contactInfo: {
        ...contactInfo,
        fullPhoneNumber: `${contactInfo.countryCode}${contactInfo.mobileNumber}`,
      },
    };

    await upsertCandidateProfile(candidateId, updateData);
  } catch (error) {
    console.error("Error updating contact info:", error);
    throw error;
  }
};

export const updateLocationInfo = async (
  candidateId: string,
  locationInfo: { currentLocation: Location; preferredLocations: Location[] }
): Promise<void> => {
  try {
    const updateData: ProfileUpdateData = {
      currentLocation: locationInfo.currentLocation,
      preferredLocations: locationInfo.preferredLocations,
    };

    await upsertCandidateProfile(candidateId, updateData);
  } catch (error) {
    console.error("Error updating location info:", error);
    throw error;
  }
};

export const updateProfessionalInfo = async (
  candidateId: string,
  professionalInfo: {
    totalWorkExperience: number;
    industry: string;
    noticePeriod: number;
  }
): Promise<void> => {
  try {
    const updateData: ProfileUpdateData = {
      totalWorkExperience: professionalInfo.totalWorkExperience,
      industry: professionalInfo.industry,
      noticePeriod: professionalInfo.noticePeriod,
    };

    await upsertCandidateProfile(candidateId, updateData);
  } catch (error) {
    console.error("Error updating professional info:", error);
    throw error;
  }
};

// Experience management
export const addExperience = async (
  candidateId: string,
  experience: Omit<Experience, "id">
): Promise<void> => {
  try {
    const existingProfile = await getCandidateProfile(candidateId);
    const newExperience = {
      ...experience,
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedExperiences = [
      ...(existingProfile?.experiences || []),
      newExperience,
    ];

    await upsertCandidateProfile(candidateId, {
      experiences: updatedExperiences,
    });
  } catch (error) {
    console.error("Error adding experience:", error);
    throw error;
  }
};

export const updateExperience = async (
  candidateId: string,
  experienceId: string,
  updatedExperience: Partial<Experience>
): Promise<void> => {
  try {
    const existingProfile = await getCandidateProfile(candidateId);
    const updatedExperiences =
      existingProfile?.experiences?.map((exp) =>
        exp.id === experienceId ? { ...exp, ...updatedExperience } : exp
      ) || [];

    await upsertCandidateProfile(candidateId, {
      experiences: updatedExperiences,
    });
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
};

export const deleteExperience = async (
  candidateId: string,
  experienceId: string
): Promise<void> => {
  try {
    const existingProfile = await getCandidateProfile(candidateId);
    const updatedExperiences =
      existingProfile?.experiences?.filter((exp) => exp.id !== experienceId) ||
      [];

    await upsertCandidateProfile(candidateId, {
      experiences: updatedExperiences,
    });
  } catch (error) {
    console.error("Error deleting experience:", error);
    throw error;
  }
};

// Education management
export const addEducation = async (
  candidateId: string,
  education: Omit<Education, "id">
): Promise<void> => {
  try {
    const existingProfile = await getCandidateProfile(candidateId);
    const newEducation = {
      ...education,
      id: `edu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedEducation = [
      ...(existingProfile?.education || []),
      newEducation,
    ];

    await upsertCandidateProfile(candidateId, {
      education: updatedEducation,
    });
  } catch (error) {
    console.error("Error adding education:", error);
    throw error;
  }
};

export const updateEducation = async (
  candidateId: string,
  educationId: string,
  updatedEducation: Partial<Education>
): Promise<void> => {
  try {
    const existingProfile = await getCandidateProfile(candidateId);
    const updatedEducationList =
      existingProfile?.education?.map((edu) =>
        edu.id === educationId ? { ...edu, ...updatedEducation } : edu
      ) || [];

    await upsertCandidateProfile(candidateId, {
      education: updatedEducationList,
    });
  } catch (error) {
    console.error("Error updating education:", error);
    throw error;
  }
};

export const deleteEducation = async (
  candidateId: string,
  educationId: string
): Promise<void> => {
  try {
    const existingProfile = await getCandidateProfile(candidateId);
    const updatedEducation =
      existingProfile?.education?.filter((edu) => edu.id !== educationId) || [];

    await upsertCandidateProfile(candidateId, {
      education: updatedEducation,
    });
  } catch (error) {
    console.error("Error deleting education:", error);
    throw error;
  }
};

// Resume management
export const uploadResume = async (
  candidateId: string,
  file: File
): Promise<void> => {
  try {
    const fileName = `resumes/${candidateId}/resume-${Date.now()}-${file.name}`;
    const uploadResult = await uploadFile(file, fileName);

    const newResume = {
      id: `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fileName: file.name,
      fileUrl: uploadResult.url,
      uploadedAt: new Date(),
      isActive: true,
      fileSize: file.size,
      fileType: file.type,
    };

    const existingProfile = await getCandidateProfile(candidateId);
    const updatedResumes = [...(existingProfile?.resumes || []), newResume];

    await upsertCandidateProfile(candidateId, {
      resumes: updatedResumes,
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    throw error;
  }
};

export const deleteResume = async (
  candidateId: string,
  resumeId: string
): Promise<void> => {
  try {
    const existingProfile = await getCandidateProfile(candidateId);
    if (!existingProfile) {
      console.warn("Profile not found for candidate:", candidateId);
      return;
    }

    const resumeToDelete = existingProfile.resumes?.find(
      (resume) => resume.id === resumeId
    );

    if (resumeToDelete) {
      // Delete file from storage
      await deleteFile(resumeToDelete.fileUrl);

      // Remove from profile
      const updatedResumes =
        existingProfile.resumes?.filter((resume) => resume.id !== resumeId) ||
        [];

      await upsertCandidateProfile(candidateId, {
        resumes: updatedResumes,
      });
    }
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw error;
  }
};

export const setActiveResume = async (
  candidateId: string,
  resumeId: string
): Promise<void> => {
  try {
    const existingProfile = await getCandidateProfile(candidateId);
    const updatedResumes =
      existingProfile?.resumes?.map((resume) => ({
        ...resume,
        isActive: resume.id === resumeId,
      })) || [];

    await upsertCandidateProfile(candidateId, {
      resumes: updatedResumes,
    });
  } catch (error) {
    console.error("Error setting active resume:", error);
    throw error;
  }
};

// Salary information
export const updateSalaryInfo = async (
  candidateId: string,
  salaryInfo: SalaryInfo
): Promise<void> => {
  try {
    await upsertCandidateProfile(candidateId, {
      salaryInfo,
    });
  } catch (error) {
    console.error("Error updating salary info:", error);
    throw error;
  }
};

// Skills and languages
export const updateSkills = async (
  candidateId: string,
  skills: string[],
  languages: Array<{
    language: string;
    proficiency: "basic" | "intermediate" | "fluent" | "native";
  }>
): Promise<void> => {
  try {
    await upsertCandidateProfile(candidateId, {
      skills,
      languages,
    });
  } catch (error) {
    console.error("Error updating skills:", error);
    throw error;
  }
};

// Real-time profile subscription
export const subscribeToProfile = (
  candidateId: string,
  callback: (profile: CandidateProfile | null) => void
) => {
  return subscribeToDocument<CandidateProfile>(
    COLLECTION_NAME,
    candidateId,
    callback
  );
};

// Get profile completion status
export const getProfileCompletionStatus = async (
  candidateId: string
): Promise<ProfileCompletionStatus> => {
  try {
    const profile = await getCandidateProfile(candidateId);
    return calculateProfileCompletion(profile || {});
  } catch (error) {
    console.error("Error getting profile completion status:", error);
    throw error;
  }
};
