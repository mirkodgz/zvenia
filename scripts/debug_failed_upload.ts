
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadUrl = "https://zvenia.com/wp-content/uploads/jet-form-builder/005d8a8b4a836813a1d2c57f8e7d6646/2025/11/fina2019_PhD_TML_iron_ore.pdf";
const title = "Modelos para previsão do TML de finos de minério de ferro — Doutorado (2019)";

async function run() {
    console.log("Debug: Attempting upload for:");
    console.log(`Title: ${title}`);
    console.log(`URL: ${uploadUrl}`);

    try {
        console.log("1. Testing Cloudinary Upload...");
        // URL might need encoding if it has spaces or special chars, but this one looks clean?
        // Actually, the original URL works in browser.

        const res = await cloudinary.uploader.upload(uploadUrl, {
            folder: 'cloud-files',
            resource_type: 'auto'
        });

        console.log("✅ Upload Success!");
        console.log("Secure URL: ", res.secure_url);
    } catch (error: any) {
        console.error("❌ Upload Failed:", error);
    }
}

run();
