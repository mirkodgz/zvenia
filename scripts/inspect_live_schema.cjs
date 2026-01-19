
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
// Try to get service key, fallback if needed (though we expect it in .env)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    const tableName = process.argv[2] || 'podcasts';
    console.log(`--- CHECKING INFORMATION SCHEMA FOR: ${tableName} ---`);

    const { data, error } = await supabase.from(tableName).select('*').limit(1);

    if (error) {
        console.error(`Error fetching ${tableName}:`, error.message);
        console.error('Details:', error);
    } else {
        if (data && data.length > 0) {
            console.log('✅ DATA FOUND. COLUMNS DETECTED:');
            // Sort keys
            const keys = Object.keys(data[0]).sort();
            keys.forEach(k => console.log(`- ${k}`));
        } else {
            console.log('⚠️ Table is empty. Cannot detect columns from row data.');
            console.log('Attempting to check metadata via Rpc (if available)...');
        }
    }
}

checkSchema();
