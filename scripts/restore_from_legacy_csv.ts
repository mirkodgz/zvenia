
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
const LEGACY_POSTS_CSV = 'd:/zvenia/migration_data/z-posts-full.csv';
const MEDIA_CSV = 'd:/zvenia/migration_data/datos nuevos/media-limpio.csv';
const LEGACY_CLOUD_CSV = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';

// MAPS
const mediaIdToUrl = new Map<string, string>(); // From Media CSV
const legacyIdToUrl = new Map<string, string>(); // From Legacy Cloudinary CSV

async function loadMaps() {
    console.log("📂 Loading Maps...");

    // 1. Load Standard Media Map
    await new Promise((resolve) => {
        fs.createReadStream(MEDIA_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const id = row['wp_post_id'] || row['post_id'];
                const url = row['wp_attachment_url'] || row['guid'];
                if (id && url) mediaIdToUrl.set(id.toString(), url.trim());
            })
            .on('end', resolve);
    });

    // 2. Load Legacy Cloudinary Map
    if (fs.existsSync(LEGACY_CLOUD_CSV)) {
        await new Promise((resolve) => {
            fs.createReadStream(LEGACY_CLOUD_CSV)
                .pipe(csv.parse({ headers: true }))
                .on('data', (row: any) => {
                    if (row.media_id && row.cloudinary_url) {
                        legacyIdToUrl.set(row.media_id.toString(), row.cloudinary_url.trim());
                    }
                })
                .on('end', resolve);
        });
    }

    console.log(`   ✅ Maps Loaded: Standard (${mediaIdToUrl.size}), Legacy (${legacyIdToUrl.size})`);
}

async function restoreFromLegacy() {
    await loadMaps();
    console.log("🚀 STARTING LEGACY RESTORE (Archeology Mode)...");

    let updated = 0;

    // Scan the OLD Posts CSV
    fs.createReadStream(LEGACY_POSTS_CSV)
        .pipe(csv.parse({ headers: true }))
        .on('data', async (row: any) => {
            const slug = row['wp_post_name'] || row['post_name'];
            if (!slug) return;

            // Extract IDs from OLD data
            const thumbId = row['meta__thumbnail_id'];
            const pdfId = row['meta_pdf'] || row['meta_pdf-text-url']; // Guessing keys from previous learnings

            // Is this post missing in DB?
            // Checking DB one by one is slow. Let's do a batch check or just "Upsert" logic?
            // To be safe, let's select from DB first.
            const { data: posts } = await supabase
                .from('posts')
                .select('id, featured_image_url, document_url')
                .eq('slug', slug);

            if (posts && posts.length > 0) {
                const p = posts[0];
                let userUpdates: any = {};
                let hasChanges = false;

                // 1. Try to Fix Image
                if ((!p.featured_image_url || p.featured_image_url.includes('zvenia.com')) && thumbId) {
                    let cloudUrl = mediaIdToUrl.get(thumbId) || legacyIdToUrl.get(thumbId);
                    if (cloudUrl) {
                        userUpdates.featured_image_url = cloudUrl;
                        hasChanges = true;
                        // console.log(`   [IMG FIX] ${slug} -> ${cloudUrl.split('/').pop()}`);
                    }
                }

                // 2. Try to Fix PDF
                if ((!p.document_url || p.document_url.includes('zvenia.com')) && pdfId) {
                    // If pdfId is numeric, lookup. If URL, verify/use.
                    let cloudPdf = null;
                    if (/^\d+$/.test(pdfId)) {
                        cloudPdf = mediaIdToUrl.get(pdfId) || legacyIdToUrl.get(pdfId);
                    } else if (pdfId.includes('http')) {
                        cloudPdf = pdfId; // Assume legacy URL is valid if it's external? or maybe broken zvenia?
                    }

                    if (cloudPdf && !cloudPdf.includes('zvenia.com')) {
                        userUpdates.document_url = cloudPdf;
                        hasChanges = true;
                        // console.log(`   [PDF FIX] ${slug} -> ${cloudPdf.split('/').pop()}`);
                    }
                }

                if (hasChanges) {
                    const { error } = await supabase.from('posts').update(userUpdates).eq('id', p.id);
                    if (!error) {
                        updated++;
                        process.stdout.write('+'); // Progress indicator
                    } else {
                        console.error(`Error updating ${slug}:`, error.message);
                    }
                }
            }
        })
        .on('end', () => {
            console.log(`\n\n🎉 LEGACY RESTORE COMPLETE. Updated: ${updated} posts.`);
        });
}

restoreFromLegacy().catch(console.error);
