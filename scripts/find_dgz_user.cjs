
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findUser() {
    const email = 'team@dgzconsulting.com';
    console.log(`Searching for '${email}'...`);

    // Check Profiles
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (error) console.error('Profile Error:', error.message);
    if (profile) {
        console.log('✅ Found PROFILE:');
        console.log(`   ID: ${profile.id}`);
        console.log(`   Email: ${profile.email}`);
        console.log(`   Country: ${profile.country}`);
        console.log(`   Profession: ${profile.profession}`);
        console.log(`   Created At: ${profile.created_at}`);
    } else {
        console.log('❌ No PROFILE found.');
    }

    // Check Auth Users (Admin only) - we might not have permission via JS client unless using service role (which we are)
    // Actually, supabase-js admin API:
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        console.error('Auth Error:', authError.message);
    } else {
        const found = users.find(u => u.email === email);
        if (found) {
            console.log('✅ Found AUTH USER:', found.id, found.email, 'Confirmed:', found.email_confirmed_at);
        } else {
            console.log('❌ No AUTH USER found.');
        }
    }
}

findUser();
