
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugV3Insert() {
    const testId = '22222222-2222-2222-2222-222222222222';
    const email = 'manual_v3@test.com';
    const meta = {
        full_name: 'Manual Tester',
        username: undefined, // Simulate missing username in metadata
        avatar_url: undefined,
        profession: 'Geologist',
        country: 'Chile',
        role: undefined
    };

    console.log("Simulating Trigger V3 Insert Manually...");

    // Logic from V3 SQL:
    // COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
    const username = meta.username || email.split('@')[0];
    const role = meta.role || 'Basic';
    const fullName = meta.full_name || '';

    const payload = {
        id: testId,
        email: email,
        username: username,
        full_name: fullName,
        avatar_url: meta.avatar_url,
        profession: meta.profession,
        country: meta.country,
        role: role
    };

    console.log("Payload:", payload);

    const { error } = await supabase.from('profiles').insert(payload);

    if (error) {
        console.error('❌ Manual Insert Failed:', error);
        console.error('Message:', error.message);
        console.error('Details:', error.details);
    } else {
        console.log('✅ Manual Insert Succeeded! Logic is sound.');
        // Cleanup
        await supabase.from('profiles').delete().eq('id', testId);
    }
}

debugV3Insert();
