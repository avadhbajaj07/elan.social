import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * POST /api/cloudinary/upload
 * Uploads an image file or base64 string to Cloudinary and returns the hosted HTTPS CDN URL.
 *
 * Accepts:
 * - image: base64 data URI (data:image/png;base64,...) or HTTPS URL
 * - cloudName: Cloudinary cloud name (optional, falls back to env variable)
 * - apiKey: Cloudinary API key (optional)
 * - apiSecret: Cloudinary API secret (optional)
 * - uploadPreset: Cloudinary unsigned upload preset (optional)
 * - folder: Cloudinary folder name (optional, e.g. "elan-posters")
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
        { success: false, error: "No image file or base64 data provided." },
        { status: 400 }
      );
    }

    // Determine Cloudinary credentials (request body or process.env)
    const cloudName =
      reqCloudName ||
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const apiKey = reqApiKey || process.env.CLOUDINARY_API_KEY;
    const apiSecret = reqApiSecret || process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = reqUploadPreset || process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cloudinary Cloud Name is missing. Please enter your Cloud Name in settings.",
        },
        { status: 400 }
      );
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append("file", image);
    if (folder) formData.append("folder", folder);

    // Method A: Unsigned upload via upload_preset
    if (uploadPreset) {
      formData.append("upload_preset", uploadPreset);
    }
    // Method B: Signed upload via API Key + Secret
    else if (apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);

      // Create SHA-1 signature: folder=elan-posters&timestamp=1234567890 + secret
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");
      formData.append("signature", signature);
    }
    // Method C: Demo / default unsigned fallback if user hasn't set secret
    else {
      // Use unsigned mode or default preset
      formData.append("upload_preset", "ml_default");
    }

    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });

    const resData = await response.json();

    if (!response.ok) {
      const errMsg =
        resData.error?.message ||
        resData.message ||
        `Cloudinary upload failed with HTTP ${response.status}`;

      return NextResponse.json(
        {
          success: false,
          error: errMsg,
          details: resData,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      url: resData.secure_url || resData.url,
      publicId: resData.public_id,
      format: resData.format,
      width: resData.width,
      height: resData.height,
      bytes: resData.bytes,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to upload image to Cloudinary.",
      },
      { status: 500 }
    );
  }
}
