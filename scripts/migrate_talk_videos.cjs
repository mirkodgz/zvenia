require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Config
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const xmlPath = path.join(__dirname, '..', 'z-talks.xml');

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateVideos() {
    console.log('Starting Z-Talks Video Migration...');

    // 1. Read XML
    try {
        const xmlContent = fs.readFileSync(xmlPath, 'utf8');
        console.log(`Read XML file: ${xmlContent.length} bytes`);

        // 2. Parse Items (Simplistic Regex approach since structure is known)
        // We split by <item> to isolate posts
        const items = xmlContent.split('<item>');
        console.log(`Found ${items.length - 1} total items (estimated). parsing...`);

        let updates = 0;
        let errors = 0;

        for (const item of items) {
            // Check if it's a z-talk
            if (!item.includes('<wp:post_type><![CDATA[z-talks]]></wp:post_type>')) {
                continue;
            }

            // Extract Slug (post_name)
            const slugMatch = item.match(/<wp:post_name><!\[CDATA\[(.*?)\]\]><\/wp:post_name>/);
            const slug = slugMatch ? slugMatch[1] : null;

            // Extract Video URL (url-z-talk)
            // Look for the meta key block first
            // Note: The structure is <wp:meta_key>...</wp:meta_key><wp:meta_value>...</wp:meta_value>
            // We need to find the specific key 'url-z-talk' and its corresponding value
            const videoMatch = item.match(/<wp:meta_key><!\[CDATA\[url-z-talk\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/s);
            const videoUrl = videoMatch ? videoMatch[1] : null;

            if (slug && videoUrl) {
                console.log(`Processing: ${slug} -> ${videoUrl}`);

                // 3. Update Supabase
                const { error } = await supabase
                    .from('talks')
                    .update({ video_url: videoUrl })
                    .eq('slug', slug);

                if (error) {
                    console.error(`Failed to update ${slug}:`, error.message);
                    errors++;
                } else {
                    console.log(`✅ Updated ${slug}`);
                    updates++;
                }
            } else if (slug) {
                console.log(`⚠️  Skipping ${slug}: No video URL found in XML`);
            }
        }

        console.log('-----------------------------------');
        console.log(`Migration Complete.`);
        console.log(`Successful Updates: ${updates}`);
        console.log(`Errors: ${errors}`);

    } catch (err) {
        console.error('Migration failed:', err);
    }
}

migrateVideos();
