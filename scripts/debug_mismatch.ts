
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import * as csv from 'fast-csv';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const CSV_PATH = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';

async function debug() {
    console.log("🔍 INVESTIGATION START");

    // 1. Get a SAMPLE BAD URL from DB
    const { data: dbData } = await supabase
        .from('posts')
        .select('slug, featured_image_url')
        .ilike('featured_image_url', '%zvenia.com%')
        .limit(1);

    if (!dbData || dbData.length === 0) {
        console.log("✅ No Zvenia URLs found in DB. You are clean?");
        return;
    }

    const badUrl = dbData[0].featured_image_url || '';
    const badSlug = dbData[0].slug;

    console.log(`❌ DB Sample (${badSlug}):`);
    console.log(`START>>${badUrl}<<END`);
    console.log(`HEAD: ${badUrl.substring(0, 50)}`);
    console.log(`TAIL: ${badUrl.substring(badUrl.length - 50)}`);
    console.log(`   Length: ${badUrl.length}`);

    // 2. Scan CSV for ANYTHING resembling this
    // Extract filename to search
    const filename = badUrl.split('/').pop();
    console.log(`\n🔎 Searching CSV for filename: "${filename}"...`);

    const stream = fs.createReadStream(CSV_PATH);
    let foundAny = false;

    csv.parseStream(stream, { headers: true })
        .on('data', (row: any) => {
            const csvOriginal = row.original_url;
            if (csvOriginal.includes(filename)) {
                console.log(`\n✅ FOUND MATCH IN CSV!`);
                console.log(`   CSV Original: "${csvOriginal}"`);
                console.log(`   CSV Length:   ${csvOriginal.length}`);

                // Compare character by character
                if (csvOriginal !== badUrl) {
                    console.log(`   ⚠️ STRICT MATCH FAIL.`);
                    console.log(`   DIFF:`);
                    for (let i = 0; i < Math.max(badUrl.length, csvOriginal.length); i++) {
                        if (badUrl[i] !== csvOriginal[i]) {
                            console.log(`     Pos ${i}: DB='${badUrl.charCodeAt(i)}'(${badUrl[i]}) vs CSV='${csvOriginal.charCodeAt(i)}'(${csvOriginal[i]})`);
                            break;
                        }
                    }
                } else {
                    console.log(`   ✨ EXACT MATCH! Why did update fail?`);
                }
                foundAny = true;
            }
        })
        .on('end', () => {
            if (!foundAny) console.log("\n❌ FILENAME NOT FOUND IN CSV AT ALL.");
        });
}

debug();
