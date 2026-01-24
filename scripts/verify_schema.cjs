require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkColumn() {
    console.log('Checking for video_url column in talks table...');

    // Try to select the specific column. If it doesn't exist, Supabase/Postgres usually throws an error
    const { data, error } = await supabase
        .from('talks')
        .select('video_url')
        .limit(1);

    if (error) {
        console.error('❌ Error assessing schema:', error.message);
        console.log('Diagnosis: The column likely does NOT exist.');
    } else {
        console.log('✅ Column video_url access successful.');
        console.log('Sample data:', data);
    }
}

checkColumn();
