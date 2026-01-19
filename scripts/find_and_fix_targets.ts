
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const MEDIA_CSV = 'd:/zvenia/migration_data/datos nuevos/media-limpio.csv';

// Map: Filename Part -> [Possible URLs]
const mediaFileMap = new Map<string, string[]>();

async function loadMedia() {
    console.log("📂 Loading Media CSV...");
    return new Promise((resolve) => {
        fs.createReadStream(MEDIA_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const url = row['wp_attachment_url'] || row['guid'];
                if (url) {
                    // Store by filename key (lowercase for fuzzy match)
                    const filename = url.split('/').pop().toLowerCase();
                    if (!mediaFileMap.has(filename)) {
                        mediaFileMap.set(filename, []);
                    }
                    mediaFileMap.get(filename)?.push(url);
                }
            })
            .on('end', resolve);
    });
}

function findBestMatch(partialName: string): string | null {
    partialName = partialName.toLowerCase();
    for (const [filename, urls] of mediaFileMap.entries()) {
        if (filename.includes(partialName)) {
            // Prefer one that *starts* with it or is exact?
            // For now take the first valid one
            return urls[0];
        }
    }
    return null;
}

async function fixTargets() {
    await loadMedia();
    console.log(`   Loaded ${mediaFileMap.size} unique filenames from Media CSV.`);

    const targets = [
        { title: 'Final Wall Control', fileHint: 'FULLTEXT01' },
        { title: 'Dimensionamento de blocos', fileHint: 'block_volume' },
        { title: 'Vertical Distance Rate', fileHint: 'Virtual_Distance' }, // Spelling? Or 'Vertical'
        { title: 'Modelos para previsão', fileHint: 'Modelos' }
    ];

    // Correction for Vertical Distance based on user image text: 
    // "Vertical Distance Rate Adjustment_Open Pit Mining Contract (9 Pages)"
    // Filename likely includes "Vertical" or "Adjustment"

    for (const t of targets) {
        console.log(`\n🔍 Processing: ${t.title} (Hint: ${t.fileHint})`);

        let bestUrl = findBestMatch(t.fileHint);
        if (!bestUrl && t.fileHint === 'Virtual_Distance') bestUrl = findBestMatch('Vertical'); // Retry

        if (bestUrl) {
            console.log(`   ✅ match found: ${bestUrl}`);

            // Update DB
            const { data: posts } = await supabase.from('posts').select('id, slug').ilike('title', `%${t.title}%`);
            if (posts && posts.length > 0) {
                const { error } = await supabase.from('posts').update({ document_url: bestUrl }).eq('id', posts[0].id);
                if (!error) console.log(`   🎉 Updated Post: ${posts[0].slug}`);
                else console.error(`   ❌ Update Error: ${error.message}`);
            } else {
                console.log(`   ⚠️ Post not found in DB`);
            }
        } else {
            console.log(`   ❌ No media match for hint '${t.fileHint}'`);
        }
    }
}

fixTargets().catch(console.error);
