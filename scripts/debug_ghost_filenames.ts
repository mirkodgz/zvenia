
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const OLD_CLOUD_CSV = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';

const filenameToCloudUrl = new Map<string, string>();

async function debugGhostFilenames() {
    console.log("👻 HUNTING GHOST FILES (BY FILENAME)...");

    // 1. Load OLD Cloudinary Map (By Filename)
    console.log("   Loading OLD migrated_cloudinary_urls.csv...");
    if (!fs.existsSync(OLD_CLOUD_CSV)) {
        console.log("   ❌ OLD CSV NOT FOUND!");
        return;
    }

    await new Promise((resolve) => {
        fs.createReadStream(OLD_CLOUD_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                if (row.original_url && row.cloudinary_url) {
                    // Extract filename
                    const fname = row.original_url.split('/').pop()?.split('?')[0].replace(/['"]/g, '');
                    if (fname) filenameToCloudUrl.set(fname.toLowerCase(), row.cloudinary_url.trim());
                }
            })
            .on('end', resolve);
    });
    console.log(`   Detailed ${filenameToCloudUrl.size} filenames from legacy migration.`);

    // 2. Check DB for Broken Links
    const { data: posts } = await supabase
        .from('posts')
        .select('id, slug, featured_image_url, document_url')
        .or('featured_image_url.ilike.%zvenia.com%,document_url.ilike.%zvenia.com%')
        .range(0, 100);

    if (!posts || posts.length === 0) {
        console.log("   No broken zvenia.com links found in DB (Check range/limit?).");
        return;
    }

    console.log(`   Checking ${posts.length} broken links against Legacy Map...`);

    let hits = 0;
    for (const p of posts) {
        // Check Image
        if (p.featured_image_url && p.featured_image_url.includes('zvenia.com')) {
            const fname = p.featured_image_url.split('/').pop()?.split('?')[0].toLowerCase();
            if (fname && filenameToCloudUrl.has(fname)) {
                console.log(`   🎯 [IMG MATCH] ${p.slug} -> ${fname}`);
                console.log(`      Found: ${filenameToCloudUrl.get(fname)}`);
                hits++;
            }
        }

        // Check PDF
        if (p.document_url && p.document_url.includes('zvenia.com')) {
            const fname = p.document_url.split('/').pop()?.split('?')[0].toLowerCase();
            if (fname && filenameToCloudUrl.has(fname)) {
                console.log(`   🎯 [PDF MATCH] ${p.slug} -> ${fname}`);
                console.log(`      Found: ${filenameToCloudUrl.get(fname)}`);
                hits++;
            }
        }
    }

    if (hits === 0) {
        console.log("   ❌ No filename matches found.");
    } else {
        console.log(`   🎉 FOUND ${hits} MATCHES! We can restore these!`);
    }
}

debugGhostFilenames().catch(console.error);
