import { NextRequest, NextResponse } from "next/server";
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dz1wxlh42",
  api_key: process.env.CLOUDINARY_API_KEY || "428144786176777",
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { success: false, error: "Cloudinary API secret not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;
    const publicId = formData.get("public_id") as string;
    const tagsString = formData.get("tags") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large: ${(file.size / 1024 / 1024).toFixed(
            2
          )}MB (max: 50MB)`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let tags: string[] = [];
    if (tagsString) {
      try {
        tags = JSON.parse(tagsString);
      } catch {
        tags = [tagsString];
      }
    }

    const uploadOptions: UploadApiOptions = {
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    if (folder) uploadOptions.folder = folder;
    if (publicId) uploadOptions.public_id = publicId;
    if (tags.length > 0) uploadOptions.tags = tags;

    uploadOptions.context = {
      original_name: file.name,
      uploaded_at: new Date().toISOString(),
      file_size: file.size.toString(),
    };

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error("Upload failed: No result returned"));
          }
        })
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        secure_url: result.secure_url,
        resource_type: result.resource_type,
        format: result.format,
        bytes: result.bytes,
        duration: result.duration,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
