import { User } from "firebase/auth";

export type UserType = "candidate" | "organization";

export interface BaseUser {
  uid: string;
  email: string;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidate extends BaseUser {
  userType: "candidate";
  fullName: string;
  profileCompleted: boolean;
  phone?: string;
  location?: string;
  skills?: string[];
  experience?: number;
  education?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
}

export interface Organization extends BaseUser {
  userType: "organization";
  companyName: string;
  websiteUrl: string;
  profileCompleted: boolean;
  companyDescription?: string;
  industry?: string;
  companySize?: string;
  headquarters?: string;
  logoUrl?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface CandidateSignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  userProfile: Candidate | Organization | null;
}
