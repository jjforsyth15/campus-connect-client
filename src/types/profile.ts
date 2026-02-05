export type UserType = 'student' | 'faculty' | 'staff' | 'alumni';

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  profilePicture: string | null;
  bio: string | null;
  userType: UserType; 
  city: string | null;
  websites: string[] | null;
  createdAt: string;  
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: PublicUser;
}

export interface RegisterResponse {
  message: string;
  user: PublicUser;
}
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  major: string;
  year: string;
  bio?: string;
  photoUrl?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileFormData {
  name: string;
  major: string;
  year: string;
  bio: string;
  photo?: File;
  isPublic?: boolean;
}

export type PrivacySettings = {
  showEmail: boolean;
  showMajor: boolean;
  showYear: boolean;
  showBio: boolean;
}