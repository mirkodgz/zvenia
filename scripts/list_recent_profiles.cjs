
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listRecentProfiles() {
    console.log('Fetching last 5 profiles...');
    const { data, error } = await supabase
        .from('profiles')
        .select('email, created_at, full_name, country, profession')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error:', error);
    } else {
        console.table(data);
        if (data.length === 0) console.log("No profiles found.");
    }
}

listRecentProfiles();
