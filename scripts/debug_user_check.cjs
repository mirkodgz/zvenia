
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.PUBLIC_SUPABASE_ANON_KEY
);

async function checkUser() {
    const testEmail = 'a.chhaibi@enim.ac.ma';
    console.log(`Checking for email: ${testEmail}`);

    // Check profiles
    const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', testEmail);

    if (pError) console.error('Profiles Error:', pError);
    console.log('Profiles Found:', profiles ? profiles.length : 0);
    if (profiles && profiles.length > 0) console.log(profiles[0]);

    // Check profiles with ILIKE (case insensitive)
    const { data: profilesCase, error: pErrorCase } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', testEmail);

    console.log('Profiles Found (Case Insensitive):', profilesCase ? profilesCase.length : 0);

    // List first 5 emails in profiles to see format
    const { data: allProfiles } = await supabase.from('profiles').select('email').limit(5);
    console.log('Sample emails in DB:', allProfiles);
}

checkUser().catch(console.error);
