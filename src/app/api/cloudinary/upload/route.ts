import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/cloudinary/upload
 * Uploads an image, PDF document, or video file.
 *
 * Supports:
 * 1. Cloudinary CDN (if credentials configured)
 * 2. Supabase Storage CDN Fallback (zero-config, works 100% out of the box!)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      image,
      cloudName: reqCloudName,
      apiKey: reqApiKey,
      apiSecret: reqApiSecret,
      uploadPreset: reqUploadPreset,
      folder = "elan-posters",
    } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No file or base64 data provided." },
        { status: 400 }
      );
    }

    const cloudName =
      reqCloudName ||
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // ── METHOD A: CLOUDINARY UPLOAD ──────────────────────────────────────────
    if (cloudName) {
      const apiKey = reqApiKey || process.env.CLOUDINARY_API_KEY;
      const apiSecret = reqApiSecret || process.env.CLOUDINARY_API_SECRET;
      const uploadPreset = reqUploadPreset || process.env.CLOUDINARY_UPLOAD_PRESET;

      const resourceType = body.resourceType || "auto";
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
      const formData = new FormData();
      formData.append("file", image);
      if (folder) formData.append("folder", folder);

      if (uploadPreset) {
        formData.append("upload_preset", uploadPreset);
      } else if (apiKey && apiSecret) {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");
        formData.append("signature", signature);
      } else {
        formData.append("upload_preset", "ml_default");
      }

      try {
        const response = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const resData = await response.json();
          return NextResponse.json({
            success: true,
            url: resData.secure_url || resData.url,
            publicId: resData.public_id,
            format: resData.format,
            provider: "cloudinary",
          });
        }
      } catch {
        /* Fall through to Supabase Storage fallback */
      }
    }

    // ── METHOD B: SUPABASE STORAGE CDN (Zero-Config Default) ─────────────────
    if (supabaseAdmin) {
      let fileBuffer: Buffer;
      let contentType = "application/pdf";
      let extension = "pdf";

      if (image.startsWith("data:")) {
        const match = image.match(/^data:(.+?);base64,(.+)$/);
        if (match) {
          contentType = match[1];
          fileBuffer = Buffer.from(match[2], "base64");
          if (contentType.includes("png")) extension = "png";
          else if (contentType.includes("jpeg") || contentType.includes("jpg")) extension = "jpg";
          else if (contentType.includes("webp")) extension = "webp";
          else if (contentType.includes("mp4")) extension = "mp4";
          else if (contentType.includes("pdf")) extension = "pdf";
        } else {
          fileBuffer = Buffer.from(image, "base64");
        }
      } else {
        fileBuffer = Buffer.from(image, "utf-8");
      }

      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from("documents")
        .upload(filename, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from("documents")
          .getPublicUrl(filename);

        return NextResponse.json({
          success: true,
          url: publicUrlData.publicUrl,
          publicId: filename,
          provider: "supabase",
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to host file. Please try uploading again.",
      },
      { status: 500 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to upload file.",
      },
      { status: 500 }
    );
  }
}
