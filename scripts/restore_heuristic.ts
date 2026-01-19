
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const OLD_POSTS_CSV = 'd:/zvenia/migration_data/z-posts-full.csv';
const CLOUD_PREFIX = 'https://res.cloudinary.com/dun3slcfg/image/upload/v1767694336/cloud-files/';

async function restoreHeuristic() {
    console.log("🪄 STARTING HEURISTIC RESTORATION V2 (ROBUST)...");
    console.log(`   Pattern: ${CLOUD_PREFIX}[FILENAME]`);

    // 1. Get Missing Posts from DB
    const { data: missingPosts } = await supabase
        .from('posts')
        .select('id, slug, document_url')
        .or('document_url.is.null,document_url.eq."",document_url.ilike.%zvenia.com%,document_url.ilike.%/wp-content/%');

    if (!missingPosts || missingPosts.length === 0) {
        console.log("   No missing PDF posts found in DB.");
        return;
    }

    const missingSlugMap = new Set(missingPosts.map(p => p.slug));
    console.log(`   Targeting ${missingSlugMap.size} posts missing PDFs.`);

    let updated = 0;

    // 2. Scan OLD CSV for Filenames
    fs.createReadStream(OLD_POSTS_CSV)
        .pipe(csv.parse({ headers: true }))
        .on('data', async (row: any) => {
            const slug = row['wp_post_name'] || row['post_name'];

            if (slug && missingSlugMap.has(slug)) {
                // Look for ANY legacy URL in the row to grab a filename
                let candidateUrl = '';

                const keys = Object.keys(row);
                for (const key of keys) {
                    const val = row[key];
                    // RELAXED MATCH: "includes" instead of "endsWith" to handle query params/newlines
                    if (val && val.length > 5 && val.toLowerCase().includes('.pdf')) {
                        candidateUrl = val;
                        // console.log(`      Found potential PDF in [${key}]: ${val.substring(0, 50)}...`);
                        break;
                    }
                }

                if (candidateUrl) {
                    // Extract Filename - Robust Method
                    // 1. Remove Query params
                    const cleanUrl = candidateUrl.split('?')[0];
                    // 2. Remove whitespace/newlines/quotes
                    const trimmed = cleanUrl.replace(/[\n\r"']/g, '').trim();
                    // 3. Get filename
                    const filename = trimmed.split('/').pop();

                    if (filename && filename.length > 4 && filename.toLowerCase().endsWith('.pdf')) {
                        const newUrl = `${CLOUD_PREFIX}${filename}`;

                        // Update DB
                        const { error } = await supabase
                            .from('posts')
                            .update({ document_url: newUrl })
                            .eq('slug', slug);

                        if (!error) {
                            console.log(`   ✅ [HEURISTIC] ${slug}`);
                            console.log(`      Src: ${filename} -> Dest: ${newUrl}`);
                            updated++;
                        }
                    }
                }
            }
        })
        .on('end', () => {
            setTimeout(() => {
                console.log(`\n🎉 HEURISTIC PROCESS COMPLETE. Estimated Updates: ${updated}`);
            }, 5000);
        });
}

restoreHeuristic().catch(console.error);
