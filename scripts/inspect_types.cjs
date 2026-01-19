
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectSchema() {
    // We can query our own row to guess types, or try to get column info via RPC?
    // Let's just select one row and print types of values.
    const { data: profiles } = await supabase.from('profiles').select('*').limit(1);

    if (profiles && profiles.length > 0) {
        const p = profiles[0];
        console.log('Sample Row Types:');
        console.log('Country:', typeof p.country, `"${p.country}"`);
        console.log('Profession:', typeof p.profession, `"${p.profession}"`);
        console.log('Role:', typeof p.role, `"${p.role}"`);
        console.log('Username:', typeof p.username, `"${p.username}"`);
    } else {
        console.log('No profiles found to inspect.');
    }
}

inspectSchema();
