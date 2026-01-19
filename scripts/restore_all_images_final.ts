
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

// Dictionaries
const slugToThumbId = new Map<string, string>();
const mediaIdToUrl = new Map<string, string>();

async function loadMaps() {
    console.log("📂 Loading Media Map...");
    await new Promise((resolve) => {
        fs.createReadStream(MEDIA_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const id = row['wp_post_id'] || row['post_id'];
                const url = row['wp_attachment_url'] || row['guid'];
                if (id && url) {
                    let cleanUrl = url;
                    if (cleanUrl.startsWith('{')) { try { cleanUrl = JSON.parse(cleanUrl); } catch (e) { } }
                    mediaIdToUrl.set(id.toString(), cleanUrl.trim());
                }
            })
            .on('end', resolve);
    });
    console.log(`   ✅ Media Map Loaded: ${mediaIdToUrl.size} entries.`);

    console.log("📂 Loading Posts Map...");
    await new Promise((resolve) => {
        fs.createReadStream(POSTS_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const slug = row['wp_post_name'] || row['post_name'];
                const thumbId = row['meta__thumbnail_id']; // Confirmed key for Featured Image

                if (slug && thumbId) {
                    slugToThumbId.set(slug, thumbId);
                }
            })
            .on('end', resolve);
    });
    console.log(`   ✅ Posts Map Loaded: ${slugToThumbId.size} entries.`);
}

async function restoreAll() {
    await loadMaps();

    console.log("\n🚀 Starting Massive Restore (Featured Images)...");

    // Process in batches from Supabase to avoid timeouts
    let page = 0;
    const pageSize = 100;
    let totalUpdated = 0;

    while (true) {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('id, slug, featured_image_url')
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) { console.error("Error fetching posts:", error); break; }
        if (!posts || posts.length === 0) break;

        console.log(`   Processing batch ${page + 1} (${posts.length} posts)...`);

        for (const post of posts) {
            if (!post.slug) continue;

            // 1. Resolve Thumb ID
            const thumbId = slugToThumbId.get(post.slug);
            if (!thumbId) continue;

            // 2. Resolve URL
            const cloudUrl = mediaIdToUrl.get(thumbId);
            if (!cloudUrl) {
                // console.warn(`   ⚠️ Post '${post.slug}' has thumb ID ${thumbId} but not found in Media.`);
                continue;
            }

            // 3. Update if needed
            if (post.featured_image_url !== cloudUrl) {
                const { error: upErr } = await supabase
                    .from('posts')
                    .update({ featured_image_url: cloudUrl })
                    .eq('id', post.id);

                if (!upErr) {
                    totalUpdated++;
                    console.log(`      ✅ Restored: ${post.slug}`);
                } else {
                    console.error(`      ❌ Failed ${post.slug}: ${upErr.message}`);
                }
            }
        }

        page++;
    }

    console.log(`\n🎉 MASSIVE RESTORE COMPLETE.`);
    console.log(`   Total Updated: ${totalUpdated}`);
}

restoreAll().catch(console.error);
