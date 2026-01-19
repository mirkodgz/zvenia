
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSignupFlow() {
    const timestamp = Date.now();
    const email = `test.signup.${timestamp}@gmail.com`;
    const password = 'password123';
    const metadata = {
        full_name: 'Test User',
        profession: 'Geologist',
        country: 'Chile' // Testing the new field
    };

    console.log(`1. Attempting SignUp for ${email}...`);
    console.log('   Metadata:', metadata);

    // 1. Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
    });

    if (authError) {
        console.error('❌ Auth Error:', authError.message);
        return;
    }

    const userId = authData.user?.id;
    console.log(`✅ Auth User Created. ID: ${userId}`);

    // Wait for trigger to fire
    await new Promise(r => setTimeout(r, 2000));

    // 2. Check Profile
    console.log('2. Checking Profiles table (checking for trigger mapping)...');
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (profileError) {
        console.error('❌ Profile Fetch Error:', profileError.message);
    } else {
        console.log('   Profile Data:', profile);

        // Validation
        const missing = [];
        if (profile.country !== 'Chile') missing.push('country');
        if (profile.profession !== 'Geologist') missing.push('profession');
        if (profile.full_name !== 'Test User') missing.push('full_name');

        if (missing.length > 0) {
            console.log(`⚠️  WARNING: The trigger did NOT map these fields: ${missing.join(', ')}`);
            console.log('   (They are likely NULL in the database)');
        } else {
            console.log('✅ SUCCESS: All fields mapped correctly!');
        }
    }
}

testSignupFlow();
