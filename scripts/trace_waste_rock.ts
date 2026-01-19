
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// FILES
const POSTS_CSV = 'd:/zvenia/migration_data/datos nuevos/z-post-limpio.csv';
const MEDIA_CSV = 'd:/zvenia/migration_data/datos nuevos/media-limpio.csv';
const CLOUD_CSV = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';

async function traceWasteRock() {
    console.log("🕵️ TRACING 'Waste rock in mining'...");

    // 1. FIND THUMBNAIL ID IN POSTS
    let thumbId = null;
    let postFound = false;

    console.log("   Loading Posts...");
    await new Promise((resolve) => {
        fs.createReadStream(POSTS_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                if (row.title && row.title.includes('Waste rock in mining')) {
                    console.log(`   ✅ Found Post: "${row.title}"`);
                    // Try standard meta key
                    thumbId = row['meta__thumbnail_id'];

                    if (!thumbId) {
                        // Fallback check all keys for a number around 1635? No, trust key first.
                        // Debug keys if missing
                        // console.log(Object.keys(row).filter(k=>k.includes('thumb')));
                    }
                    console.log(`      Thumbnail ID: ${thumbId}`);
                    postFound = true;
                }
            })
            .on('end', resolve);
    });

    if (!thumbId) {
        console.log("❌ Failed to get Thumbnail ID.");
        return;
    }

    // 2. FIND ORIGINAL URL IN MEDIA
    console.log(`\n   Loading Media (Looking for ID ${thumbId})...`);
    let originalUrl = null;
    let foundMedia = false;

    await new Promise((resolve) => {
        fs.createReadStream(MEDIA_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                // Check ID columns (wp_post_id, post_id, etc)
                const id = row['wp_post_id'] || row['post_id'];

                if (id == thumbId) {
                    foundMedia = true;
                    // Try getting URL from guid or attachment_url
                    originalUrl = row['wp_attachment_url'] || row['guid'];
                    // Sometimes guid is an object in XML2JS? Helper might have JSONified it
                    if (originalUrl && originalUrl.startsWith('{')) {
                        try { originalUrl = JSON.parse(originalUrl); } catch (e) { }
                    }
                    console.log(`   ✅ Found Media Entry!`);
                    console.log(`      Original URL: ${originalUrl}`);
                }
            })
            .on('end', resolve);
    });

    if (!originalUrl) {
        console.log("❌ Failed to find Media URL for this ID.");
        return;
    }

    // 3. FIND CLOUDINARY URL
    console.log(`\n   Searching Cloudinary Map for: ${originalUrl}`);
    let cloudUrl = null;

    await new Promise((resolve) => {
        fs.createReadStream(CLOUD_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                // Normalize for comparison
                const mapUrl = row.original_url?.trim().replace(/^['"]+|['"]+$/g, '');
                if (mapUrl === originalUrl) {
                    cloudUrl = row.cloudinary_url;
                }
            })
            .on('end', resolve);
    });

    if (cloudUrl) {
        console.log(`   🎉 FOUND CLOUDINARY URL: ${cloudUrl}`);

        // 4. UPDATE DB
        console.log(`\n   🚀 Updating Database...`);
        const { data: posts } = await supabase.from('posts').select('*').ilike('title', '%Waste rock in mining%');
        if (posts && posts.length > 0) {
            const { error } = await supabase
                .from('posts')
                .update({ featured_image_url: cloudUrl })
                .eq('id', posts[0].id);

            if (!error) console.log("   ✅ DATABASE UPDATED SUCCESSFULLY.");
            else console.error("   ❌ DB Update Error:", error.message);
        }
    } else {
        console.log("❌ URL not found in Cloudinary Map. Trying filename match...");
        // Fallback: Check by filename
        const targetFname = originalUrl.split('/').pop();
        console.log(`   Trying filename: ${targetFname}`);

        await new Promise((resolve) => {
            fs.createReadStream(CLOUD_CSV)
                .pipe(csv.parse({ headers: true }))
                .on('data', async (row: any) => {
                    const mapUrl = row.original_url?.trim().replace(/^['"]+|['"]+$/g, '');
                    if (mapUrl && mapUrl.includes(targetFname)) {
                        console.log(`   ⚡ Fuzzy Filename Match: ${mapUrl}`);
                        console.log(`   -> New URL: ${row.cloudinary_url}`);

                        // UPDATE
                        const { data: posts } = await supabase.from('posts').select('*').ilike('title', '%Waste rock in mining%');
                        if (posts && posts.length > 0) {
                            const { error } = await supabase.from('posts').update({ featured_image_url: row.cloudinary_url }).eq('id', posts[0].id);
                            if (!error) console.log("   ✅ FUZZY UPDATE SUCCESS!");
                            else console.error("   ❌ Update Error", error);
                        }
                    }
                })
                .on('end', resolve);
        });
    }
}

traceWasteRock();
