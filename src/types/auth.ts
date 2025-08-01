export interface User {
  uid: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
}

export interface SignupFormData {
  name: string;
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

export interface ResetPasswordFormData {
  email: string;
}

export interface ConfirmPasswordResetFormData {
  oobCode: string;
  newPassword: string;
  confirmNewPassword: string;
}
