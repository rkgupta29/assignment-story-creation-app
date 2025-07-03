# Candidate Profile System

This document describes the comprehensive candidate profile system implemented for the portal application.

## Overview

The candidate profile system allows candidates to create and manage detailed professional profiles including experience, education, skills, salary information, and more. The system provides a complete profile management solution with real-time updates and profile completion tracking.

## Schema Structure

### Core Profile Types

#### `CandidateProfile`

The main profile interface containing all candidate information:

```typescript
interface CandidateProfile {
  // Basic Information
  fullName: string;
  profileImage?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";

  // Contact Information
  contactInfo: ContactInfo;

  // Location Information
  currentLocation: Location;
  preferredLocations: Location[];

  // Professional Information
  totalWorkExperience: number; // in years
  industry: string;
  noticePeriod: number; // in days

  // Detailed Information
  experiences: Experience[];
  education: Education[];
  resumes: Resume[];

  // Salary Information
  salaryInfo: SalaryInfo;

  // Additional Information
  skills: string[];
  languages: Array<{
    language: string;
    proficiency: "basic" | "intermediate" | "fluent" | "native";
  }>;

  // Profile Status
  profileCompletionPercentage: number;
  isProfileComplete: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}
```

## Core Functions

### Profile Management

#### `getCandidateProfile(candidateId: string)`

Retrieves a candidate's complete profile from Firestore.

#### `upsertCandidateProfile(candidateId: string, profileData: ProfileUpdateData)`

Creates or updates a candidate's profile with automatic completion calculation.

#### `subscribeToProfile(candidateId: string, callback)`

Sets up real-time subscription to profile changes.

### Section-Specific Updates

#### Basic Information

- `updateBasicInfo()` - Updates name, gender, and profile image
- Handles automatic image upload to Firebase Storage

#### Contact Information

- `updateContactInfo()` - Updates phone number and country code
- Automatically formats full phone number

#### Location Information

- `updateLocationInfo()` - Updates current and preferred locations

#### Professional Information

- `updateProfessionalInfo()` - Updates work experience, industry, and notice period

### Experience Management

- `addExperience()` - Adds new work experience entry
- `updateExperience()` - Updates existing experience
- `deleteExperience()` - Removes experience entry

### Education Management

- `addEducation()` - Adds new education entry
- `updateEducation()` - Updates existing education
- `deleteEducation()` - Removes education entry

### Resume Management

- `uploadResume()` - Uploads and stores resume file
- `deleteResume()` - Removes resume and deletes file from storage
- `setActiveResume()` - Sets primary resume for applications

### Salary Information

- `updateSalaryInfo()` - Updates salary details and preferences

### Skills and Languages

- `updateSkills()` - Updates skills list and language proficiencies

## Profile Completion System

### Automatic Calculation

The system automatically calculates profile completion percentage based on completed sections:

- **Basic Info** (10%): Full name
- **Contact Info** (10%): Phone number and country code
- **Location Info** (10%): Current location
- **Professional Info** (15%): Work experience, industry, notice period
- **Experience** (20%): At least one work experience entry
- **Education** (15%): At least one education entry
- **Resume** (10%): At least one uploaded resume
- **Salary Info** (5%): Currency and salary period
- **Skills** (5%): At least one skill

## Usage Examples

### Creating a New Profile

```typescript
import { upsertCandidateProfile } from "@/lib/firebase/profile";

const candidateId = "user123";
const profileData = {
  fullName: "John Doe",
  contactInfo: {
    mobileNumber: "1234567890",
    countryCode: "+1",
    fullPhoneNumber: "+11234567890",
  },
  currentLocation: {
    city: "New York",
    state: "NY",
    country: "USA",
  },
};

await upsertCandidateProfile(candidateId, profileData);
```

### Adding Work Experience

```typescript
import { addExperience } from "@/lib/firebase/profile";

const experience = {
  companyName: "Tech Corp",
  position: "Software Engineer",
  startDate: new Date("2020-01-01"),
  endDate: new Date("2023-01-01"),
  isCurrentPosition: false,
  description: "Developed web applications using React and Node.js",
  location: "San Francisco, CA",
  industry: "Technology",
  achievements: ["Led team of 5 developers", "Improved performance by 40%"],
  technologies: ["React", "Node.js", "TypeScript"],
};

await addExperience(candidateId, experience);
```

## File Structure

```
src/
├── types/
│   ├── auth.ts          # Updated with profile reference
│   └── profile.ts       # Profile type definitions
├── lib/
│   ├── firebase/
│   │   ├── profile.ts   # Profile service functions
│   │   └── index.ts     # Firebase exports
│   └── utils/
│       └── profile-utils.ts  # Utility functions and constants
```

## Security Considerations

1. **Authentication**: All profile operations require authenticated user
2. **Authorization**: Users can only access and modify their own profiles
3. **File Validation**: All uploaded files are validated for type and size
4. **Data Sanitization**: All input data is sanitized before storage
5. **Storage Security**: Files are stored with proper access controls
