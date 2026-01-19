
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load env vars if running in a script context
dotenv.config();

// Helper to safely get env vars whether in Astro (import.meta.env) or Node (process.env)
const getEnv = (key: string) => {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
        return import.meta.env[key];
    }
    return process.env[key];
};

const cloudName = getEnv('CLOUDINARY_CLOUD_NAME');
const apiKey = getEnv('CLOUDINARY_API_KEY');
const apiSecret = getEnv('CLOUDINARY_API_SECRET');

if (!cloudName || !apiKey || !apiSecret) {
    console.warn('⚠️ Cloudinary environment variables missing. Features requiring Cloudinary may fail.');
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
});

export default cloudinary;
