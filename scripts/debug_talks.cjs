
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('FATAL: Could not load env vars.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTalks() {
    console.log(`\n=== DEBUGGING TALKS TABLE (JS) ===\n`);

    // 1. Check count
    const { count, error: countError } = await supabase
        .from('talks')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error("❌ Error accessing 'talks' table:", countError.message);
        return;
    }
    console.log(`✅ Table 'talks' exists. Total rows: ${count}`);

    // 2. Fetch data
    const { data: talks, error } = await supabase
        .from('talks')
        .select('*')
        .limit(20);

    if (error) {
        console.error("❌ Error fetching rows:", error);
    } else {
        const result = {
            count,
            sampleSize: talks.length,
            sample: talks
        };
        fs.writeFileSync('talks_data.json', JSON.stringify(result, null, 2));
        console.log("Data written to talks_data.json");
    }
}

checkTalks();
