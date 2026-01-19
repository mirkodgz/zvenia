
import fs from 'fs';
import * as csv from 'fast-csv';

const POSTS_CSV = 'd:/zvenia/migration_data/z-posts-full.csv';
const LEGACY_CLOUD_CSV = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';

const TARGET_TITLE = 'Extreme Close-ups';

async function trace() {
    console.log(`🕵️ TRACING: "${TARGET_TITLE}"`);

    // 1. Find in Posts
    let thumbId = null;
    let pdfId = null;

    await new Promise((resolve) => {
        fs.createReadStream(POSTS_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                // Check multiple title fields just in case
                if ((row.title && row.title.includes(TARGET_TITLE)) || (row.post_title && row.post_title.includes(TARGET_TITLE))) {
                    console.log(`   ✅ Found Post in CSV!`);
                    console.log(`      Title: ${row.title || row.post_title}`);
                    console.log(`      Slug: ${row.wp_post_name || row.post_name}`);

                    thumbId = row['meta__thumbnail_id'];
                    pdfId = row['meta_pdf'] || row['meta_pdf-text-url'];

                    console.log(`      meta__thumbnail_id: ${thumbId}`);
                    console.log(`      meta_pdf: ${pdfId}`);
                }
            })
            .on('end', resolve);
    });

    if (!thumbId && !pdfId) {
        console.log("   ❌ No IDs found in Post row.");
        return;
    }

    // 2. Check Legacy Map
    console.log("   Checking Legacy Map...");
    let foundImg = false;
    let foundPdf = false;

    await new Promise((resolve) => {
        fs.createReadStream(LEGACY_CLOUD_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                if (thumbId && row.media_id == thumbId) {
                    console.log(`   🎯 found IMG match!`);
                    console.log(`      Legacy URL: ${row.cloudinary_url}`);
                    foundImg = true;
                }
                if (pdfId && row.media_id == pdfId) {
                    console.log(`   🎯 found PDF match!`);
                    console.log(`      Legacy URL: ${row.cloudinary_url}`);
                    foundPdf = true;
                }
            })
            .on('end', resolve);
    });

    if (!foundImg && !foundPdf) console.log("   ❌ IDs found in Post but NOT in Legacy Map.");
}

trace().catch(console.error);
