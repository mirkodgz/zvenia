
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkKwame() {
    const email = 'kwameamponsahyeboah7@gmail.com';
    console.log(`Checking DB for: ${email}`);

    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, avatar_url')
        .eq('email', email)
        .maybeSingle();

    if (error) {
        console.error('Error:', error);
    } else if (data) {
        console.log('Profile Found:');
        console.log(data);
    } else {
        console.log('User not found in Profiles table.');
    }
}

checkKwame();
