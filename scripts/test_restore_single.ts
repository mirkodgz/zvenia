
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const POSTS_CSV = 'd:/zvenia/migration_data/datos nuevos/z-post-limpio.csv';
const MEDIA_CSV = 'd:/zvenia/migration_data/datos nuevos/media-limpio.csv';

async function testSinglePost() {
    console.log("🧪 TESTING SINGLE POST RESTORE: 'Waste rock in mining'");

    // 1. FIND THUMBNAIL ID FROM POST CSV
    let thumbId = null;
    let postSlug = '';

    await new Promise((resolve) => {
        fs.createReadStream(POSTS_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                if (row.title && row.title.includes('Waste rock in mining')) {
                    console.log(`   ✅ FOUND POST IN CSV: ${row.title}`);
                    postSlug = row['wp_post_name'] || row['post_name'];
                    // The standard WP key for featured image ID
                    thumbId = row['meta__thumbnail_id'];
                    console.log(`      Thumbnail ID: ${thumbId}`);
                }
            })
            .on('end', resolve);
    });

    if (!thumbId) {
        console.error("   ❌ Could not find meta__thumbnail_id for this post.");
        return;
    }

    // 2. FIND URL FROM MEDIA CSV
    let cloudUrl = null;

    await new Promise((resolve) => {
        fs.createReadStream(MEDIA_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                // Check ID columns
                const id = row['wp_post_id'] || row['post_id'];

                if (id == thumbId) {
                    // Try attachment_url first, then guid
                    cloudUrl = row['wp_attachment_url'] || row['guid'];

                    // Clean if it got stringified as JSON
                    if (cloudUrl && cloudUrl.startsWith('{')) {
                        try { cloudUrl = JSON.parse(cloudUrl); } catch (e) { }
                    }
                }
            })
            .on('end', resolve);
    });

    if (!cloudUrl) {
        console.error(`   ❌ Could not find Media Entry for ID ${thumbId}`);
        return;
    }

    console.log(`   ✅ FOUND CLOUDINARY URL: ${cloudUrl}`);

    // 3. UPDATE DB (ONLY ONE ROW)
    console.log(`\n   🚀 Updating Database Row...`);
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .ilike('title', '%Waste rock in mining%');

    if (posts && posts.length > 0) {
        const post = posts[0];
        console.log(`      Current DB URL: ${post.featured_image_url}`);

        if (post.featured_image_url !== cloudUrl) {
            const { error } = await supabase
                .from('posts')
                .update({ featured_image_url: cloudUrl })
                .eq('id', post.id);

            if (!error) {
                console.log(`      ✅ SUCCESS: Updated Post ${post.id}`);
            } else {
                console.error(`      ❌ DB Update Failed: ${error.message}`);
            }
        } else {
            console.log("      ⚠️ URL already matches. No update performed.");
        }
    } else {
        console.error("   ❌ Post not found in Supabase Database.");
    }
}

testSinglePost().catch(console.error);
