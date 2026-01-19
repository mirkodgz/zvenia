
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findTestUser() {
    console.log("Searching for 'test1'...");

    // Search in profiles by partial email or name
    const { data: byEmail } = await supabase.from('profiles').select('*').ilike('email', '%test1%');
    const { data: byName } = await supabase.from('profiles').select('*').ilike('full_name', '%test1%');
    const { data: byUser } = await supabase.from('profiles').select('*').ilike('username', '%test1%');

    const all = [...(byEmail || []), ...(byName || []), ...(byUser || [])];

    if (all.length > 0) {
        console.log('✅ Found User(s):');
        console.log(all);
    } else {
        console.log('❌ No user found matching "test1" in email/name/username.');
    }
}

findTestUser();
