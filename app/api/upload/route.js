// app/api/upload/route.js
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { data } = await request.json();

    if (!data) {
      return NextResponse.json(
        { error: "No image data provided" },
        { status: 400 }
      );
    }

    // Validate that it's a base64 image
    if (!data.startsWith("data:image")) {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary with options
    const uploadResponse = await cloudinary.uploader.upload(data, {
      upload_preset: "ml_default",
      allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
      transformation: [
        { width: 800, height: 800, crop: "limit" }, // Limit max size
        { quality: "auto" }, // Automatic quality optimization
        { fetch_format: "auto" }, // Automatic format optimization
      ],
    });

    if (!uploadResponse || !uploadResponse.secure_url) {
      throw new Error("Upload failed");
    }

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload image",
      },
      { status: 500 }
    );
  }
}
