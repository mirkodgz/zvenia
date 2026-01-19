
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testMinimal() {
    const timestamp = Date.now();
    const email = `test.minimal.${timestamp}@gmail.com`;
    const password = 'password123';

    console.log(`Attempting Minimal SignUp for ${email}...`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        // No options.data! relying on trigger defaults.
    });

    if (error) {
        console.error('❌ Minimal Auth Error:', error.message);
    } else {
        console.log('✅ Minimal Auth Succeeded! ID:', data.user?.id);
    }
}

testMinimal();
