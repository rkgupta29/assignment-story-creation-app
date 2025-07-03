import { CandidateProfile, ProfileCompletionStatus } from "../../types/profile";

// Profile completion weights for different sections
export const PROFILE_SECTION_WEIGHTS = {
  basicInfo: 10,
  contactInfo: 10,
  locationInfo: 10,
  professionalInfo: 15,
  experience: 20,
  education: 15,
  resume: 10,
  salaryInfo: 5,
  skills: 5,
} as const;

// Common industries
export const COMMON_INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Marketing",
  "Sales",
  "Human Resources",
  "Legal",
  "Media & Entertainment",
  "Real Estate",
  "Transportation",
  "Energy",
  "Non-profit",
  "Government",
  "Other",
] as const;

// Common skills
export const COMMON_SKILLS = [
  "JavaScript",
  "Python",
  "Java",
  "React",
  "Node.js",
  "SQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "Agile",
  "Scrum",
  "Project Management",
  "Leadership",
  "Communication",
  "Problem Solving",
  "Analytical Thinking",
  "Team Management",
  "Customer Service",
  "Sales",
  "Marketing",
  "Data Analysis",
  "Machine Learning",
  "Artificial Intelligence",
  "DevOps",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "SEO",
  "Digital Marketing",
] as const;

// Common languages
export const COMMON_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Bengali",
  "Urdu",
  "Turkish",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
] as const;

// Language proficiency levels
export const LANGUAGE_PROFICIENCY_LEVELS = [
  "basic",
  "intermediate",
  "fluent",
  "native",
] as const;

// Salary periods
export const SALARY_PERIODS = ["monthly", "yearly"] as const;

// Common currencies
export const COMMON_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "INR",
  "CAD",
  "AUD",
  "JPY",
  "CHF",
  "CNY",
  "BRL",
] as const;

// Notice period options (in days)
export const NOTICE_PERIOD_OPTIONS = [
  0, // Immediate
  15, // 15 days
  30, // 1 month
  45, // 1.5 months
  60, // 2 months
  90, // 3 months
  120, // 4 months
  180, // 6 months
] as const;

// Work experience options (in years)
export const WORK_EXPERIENCE_OPTIONS = [
  0, // Fresher
  1, // 1 year
  2, // 2 years
  3, // 3 years
  4, // 4 years
  5, // 5 years
  6, // 6 years
  7, // 7 years
  8, // 8 years
  9, // 9 years
  10, // 10 years
  11, // 11 years
  12, // 12 years
  13, // 13 years
  14, // 14 years
  15, // 15+ years
] as const;

// File upload constraints
export const FILE_UPLOAD_CONSTRAINTS = {
  profileImage: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    maxDimensions: { width: 2048, height: 2048 },
  },
  resume: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
} as const;

// Profile validation functions
export const validateProfileImage = (file: File): string | null => {
  const allowedTypes = FILE_UPLOAD_CONSTRAINTS.profileImage.allowedTypes;
  if (!allowedTypes.includes(file.type as (typeof allowedTypes)[number])) {
    return "Please upload a valid image file (JPEG, PNG, or WebP)";
  }

  if (file.size > FILE_UPLOAD_CONSTRAINTS.profileImage.maxSize) {
    return "Profile image must be less than 5MB";
  }

  return null;
};

export const validateResume = (file: File): string | null => {
  const allowedTypes = FILE_UPLOAD_CONSTRAINTS.resume.allowedTypes;
  if (!allowedTypes.includes(file.type as (typeof allowedTypes)[number])) {
    return "Please upload a valid resume file (PDF, DOC, or DOCX)";
  }

  if (file.size > FILE_UPLOAD_CONSTRAINTS.resume.maxSize) {
    return "Resume must be less than 10MB";
  }

  return null;
};

export const validatePhoneNumber = (phoneNumber: string): string | null => {
  // Basic validation - can be enhanced based on country codes
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  if (cleanNumber.length < 7 || cleanNumber.length > 15) {
    return "Please enter a valid phone number";
  }

  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  return null;
};

// Profile completion calculation with weights
export const calculateWeightedProfileCompletion = (
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

  let totalWeight = 0;
  let completedWeight = 0;

  Object.entries(sections).forEach(([section, isCompleted]) => {
    const weight =
      PROFILE_SECTION_WEIGHTS[section as keyof typeof PROFILE_SECTION_WEIGHTS];
    totalWeight += weight;
    if (isCompleted) {
      completedWeight += weight;
    }
  });

  const percentage = Math.round((completedWeight / totalWeight) * 100);

  return {
    ...sections,
    overall: percentage === 100,
    percentage,
  };
};

// Format functions
export const formatPhoneNumber = (
  phoneNumber: string,
  countryCode: string
): string => {
  return `${countryCode} ${phoneNumber}`;
};

export const formatSalary = (
  amount: number,
  currency: string,
  period: string
): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${formatter.format(amount)}/${period}`;
};

export const formatWorkExperience = (years: number): string => {
  if (years === 0) return "Fresher";
  if (years === 1) return "1 year";
  return `${years} years`;
};

export const formatNoticePeriod = (days: number): string => {
  if (days === 0) return "Immediate";
  if (days === 30) return "1 month";
  if (days === 60) return "2 months";
  if (days === 90) return "3 months";
  if (days === 180) return "6 months";
  return `${days} days`;
};

// Helper functions
export const getProfileSectionStatus = (profile: Partial<CandidateProfile>) => {
  const completion = calculateWeightedProfileCompletion(profile);

  return {
    completed: Object.entries(completion).filter(
      ([key, value]) => key !== "overall" && key !== "percentage" && value
    ),
    incomplete: Object.entries(completion).filter(
      ([key, value]) => key !== "overall" && key !== "percentage" && !value
    ),
    percentage: completion.percentage,
    isComplete: completion.overall,
  };
};

export const getNextIncompleteSection = (
  profile: Partial<CandidateProfile>
): string | null => {
  const completion = calculateWeightedProfileCompletion(profile);

  const incompleteSections = Object.entries(completion).filter(
    ([key, value]) => key !== "overall" && key !== "percentage" && !value
  );

  if (incompleteSections.length === 0) return null;

  // Return the first incomplete section
  return incompleteSections[0][0];
};

// Profile data sanitization
export const sanitizeProfileData = (
  data: Record<string, unknown>
): Partial<CandidateProfile> => {
  const sanitized: Record<string, unknown> = {};

  // Basic info
  if (data.fullName) sanitized.fullName = String(data.fullName).trim();
  if (data.gender) sanitized.gender = data.gender;
  if (data.profileImage) sanitized.profileImage = data.profileImage;

  // Contact info
  if (data.contactInfo && typeof data.contactInfo === "object") {
    const contactInfo = data.contactInfo as Record<string, unknown>;
    sanitized.contactInfo = {
      mobileNumber: String(contactInfo.mobileNumber || "").trim(),
      countryCode: String(contactInfo.countryCode || "").trim(),
      fullPhoneNumber: String(contactInfo.fullPhoneNumber || "").trim(),
    };
  }

  // Location info
  if (data.currentLocation && typeof data.currentLocation === "object") {
    const location = data.currentLocation as Record<string, unknown>;
    sanitized.currentLocation = {
      city: String(location.city || "").trim(),
      state: location.state ? String(location.state).trim() : undefined,
      country: String(location.country || "").trim(),
      isRemote: Boolean(location.isRemote),
    };
  }

  if (data.preferredLocations && Array.isArray(data.preferredLocations)) {
    sanitized.preferredLocations = data.preferredLocations
      .map((location: unknown) => {
        if (typeof location === "object" && location !== null) {
          const loc = location as Record<string, unknown>;
          return {
            city: String(loc.city || "").trim(),
            state: loc.state ? String(loc.state).trim() : undefined,
            country: String(loc.country || "").trim(),
            isRemote: Boolean(loc.isRemote),
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  // Professional info
  if (data.totalWorkExperience !== undefined)
    sanitized.totalWorkExperience = Number(data.totalWorkExperience);
  if (data.industry) sanitized.industry = String(data.industry).trim();
  if (data.noticePeriod !== undefined)
    sanitized.noticePeriod = Number(data.noticePeriod);

  // Skills
  if (data.skills && Array.isArray(data.skills)) {
    sanitized.skills = data.skills
      .map((skill: unknown) => String(skill).trim())
      .filter(Boolean);
  }

  // Languages
  if (data.languages && Array.isArray(data.languages)) {
    sanitized.languages = data.languages.filter((lang: unknown) => {
      if (typeof lang === "object" && lang !== null) {
        const language = lang as Record<string, unknown>;
        return language.language && language.proficiency;
      }
      return false;
    });
  }

  return sanitized as Partial<CandidateProfile>;
};
