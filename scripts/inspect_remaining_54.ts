
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function inspectRemaining() {
    console.log("🕵️ INSPECTING REMAINING NON-CLOUDINARY LINKS...");

    // Fetch everything that DOES NOT have 'res.cloudinary' in document_url
    // We want to see what's left: nulls, external links, weird paths.
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, slug, document_url, title');

    if (error) { console.error(error); return; }

    let count = 0;
    const types = {
        'Null/Empty': 0,
        'External (http)': 0,
        'WordPress (wp-content)': 0,
        'Other': 0
    };

    console.log("\n--- Sample of Remaining Issues ---");

    for (const p of posts) {
        const url = p.document_url;

        // Skip valid ones
        if (url && url.includes('res.cloudinary.com')) continue;

        count++;

        let type = 'Other';
        if (!url) type = 'Null/Empty';
        else if (url.includes('/wp-content/')) type = 'WordPress (wp-content)';
        else if (url.startsWith('http')) type = 'External (http)';

        types[type]++;

        if (count <= 20) { // Show first 20 samples
            console.log(`[${type}] ${p.slug.substring(0, 30)}...`);
            console.log(`    URL: ${url}`);
        }
    }

    console.log("\n--- SUMMARY of REMAINING ---");
    console.log(JSON.stringify(types, null, 2));
    console.log(`Total Non-Cloudinary: ${count}`);
}

inspectRemaining().catch(console.error);
