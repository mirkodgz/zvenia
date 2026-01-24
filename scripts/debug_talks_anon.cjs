require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTalks() {
    console.log('Fetching talks with ANON key...');
    const { data, error } = await supabase.from('talks').select('*').limit(5);

    if (error) {
        console.error('Error fetching talks:', error);
    } else {
        console.log(`Success! Found ${data.length} talks.`);
        if (data.length > 0) {
            console.log('Sample talk:', data[0].title);
        } else {
            console.log('WARNING: DATA IS EMPTY. This suggests RLS is blocking access.');
        }
    }
}

checkTalks();
