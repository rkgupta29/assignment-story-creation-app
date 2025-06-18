# Firebase Setup Guide

This guide will help you set up Firebase for your Next.js application with proper configuration and best practices.

## 🚀 Quick Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name and follow the setup wizard
4. Enable Google Analytics (recommended)

### 2. Enable Firebase Services

In your Firebase project, enable the following services:

#### Authentication

1. Go to Authentication > Sign-in method
2. Enable Email/Password authentication
3. Enable Google authentication (optional)
4. Configure authorized domains

#### Firestore Database

1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users

#### Storage

1. Go to Storage
2. Click "Get started"
3. Choose "Start in test mode" for development
4. Select a location close to your users

### 3. Get Configuration

#### Client Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app with a nickname
5. Copy the configuration object

### 4. Environment Variables

1. Copy `env.example` to `.env.local`
2. Fill in your Firebase configuration:

```bash
# Firebase Client Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional: Analytics and Performance
NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED=true
NEXT_PUBLIC_FIREBASE_PERFORMANCE_ENABLED=true
```

## 📁 Project Structure

```
src/
├── lib/
│   └── firebase/
│       ├── config.ts      # Client-side Firebase config
│       ├── auth.ts        # Authentication utilities
│       ├── firestore.ts   # Firestore database utilities
│       └── storage.ts     # Storage utilities
└── contexts/
    └── AuthContext.tsx    # React context for auth state
```

## 🔧 Usage Examples

### Authentication

```tsx
import { useAuth } from "@/contexts/AuthContext";
import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
} from "@/lib/firebase/auth";

function LoginComponent() {
  const { user, loading, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    const { user, error } = await signInWithEmail(
      "user@example.com",
      "password"
    );
    if (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.email}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Firestore Database

```tsx
import {
  addDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
  queryHelpers,
} from "@/lib/firebase/firestore";

// Add a document
const userId = await addDocument("users", {
  name: "John Doe",
  email: "john@example.com",
  createdAt: new Date(),
});

// Get documents with query
const users = await getDocuments("users", [
  queryHelpers.where("email", "==", "john@example.com"),
  queryHelpers.orderBy("createdAt", "desc"),
  queryHelpers.limit(10),
]);

// Update a document
await updateDocument("users", userId, {
  name: "Jane Doe",
});

// Delete a document
await deleteDocument("users", userId);
```

### File Storage

```tsx
import {
  uploadFile,
  uploadFileWithValidation,
  deleteFile,
} from "@/lib/firebase/storage";

// Upload a file
const handleFileUpload = async (file: File) => {
  try {
    const result = await uploadFileWithValidation(file, "uploads/images", {
      allowedTypes: ["image/jpeg", "image/png"],
      maxSizeInMB: 5,
    });
    console.log("File uploaded:", result.url);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

// Delete a file
await deleteFile("uploads/images/filename.jpg");
```

## 🔒 Security Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Public posts can be read by anyone, but only created by authenticated users
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
  }
}
```

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload files to their own folder
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Public images can be read by anyone
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚀 Deployment

### Vercel Deployment

1. Add environment variables in Vercel dashboard
2. Deploy your application
3. Update Firebase authorized domains with your Vercel domain

### Environment Variables in Production

Make sure to set all environment variables in your production environment:

- `NEXT_PUBLIC_FIREBASE_*` variables for client-side

## 🔍 Best Practices

### 1. Error Handling

- Always wrap Firebase operations in try-catch blocks
- Provide meaningful error messages to users
- Log errors for debugging

### 2. Security

- Use security rules to protect your data
- Validate user input before storing in Firestore
- Never expose sensitive data in client-side code

### 3. Performance

- Use pagination for large datasets
- Implement proper indexing in Firestore
- Optimize image uploads with compression

### 4. Type Safety

- Define TypeScript interfaces for your data models
- Use the provided utility functions for type safety
- Validate data before storing

## 🛠️ Troubleshooting

### Common Issues

1. **"Firebase App named '[DEFAULT]' already exists"**

   - This is handled in the config file, but ensure you're not initializing Firebase multiple times

2. **"Missing or insufficient permissions"**

   - Check your Firestore security rules
   - Verify user authentication status

3. **"Storage object not found"**

   - Check if the file path is correct
   - Verify storage security rules

4. **Environment variables not working**
   - Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side
   - Restart your development server after adding new variables

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js with Firebase](https://nextjs.org/docs/authentication)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Performance](https://firebase.google.com/docs/perf-mon)
