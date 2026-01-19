
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const POSTS_CSV = 'd:/zvenia/migration_data/datos nuevos/z-post-limpio.csv';
const OLD_CLOUD_CSV = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';

const slugToMeta = new Map<string, any>();
const oldMigratedMap = new Map<string, string>();

async function debugGhosts() {
    console.log("👻 HUNTING GHOST FILES...");

    // 1. Load OLD Cloudinary Map
    console.log("   Loading OLD migrated_cloudinary_urls.csv...");
    await new Promise((resolve) => {
        if (!fs.existsSync(OLD_CLOUD_CSV)) {
            console.log("   ❌ OLD CSV NOT FOUND!");
            resolve(null);
            return;
        }
        fs.createReadStream(OLD_CLOUD_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                if (row.media_id && row.cloudinary_url) {
                    oldMigratedMap.set(row.media_id.toString(), row.cloudinary_url);
                }
            })
            .on('end', resolve);
    });
    console.log(`   Detailed ${oldMigratedMap.size} legacy migration entries.`);

    // 2. Load Posts Metadata
    console.log("   Loading Posts metadata...");
    await new Promise((resolve) => {
        fs.createReadStream(POSTS_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const slug = row['wp_post_name'] || row['post_name'];
                if (slug) {
                    slugToMeta.set(slug, {
                        thumbId: row['meta__thumbnail_id'],
                        pdfVal: row['meta_pdf-text-url'] || row['meta_file']
                    });
                }
            })
            .on('end', resolve);
    });

    // 3. Check DB for Missing Items
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .or('featured_image_url.is.null,document_url.is.null')
        .range(0, 50); // Check first 50 missing

    if (!posts || posts.length === 0) {
        console.log("   No missing posts found in range.");
        return;
    }

    console.log(`   Checking ${posts.length} incomplete posts against Legacy Map...`);

    let hits = 0;
    for (const p of posts) {
        if (!p.slug) continue;
        const meta = slugToMeta.get(p.slug);

        if (!meta) continue;

        // CHECK IMAGE
        if (!p.featured_image_url || p.featured_image_url.includes('zvenia.com')) {
            if (meta.thumbId) {
                const legacyUrl = oldMigratedMap.get(meta.thumbId);
                if (legacyUrl) {
                    console.log(`   🎯 [IMAGE HIT] Post: ${p.slug} | ID: ${meta.thumbId} -> FOUND in Legacy CSV!`);
                    console.log(`      -> ${legacyUrl}`);
                    hits++;
                }
            }
        }

        // CHECK PDF
        if (!p.document_url || p.document_url.includes('zvenia.com')) {
            if (meta.pdfVal && /^\d+$/.test(meta.pdfVal)) {
                const legacyUrl = oldMigratedMap.get(meta.pdfVal);
                if (legacyUrl) {
                    console.log(`   🎯 [PDF HIT] Post: ${p.slug} | ID: ${meta.pdfVal} -> FOUND in Legacy CSV!`);
                    console.log(`      -> ${legacyUrl}`);
                    hits++;
                }
            }
        }
    }

    if (hits === 0) {
        console.log("   ❌ No hits in Legacy CSV for these missing items.");
    } else {
        console.log(`   🎉 FOUND ${hits} RECOVERABLE ITEMS in Legacy CSV!`);
    }
}

debugGhosts().catch(console.error);
