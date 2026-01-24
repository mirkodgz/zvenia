
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('FATAL: Could not load env vars.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProfiles() {
    console.log(`\n=== DEBUGGING PROFILES (JS) ===\n`);

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, first_name, last_name, username');

    if (error) {
        console.error("❌ Error fetching rows:", error);
    } else {
        console.log("\nProfiles:");
        if (!profiles || profiles.length === 0) {
            console.log("   (No profiles found)");
        } else {
            console.table(profiles);
        }
    }
}

checkProfiles();
