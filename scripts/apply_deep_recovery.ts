
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

const JSON_FILE = 'scripts/deep_recovery_candidates.json';

async function applyRecovery() {
    console.log("🚀 Applying Deep Recovery for Missing Photos...");

    const filePath = path.resolve(process.cwd(), JSON_FILE);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${JSON_FILE}`);
        return;
    }

    const recoveries = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`📋 Found ${recoveries.length} candidates.`);

    let successCount = 0;

    for (const rec of recoveries) {
        if (!rec.email || !rec.val) continue;

        const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: rec.val })
            .eq('email', rec.email);

        if (error) {
            console.error(`❌ Error updating ${rec.email}: ${error.message}`);
        } else {
            console.log(`✅ Updated ${rec.email}`);
            successCount++;
        }
    }

    console.log(`\n🎉 Deep Recovery Complete: ${successCount} users updated.`);
}

applyRecovery();
