
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const POSTS_CSV = 'd:/zvenia/migration_data/z-posts-full.csv';
const CLOUD_CSV = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';

async function tracePost(titleFragment: string) {
    console.log(`🔎 Tracing Post: "${titleFragment}"`);

    // 1. Find Post in CSV to get Thumbnail ID
    let thumbId = null;
    let postSlug = null;
    let foundTitle = null;

    await new Promise((resolve) => {
        fs.createReadStream(POSTS_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                if (row.title && row.title.includes(titleFragment)) {
                    foundTitle = row.title;
                    postSlug = row['wp_post_name'] || row['post_name'];
                    thumbId = row['meta__thumbnail_id'];
                    console.log(`   ✅ Found Post in CSV: "${foundTitle}"`);
                    console.log(`      Slug: ${postSlug}`);
                    console.log(`      Thumbnail ID: ${thumbId}`);
                }
            })
            .on('end', resolve);
    });

    if (!thumbId) {
        console.log("   ❌ Could not find thumbnail ID for this post.");
        return;
    }

    // 2. Find Image URL in Cloudinary CSV using Thumbnail ID
    console.log(`\n🔎 Looking up Media ID: ${thumbId} in Cloudinary Map...`);
    let cloudUrl = null;

    await new Promise((resolve) => {
        fs.createReadStream(CLOUD_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                if (row.media_id == thumbId) {
                    cloudUrl = row.cloudinary_url;
                    console.log(`   ✅ FOUND Cloudinary URL!`);
                    console.log(`      URL: ${cloudUrl}`);
                }
            })
            .on('end', resolve);
    });

    if (cloudUrl) {
        console.log("\n🚀 ATTEMPTING UPDATE...");
        // 3. Verify DB State & Update
        const { data: posts } = await supabase.from('posts').select('*').ilike('title', `%${titleFragment}%`);
        if (posts && posts.length > 0) {
            const p = posts[0];
            console.log(`   Current DB URL: ${p.featured_image_url}`);

            if (p.featured_image_url !== cloudUrl) {
                const { error } = await supabase.from('posts').update({ featured_image_url: cloudUrl }).eq('id', p.id);
                if (!error) console.log("   ✅ SUCCESS! Database Updated.");
                else console.log("   ❌ Update Failed:", error.message);
            } else {
                console.log("   ⚠️ Start URL matches Cloud URL. No update needed.");
            }
        } else {
            console.log("   ❌ Post not found in actual Database (Supabase).");
        }
    } else {
        console.log("   ❌ Image ID found in Post, but NOT found in Cloudinary CSV.");
    }
}

tracePost('Waste rock in mining');
