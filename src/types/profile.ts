export interface UserProfile {
  name: string;
  email: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileUpdateData {
  name?: string;
  profileImage?: string;
}
