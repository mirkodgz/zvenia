
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://ddgdtdhgaqeqnoigmfrh.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;
const CSV_PATH = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';

if (!SERVICE_KEY) {
    console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

function normalize(s: string): string {
    if (!s) return '';
    // Remove extension
    const parts = s.split('.');
    if (parts.length > 1) parts.pop();
    const noExt = parts.join('.');
    // Remove all non-alphanumeric
    return noExt.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Load Map KEYED BY NORMALIZED FILENAME
async function loadUrlMap(): Promise<Map<string, string>> {
    console.log("📂 Loading URL Map (Normalized Fuzzy Mode)...");
    const urlMap = new Map<string, string>();

    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(CSV_PATH);
        csv.parseStream(stream, { headers: true })
            .on('data', (row: any) => {
                let oldUrl = row.original_url ? row.original_url.trim().replace(/^['"]+|['"]+$/g, '') : '';
                let newUrl = row.cloudinary_url ? row.cloudinary_url.trim().replace(/^['"]+|['"]+$/g, '') : '';

                if (oldUrl && newUrl && newUrl !== 'FAILED') {
                    const fname = oldUrl.split('/').pop();
                    if (fname && fname.length > 3) {
                        const norm = normalize(fname);
                        if (norm.length > 5) {
                            urlMap.set(norm, newUrl);
                        }
                    }
                }
            })
            .on('end', () => {
                console.log(`✅ Loaded ${urlMap.size} normalized filename mappings.`);
                resolve(urlMap);
            })
            .on('error', reject);
    });
}

// Generic updater
async function updateTable(
    table: string,
    columns: string[],
    urlMap: Map<string, string>
) {
    console.log(`\n🔍 Scanning table: ${table}...`);

    // Select ID and the target columns
    const { data: items, error } = await supabase
        .from(table)
        .select(`id, slug, ${columns.join(', ')}`);

    if (error) {
        console.error(`Error fetching ${table}:`, error.message);
        return;
    }

    let updates = 0;

    for (const item of items) {
        let needsUpdate = false;
        const payload: any = {};

        for (const col of columns) {
            const val = (item as any)[col];
            if (typeof val === 'string' && val.includes('zvenia.com')) {
                // Extract & Normalize DB Filename
                const dbFname = val.split('/').pop()?.split('?')[0];
                if (dbFname) {
                    const normDb = normalize(dbFname);

                    // 1. Exact Match on Normalized
                    if (urlMap.has(normDb)) {
                        payload[col] = urlMap.get(normDb);
                        needsUpdate = true;
                    }
                    // 2. Fuzzy Substring Match
                    else {
                        for (const [key, cloudUrl] of urlMap.entries()) {
                            if ((normDb.includes(key) && key.length > 8) || (key.includes(normDb) && normDb.length > 8)) {
                                payload[col] = cloudUrl;
                                needsUpdate = true;
                                console.log(`   [FUZZY] ${dbFname} -> Match!`);
                                break;
                            }
                        }
                    }
                }
            }
        }

        if (needsUpdate) {
            const { error: upErr } = await supabase
                .from(table)
                .update(payload)
                .eq('id', item.id);

            if (upErr) console.error(`   Failed to update ${item.slug}:`, upErr.message);
            else updates++;
        }
    }

    console.log(`   ✅ Updated ${updates} rows in ${table}.`);
}

async function run() {
    if (!fs.existsSync(CSV_PATH)) {
        console.error("CSV Mapping file not found!");
        return;
    }

    const urlMap = await loadUrlMap();

    await updateTable('posts', ['featured_image_url', 'document_url'], urlMap);
    await updateTable('events', ['featured_image_url'], urlMap);
    await updateTable('podcasts', ['featured_image_url'], urlMap);
    await updateTable('services', ['featured_image_url'], urlMap);
    await updateTable('presentations', ['file_url', 'featured_image_url'], urlMap);
    await updateTable('talks', ['featured_image_url'], urlMap);

    console.log("\n🎉 Restoration Complete.");
}

run().catch(console.error);
