import type { Metadata } from "next";
import { esbuild, ppMori } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assignment",
  description: "Assignment for project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${esbuild.variable} ${ppMori.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
