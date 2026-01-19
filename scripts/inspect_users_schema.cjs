
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.PUBLIC_SUPABASE_ANON_KEY
);

async function inspectSchema() {
    console.log('--- Inspecting Public Schema ---');

    // Check 'users' table
    console.log('\n1. Checking "users" table...');
    const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);

    if (usersError) {
        console.error('Error fetching "users":', usersError.message);
    } else if (usersData && usersData.length > 0) {
        console.log('Found "users" table. Columns:');
        console.log(JSON.stringify(Object.keys(usersData[0]), null, 2));
        console.log('Sample Row (Partial):', {
            id: usersData[0].id,
            email: usersData[0].email,
            avatar: usersData[0].avatar_url || usersData[0].profile_picture || usersData[0].avatar
        });
    } else {
        console.log('"users" table exists but is empty/inaccessible.');
        // Try inserting a dummy row or just listing structure if possible? 
        // Cannot list structure easily with JS client without data. 
        // We rely on data presence or error.
    }

    // Check 'profiles' table
    console.log('\n2. Checking "profiles" table...');
    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (profilesError) {
        console.error('Error fetching "profiles":', profilesError.message);
    } else if (profilesData && profilesData.length > 0) {
        console.log('Found "profiles" table. Columns:');
        console.log(JSON.stringify(Object.keys(profilesData[0]), null, 2));
    } else {
        console.log('"profiles" table exists but is empty/inaccessible.');
    }
}

inspectSchema().catch(console.error);
