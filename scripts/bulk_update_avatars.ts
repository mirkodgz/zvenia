
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';
import fs from 'fs';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const JSON_FILE = 'scripts/recovered_photos.json';

async function bulkUpdate() {
    console.log("🚀 Starting Bulk Avatar Update...");

    const filePath = path.resolve(process.cwd(), JSON_FILE);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${JSON_FILE}`);
        return;
    }

    const recoveries = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`📋 Found ${recoveries.length} potential updates.`);

    let successCount = 0;
    let errorCount = 0;

    // Process in chunks to avoid rate limits? 500 requests is fine for Supabase usually, but serial is safer.
    // Let's do batches of 10.

    const BATCH_SIZE = 10;
    for (let i = 0; i < recoveries.length; i += BATCH_SIZE) {
        const batch = recoveries.slice(i, i + BATCH_SIZE);

        await Promise.all(batch.map(async (rec: any) => {
            if (!rec.email || !rec.url) return;

            // Optional: Check if user exists first to avoid unnecessary updates? 
            // Update logic is idempotent enough.

            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: rec.url })
                .eq('email', rec.email);

            if (error) {
                console.error(`❌ Error updating ${rec.email}: ${error.message}`);
                errorCount++;
            } else {
                successCount++;
            }
        }));

        process.stdout.write(`\r✅ Progress: ${Math.min(i + BATCH_SIZE, recoveries.length)}/${recoveries.length}`);
    }

    console.log("\n\n🎉 Bulk Update Complete!");
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
}

bulkUpdate();
