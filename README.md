# Next.js Boilerplate with Tailwind CSS, shadcn/ui, Custom Fonts, and Firebase

This is a modern Next.js boilerplate with the following features:

- ⚡ **Next.js 15** with App Router
- 🎨 **Tailwind CSS v4** for styling
- 🧩 **shadcn/ui** for beautiful, accessible components
- 🔤 **Custom Fonts** (ESBuild and PP Mori) from `public/fonts/`
- 🔥 **Firebase** for client-side services (Auth, Firestore, Storage)
- 📱 **TypeScript** for type safety
- 🚀 **ESLint** for code quality

## Custom Fonts

The project includes custom fonts located in `public/fonts/`:

### ESBuild Font Family

- `ESBuild-Regular.woff2` (400)
- `ESBuild-Medium.woff2` (500)
- `ESBuild-Bold.woff2` (700)

### PP Mori Font Family

- `PPMori-Medium.woff2` (500)
- `PPMori-SemiBold.woff2` (600)
- `PPMori-Bold.woff2` (700)

## Firebase Integration

This boilerplate includes a complete Firebase setup with:

- 🔐 **Authentication** (Email/Password, Google Sign-in)
- 📊 **Firestore Database** with real-time listeners
- 📁 **Storage** for file uploads
- 🔧 **Type-safe utilities** for all Firebase services

### Firebase Services Included

- **Client-side Firebase SDK** for browser operations
- **Authentication Context** for React state management
- **Comprehensive utilities** for Firestore and Storage operations

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up Firebase:**

   - Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md)
   - Copy `env.example` to `.env.local`
   - Fill in your Firebase configuration

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Using Custom Fonts

The fonts are configured in `src/lib/fonts.ts` and can be used with Tailwind classes:

```tsx
// Using ESBuild font
<h1 className="font-esbuild text-4xl">This is ESBuild</h1>

// Using PP Mori font
<p className="font-pp text-lg">This is PP Mori</p>
```

## Firebase Usage

### Authentication

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { signInWithEmail } from "@/lib/firebase/auth";

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
]);
```

### File Storage

```tsx
import { uploadFileWithValidation } from "@/lib/firebase/storage";

const handleFileUpload = async (file: File) => {
  const result = await uploadFileWithValidation(file, "uploads/images", {
    allowedTypes: ["image/jpeg", "image/png"],
    maxSizeInMB: 5,
  });
};
```

## Adding shadcn/ui Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Available components: `button`, `card`, `input`, `label`, and many more.

## Project Structure

```
src/
├── app/                 # App Router pages
│   ├── globals.css     # Global styles with custom fonts
│   ├── layout.tsx      # Root layout with font configuration
│   └── page.tsx        # Home page showcasing fonts and components
├── components/         # React components
│   └── ui/            # shadcn/ui components
├── contexts/          # React contexts
│   └── AuthContext.tsx # Firebase authentication context
└── lib/               # Utility functions
    ├── fonts.ts       # Custom font configurations
    ├── utils.ts       # shadcn/ui utilities
    └── firebase/      # Firebase utilities
        ├── config.ts  # Client-side Firebase config
        ├── auth.ts    # Authentication utilities
        ├── firestore.ts # Firestore database utilities
        └── storage.ts # Storage utilities
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file with your Firebase configuration:

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

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Firebase Setup Guide](./FIREBASE_SETUP.md)
