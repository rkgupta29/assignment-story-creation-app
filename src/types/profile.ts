export interface Experience {
  id: string;
  companyName: string;
  position: string;
  startDate: Date;
  endDate?: Date; // null if current position
  isCurrentPosition: boolean;
  description: string;
  location?: string;
  industry?: string;
  achievements?: string[];
  technologies?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date; // null if currently studying
  isCurrentlyStudying: boolean;
  grade?: string;
  description?: string;
  location?: string;
}

export interface Resume {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  isActive: boolean;
  fileSize: number;
  fileType: string;
}

export interface ContactInfo {
  mobileNumber: string;
  countryCode: string;
  fullPhoneNumber: string;
  contactEmail: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface Location {
  city: string;
  state?: string;
  country: string;
  isRemote?: boolean;
}

export interface SalaryInfo {
  currentSalary?: number;
  expectedSalary?: number;
  currency: string;
  isSalaryNegotiable: boolean;
  isSalaryConfidential: boolean;
  salaryPeriod: "monthly" | "yearly";
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
  PREFER_NOT_TO_SAY = "prefer_not_to_say",
}

export interface Language {
  language: string;
  proficiency: "basic" | "intermediate" | "fluent" | "native";
}

export interface CandidateProfile {
  fullName: string;
  profileImage?: string;
  gender?: Gender;

  contactInfo: ContactInfo;

  currentLocation: Location;
  preferredLocations: Location[];

  totalWorkExperience: number;
  industry: string;
  noticePeriod: number;

  experiences: Experience[];
  education: Education[];
  resumes: Resume[];

  salaryInfo: SalaryInfo;

  skills: string[];
  languages: Array<Language>;

  profileCompletionPercentage: number;
  isProfileComplete: boolean;

  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}

export interface BasicInfoFormData {
  fullName: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  profileImage?: File;
}

export interface ContactInfoFormData {
  mobileNumber: string;
  countryCode: string;
}

export interface LocationFormData {
  currentLocation: Location;
  preferredLocations: Location[];
}

export interface ProfessionalInfoFormData {
  totalWorkExperience: number;
  industry: string;
  noticePeriod: number;
}

export interface ExperienceFormData {
  companyName: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrentPosition: boolean;
  description: string;
  location?: string;
  industry?: string;
  achievements?: string[];
  technologies?: string[];
}

export interface EducationFormData {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  isCurrentlyStudying: boolean;
  grade?: string;
  description?: string;
  location?: string;
}

export interface SalaryInfoFormData {
  currentSalary?: number;
  expectedSalary?: number;
  currency: string;
  isSalaryNegotiable: boolean;
  isSalaryConfidential: boolean;
  salaryPeriod: "monthly" | "yearly";
}

export interface SkillsFormData {
  skills: string[];
  languages: Array<{
    language: string;
    proficiency: "basic" | "intermediate" | "fluent" | "native";
  }>;
}

export type ProfileUpdateData = Partial<CandidateProfile>;

export interface ProfileCompletionStatus {
  basicInfo: boolean;
  contactInfo: boolean;
  locationInfo: boolean;
  professionalInfo: boolean;
  experience: boolean;
  education: boolean;
  resume: boolean;
  salaryInfo: boolean;
  skills: boolean;
  overall: boolean;
  percentage: number;
}
