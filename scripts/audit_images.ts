
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

async function audit() {
    console.log("📊 Starting Database & Migration Audit...");

    // 1. Load Maps (Pure CSV Data)
    console.log("   Loading CSV Data...");
    await new Promise((resolve) => {
        fs.createReadStream(MEDIA_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const id = row['wp_post_id'] || row['post_id'];
                const url = row['wp_attachment_url'] || row['guid'];
                if (id && url) {
                    let clean = url.trim();
                    if (clean.startsWith('{')) { try { clean = JSON.parse(clean); } catch { } }
                    mediaIdToUrl.set(id.toString(), clean);
                }
            })
            .on('end', resolve);
    });

    await new Promise((resolve) => {
        fs.createReadStream(POSTS_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const slug = row['wp_post_name'] || row['post_name'];
                const thumbId = row['meta__thumbnail_id'];
                if (slug) slugToThumbId.set(slug, thumbId || 'NULL');
            })
            .on('end', resolve);
    });

    // 2. Fetch All DB Posts
    const { data: dbPosts, error } = await supabase
        .from('posts')
        .select('id, slug, title, featured_image_url');

    if (error) { console.error("DB Error:", error); return; }

    // 3. Analyze
    let total = dbPosts.length;
    let okCloudinary = 0;
    let brokenZvenia = 0;
    let empty = 0;
    let other = 0; // YouTube, etc?

    let noThumbIdInCsv = 0;
    let thumbIdNotFoundInMedia = 0;
    let videoType = 0;

    console.log(`\n🔎 ANALYZING ${total} POSTS IN DB...\n`);

    const missingExamples: any[] = [];

    for (const p of dbPosts) {
        let status = 'UNKNOWN';

        if (!p.featured_image_url) {
            empty++;
            status = 'EMPTY';
        } else if (p.featured_image_url.includes('cloudinary')) {
            okCloudinary++;
            status = 'OK_CLOUD';
        } else if (p.featured_image_url.includes('zvenia.com')) {
            brokenZvenia++;
            status = 'BROKEN_ZVENIA';
        } else if (p.featured_image_url.includes('youtube') || p.featured_image_url.includes('vimeo')) {
            other++;
            status = 'VIDEO_EXT';
        } else {
            other++;
            status = 'OTHER';
        }

        // Deep Dive on NON-OK
        if (status !== 'OK_CLOUD' && status !== 'VIDEO_EXT') {
            const csvThumbId = slugToThumbId.get(p.slug);
            let reason = '';

            if (!csvThumbId) {
                reason = "Post not found in CSV map";
            } else if (csvThumbId === 'NULL') {
                noThumbIdInCsv++;
                reason = "No Thumbnail ID in CSV (Is it PDF? Video?)";
            } else {
                // Has ID, check Media
                const mediaUrl = mediaIdToUrl.get(csvThumbId);
                if (!mediaUrl) {
                    thumbIdNotFoundInMedia++;
                    reason = `Thumb ID ${csvThumbId} NOT found in Media CSV`;
                } else {
                    // Check extension
                    if (mediaUrl.endsWith('.mp4')) {
                        videoType++;
                        reason = "It's an MP4 Video";
                    } else if (mediaUrl.endsWith('.pdf')) {
                        reason = "It's a PDF (Should differ from Image URL)";
                    } else {
                        reason = `URL Exists in CSV (${mediaUrl}) but DB mismatch`;
                    }
                }
            }

            if (missingExamples.length < 15) {
                missingExamples.push({
                    slug: p.slug,
                    dbUrl: p.featured_image_url ? p.featured_image_url.substring(0, 30) + '...' : 'NULL',
                    csvThumbId,
                    diagnosis: reason
                });
            }
        }
    }

    // 4. Print Report
    console.log("------------------------------------------------");
    console.log("📋 FINAL DIAGNOSTIC REPORT");
    console.log("------------------------------------------------");
    console.log(`Total Posts in DB:      ${total}`);
    console.log(`✅ OK (Cloudinary):     ${okCloudinary} (${((okCloudinary / total) * 100).toFixed(1)}%)`);
    console.log(`❌ BROKEN (Zvenia):     ${brokenZvenia}`);
    console.log(`⚪ EMPTY/NULL:          ${empty}`);
    console.log(`🎥 External Video:      ${other}`);
    console.log("------------------------------------------------");
    console.log("🔍 BREAKDOWN OF FAILURES (Why are they broken?)");
    console.log(`   - No Thumbnail ID in WordPress CSV:  ${noThumbIdInCsv}`);
    console.log(`   - Thumb ID exists, but Media Missing:${thumbIdNotFoundInMedia}`);
    console.log(`   - It is actually a LOCAL VIDEO (MP4):${videoType}`);
    console.log("------------------------------------------------");
    console.log("📝 SAMPLES (First 15 Failures):");
    missingExamples.forEach(e => {
        console.log(`   [${e.slug}]`);
        console.log(`       DB: ${e.dbUrl}`);
        console.log(`       ID: ${e.csvThumbId}`);
        console.log(`       Diagnosis: ${e.diagnosis}`);
    });
}

audit().catch(console.error);
