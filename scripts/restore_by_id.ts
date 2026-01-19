
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://ddgdtdhgaqeqnoigmfrh.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

// FILES
const POSTS_CSV = 'd:/zvenia/migration_data/z-posts-full.csv';
const CLOUD_CSV = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';

if (!SERVICE_KEY) {
    console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// MAPS
const slugToThumbId = new Map<string, string>();
const mediaIdToCloudUrl = new Map<string, string>();

async function loadMaps() {
    console.log("📂 Loading Maps...");

    // 1. Load Cloudinary Map (Media ID -> URL)
    await new Promise((resolve, reject) => {
        fs.createReadStream(CLOUD_CSV)
            .pipe(csv.parse({ headers: true }))
        if (row.media_id == '1373') console.log(`[DEBUG] Found Cloud URL for 1373`);

        if (row.media_id && row.cloudinary_url && row.cloudinary_url !== 'FAILED') {
            //...
            const thumbId = row['meta__thumbnail_id'];

            if (thumbId == '1373') console.log(`[DEBUG] Found Post using Thumb 1373: ${slug}`);

            if (slug && thumbId) {
                // ...
                // 2. Get Cloud URL
                const newUrl = mediaIdToCloudUrl.get(thumbId);

                if (thumbId == '1373') {
                    console.log(`[DEBUG] Loop 1373. NewURL: ${newUrl ? newUrl.substring(0, 20) : 'N/A'}`);
                    console.log(`[DEBUG] DB URL: ${post.featured_image_url ? post.featured_image_url.substring(0, 20) : 'N/A'}`);
                }
            .on('end', resolve)
                    .on('error', reject);
            });
    console.log(`   ✅ Loaded ${mediaIdToCloudUrl.size} Cloudinary mappings.`);

    // 2. Load Posts Map (Slug -> Thumbnail ID)
    // post_name usually maps to slug.
    await new Promise((resolve, reject) => {
        fs.createReadStream(POSTS_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const slug = row['wp_post_name'] || row['post_name'] || row['wp_post_name_0']; // Check variations
                // z-posts-full might have flattened 'wp:post_name' to 'wp_post_name'

                const thumbId = row['meta__thumbnail_id'];

                // Also check for simple 'title' if slug missing
                // In xml_to_csv, we flattened top level. 'wp:post_name' -> 'wp_post_name'

                if (slug && thumbId) {
                    slugToThumbId.set(slug, thumbId);
                }
            })
            .on('end', resolve)
            .on('error', reject);
    });
    console.log(`   ✅ Loaded ${slugToThumbId.size} Slug->Thumb mappings.`);
    console.log('Sample Slug->Thumb:', [...slugToThumbId.entries()].slice(0, 3));
    console.log('Sample Media->URL:', [...mediaIdToCloudUrl.entries()].slice(0, 3));
}

async function run() {
    await loadMaps();

    console.log("\n🔍 Updating Posts by ID Association...");

    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, slug, featured_image_url');

    if (error) {
        console.error("Error fetching posts:", error);
        return;
    }

    let updates = 0;

    for (const post of posts) {
        if (!post.slug) continue;

        // 1. Get Thumb ID
        const thumbId = slugToThumbId.get(post.slug);
        if (!thumbId) continue;

        // 2. Get Cloud URL
        const newUrl = mediaIdToCloudUrl.get(thumbId);
        if (!newUrl) continue;

        // 3. Update if different
        if (post.featured_image_url !== newUrl) {
            const { error: upErr } = await supabase
                .from('posts')
                .update({ featured_image_url: newUrl })
                .eq('id', post.id);

            if (upErr) console.error(`Failed ${post.slug}:`, upErr.message);
            else {
                updates++;
                if (updates % 50 === 0) console.log(`   Updated ${updates}...`);
            }
        }
    }

    console.log(`\n🎉 DONE. Updated ${updates} posts.`);
}

run().catch(console.error);
