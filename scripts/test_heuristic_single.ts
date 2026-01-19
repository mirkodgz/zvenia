
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
const TARGET_SLUG_PART = 'metiers';

async function testHeuristic() {
    console.log("🧪 TESTING HEURISTIC ON SINGLE POST...");
    console.log(`   Target Pattern: ${TARGET_SLUG_PART}`);

    // 1. Find Post in CSV
    let foundRow: any = null;

    await new Promise((resolve) => {
        fs.createReadStream(OLD_POSTS_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const title = row['post_title'] || row['title'];
                if (title && title.includes('Métiers des Mines')) {
                    foundRow = row;
                }
            })
            .on('end', resolve);
    });

    if (!foundRow) {
        console.log("❌ Post 'Métiers des Mines' NOT found in legacy CSV.");
        return;
    }

    console.log(`   ✅ Found CSV Row: ${foundRow['post_title']}`);

    // 2. Extract Filename
    let filename = '';
    const keys = Object.keys(foundRow);
    for (const key of keys) {
        const val = foundRow[key];
        if (val && val.length > 5 && val.toLowerCase().endsWith('.pdf')) {
            // Found a PDF path!
            console.log(`   Found PDF Path in [${key}]: ${val}`);
            filename = val.split('?')[0].split('/').pop();
            break;
        }
    }

    if (!filename) {
        console.log("❌ No PDF filename found in CSV row.");
        return;
    }

    const finalUrl = `${CLOUD_PREFIX}${filename}`;
    console.log(`\n   🎯 GENERATED URL: ${finalUrl}`);

    // 3. Update DB
    // First find the exact post ID
    const { data: posts } = await supabase.from('posts').select('id, slug, document_url').ilike('title', '%Métiers des Mines%');

    if (posts && posts.length > 0) {
        const p = posts[0];
        console.log(`   Updating DB Post: ${p.slug} (ID: ${p.id})`);

        const { error } = await supabase.from('posts').update({ document_url: finalUrl }).eq('id', p.id);

        if (!error) console.log("   ✅ SUCCESS! Database updated.");
        else console.error("   ❌ DB Error:", error.message);
    } else {
        console.log("   ❌ Post not found in Supabase.");
    }
}

testHeuristic().catch(console.error);
