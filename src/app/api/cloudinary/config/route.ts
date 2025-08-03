import { NextResponse } from "next/server";

export async function GET() {
  try {
    const available = !!(
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      available,
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || null,
      has_api_key: !!process.env.CLOUDINARY_API_KEY,
      has_api_secret: !!process.env.CLOUDINARY_API_SECRET,
    });
  } catch {
    return NextResponse.json(
      { available: false, error: "Failed to check configuration" },
      { status: 500 }
    );
  }
}
