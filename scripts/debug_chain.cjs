
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugChain() {
    const email = `chain.test.${Date.now()}@test.com`;
    const password = 'password123';

    console.log(`1. Creating Auth User ${email}...`);

    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            country: 'Argentina',
            profession: 'DebugBot',
            full_name: 'Chain Tester'
        }
    });

    if (createError) {
        console.error('❌ Auth Create Failed:', createError);
        return;
    }

    console.log(`✅ Auth User Created: ${user.id}`);

    // Now try to insert profile
    // 2. Check Auto-Created Profile
    console.log('2. Checking Auto-Created Profile...');
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    if (profile) {
        console.log('✅ Trigger Worked! Profile found:');
        console.log(`   Country: ${profile.country}`);
        console.log(`   Role: ${profile.role}`);
        console.log(`   Username: ${profile.username}`);
    } else {
        console.log('❌ Profile MISSING (Trigger failed?)');
    }

    // Check confirmation
    const { data: { user: refetched } } = await supabase.auth.admin.getUserById(user.id);
    console.log(`   Confirmed At: ${refetched.email_confirmed_at}`);

    // Cleanup
    console.log('3. Cleanup...');
    await supabase.auth.admin.deleteUser(user.id);
}

debugChain();
