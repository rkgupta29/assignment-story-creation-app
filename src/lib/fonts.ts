import localFont from "next/font/local";

export const esbuild = localFont({
  src: [
    {
      path: "../../public/fonts/ESBuild-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ESBuild-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ESBuild-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-esbuild",
  display: "swap",
});

export const ppMori = localFont({
  src: [
    {
      path: "../../public/fonts/PPMori-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPMori-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPMori-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pp-mori",
  display: "swap",
});
