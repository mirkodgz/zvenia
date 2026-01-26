import { v2 } from 'cloudinary';
import dotenv from 'dotenv';
export { renderers } from '../../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDE3NjMsImV4cCI6MjA4MjYxNzc2M30.aSW3Ds1z-8ta1sx-22P3NGyx4jzaY0aGNPPB9PsFcs0", "PUBLIC_SUPABASE_URL": "https://ddgdtdhgaqeqnoigmfrh.supabase.co", "SITE": undefined, "SSR": true};
dotenv.config();
const getEnv = (key) => {
  if (typeof import.meta !== "undefined" && Object.assign(__vite_import_meta_env__, { CLOUDINARY_CLOUD_NAME: "dun3slcfg", CLOUDINARY_API_KEY: "538793484752323", CLOUDINARY_API_SECRET: "EICPoZNUe3v7ZQQ-nC21pvXiTtk" }) && Object.assign(__vite_import_meta_env__, { CLOUDINARY_CLOUD_NAME: "dun3slcfg", CLOUDINARY_API_KEY: "538793484752323", CLOUDINARY_API_SECRET: "EICPoZNUe3v7ZQQ-nC21pvXiTtk" })[key]) {
    return Object.assign(__vite_import_meta_env__, { CLOUDINARY_CLOUD_NAME: "dun3slcfg", CLOUDINARY_API_KEY: "538793484752323", CLOUDINARY_API_SECRET: "EICPoZNUe3v7ZQQ-nC21pvXiTtk" })[key];
  }
  return process.env[key];
};
const cloudName = getEnv("CLOUDINARY_CLOUD_NAME");
const apiKey = getEnv("CLOUDINARY_API_KEY");
const apiSecret = getEnv("CLOUDINARY_API_SECRET");
if (!cloudName || !apiKey || !apiSecret) {
  console.warn("⚠️ Cloudinary environment variables missing. Features requiring Cloudinary may fail.");
}
v2.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const isImage = file.type.startsWith("image/");
    const resourceType = isImage ? "image" : "auto";
    let forceFormat = void 0;
    if (isImage) {
      if (file.type === "image/png") forceFormat = "png";
      else if (file.type === "image/webp") forceFormat = "webp";
      else forceFormat = "jpg";
    }
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitizedName = file.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const publicId = `zvenia_uploads/${timestamp}_${randomSuffix}_${sanitizedName}`;
    return new Promise((resolve) => {
      const uploadStream = v2.uploader.upload_stream(
        {
          resource_type: resourceType,
          public_id: publicId,
          format: forceFormat,
          // Explicitly force format
          overwrite: false,
          use_filename: true,
          unique_filename: false
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload failure:", error);
            resolve(new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 }));
            return;
          }
          console.log("Cloudinary Upload Result:", result);
          resolve(new Response(JSON.stringify({
            url: result?.secure_url,
            format: result?.format,
            resource_type: result?.resource_type
          }), { status: 200 }));
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return new Response(JSON.stringify({ error: "Server error during upload" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
