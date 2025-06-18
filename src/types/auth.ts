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
}

export interface Organization extends BaseUser {
  userType: "organization";
  companyName: string;
  websiteUrl: string;
  companyDescription?: string;
}

export interface CandidateSignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface OrganisationSignupFormData {
  companyName: string;
  websiteUrl: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface ConfirmPasswordResetFormData {
  oobCode: string;
  newPassword: string;
  confirmNewPassword: string;
}
