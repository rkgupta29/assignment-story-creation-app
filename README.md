# Next.js Boilerplate with Tailwind CSS, shadcn/ui, and Custom Fonts

This is a modern Next.js boilerplate with the following features:

- ⚡ **Next.js 15** with App Router
- 🎨 **Tailwind CSS v4** for styling
- 🧩 **shadcn/ui** for beautiful, accessible components
- 🔤 **Custom Fonts** (ESBuild and PP Mori) from `public/fonts/`
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

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Using Custom Fonts

The fonts are configured in `src/lib/fonts.ts` and can be used in your components:

```tsx
// Using ESBuild font
<h1 style={{ fontFamily: 'var(--font-esbuild)' }}>
  This is ESBuild
</h1>

// Using PP Mori font
<p style={{ fontFamily: 'var(--font-pp-mori)' }}>
  This is PP Mori
</p>
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
└── lib/               # Utility functions
    ├── fonts.ts       # Custom font configurations
    └── utils.ts       # shadcn/ui utilities
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
