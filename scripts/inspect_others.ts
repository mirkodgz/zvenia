
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function inspectOthers() {
    console.log("🕵️ INSPECTING NON-CLOUDINARY LINKS...");

    const { data: posts, error } = await supabase
        .from('posts')
        .select('slug, document_url')
        .not('document_url', 'is', null);

    if (error) { console.error(error); return; }

    let count = 0;
    for (const p of posts) {
        const url = p.document_url;
        // Skip valid Cloudinary
        if (url && !url.includes('res.cloudinary.com')) {
            console.log(`[SLUG]: ${p.slug}`);
            console.log(`    URL: ${url}`);
            count++;
        }
    }
    console.log(`\nTotal 'Other' Links: ${count}`);
}

inspectOthers().catch(console.error);
