
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_TITLE = "Modelos para previsão do TML de finos de minério de ferro — Doutorado (2019)";
const TARGET_URL = "https://zvenia.com/wp-content/uploads/jet-form-builder/005d8a8b4a836813a1d2c57f8e7d6646/2025/11/fina2019_PhD_TML_iron_ore.pdf";

async function run() {
    console.log(`🚀 Manual Restore for: "${TARGET_TITLE}"`);

    // 1. Upload to Cloudinary
    console.log(`☁️ Uploading ${TARGET_URL}...`);
    try {
        const uploadRes = await cloudinary.uploader.upload(TARGET_URL, {
            folder: 'cloud-files',
            resource_type: 'raw', // Try raw to avoid 20MB image/auto limit
            use_filename: true,
            unique_filename: false
        });
        console.log(`✅ Uploaded: ${uploadRes.secure_url}`);

        // 2. Update Supabase
        const { data: posts } = await supabase
            .from('posts')
            .select('id, title')
            .ilike('title', `%${TARGET_TITLE.substring(0, 20)}%`);

        let post = posts?.find(p => p.title.includes('Modelos para previsão'));

        if (post) {
            const { error } = await supabase
                .from('posts')
                .update({ document_url: uploadRes.secure_url })
                .eq('id', post.id);

            if (error) console.error("❌ DB Update Failed:", error);
            else console.log(`✅ Database Updated for ID ${post.id}`);
        } else {
            console.error("❌ Post not found in DB via fuzzy search.");
        }

    } catch (e: any) {
        console.error("❌ Error:", e.message);
    }
}

run();
