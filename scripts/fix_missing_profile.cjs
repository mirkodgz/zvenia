
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixMissingProfile() {
    const email = 'team@dgzconsulting.com';
    console.log(`Fixing profile for ${email}...`);

    // 1. Get Auth User ID
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError || !users) {
        console.error('Auth List Error:', authError);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error('❌ Auth User not found!');
        return;
    }

    console.log(`✅ Found Auth User: ${user.id}`);
    console.log(`   Confirmed At: ${user.email_confirmed_at}`);

    // 2. Check if Profile exists
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

    if (profile) {
        console.log('⚠️ Profile already exists (Unexpected if trigger was off).');
        console.log(profile);
    } else {
        console.log('   Profile missing (Expected). Creating manually...');

        // 3. Create Profile (Testing the V3 logic manually)
        // Metadata might be in user.user_metadata
        const meta = user.user_metadata || {};
        const timestamp = new Date().toISOString();

        const payload = {
            id: user.id,
            email: user.email,
            username: meta.username || email.split('@')[0], // The logic we want to test
            full_name: meta.full_name || '',
            avatar_url: meta.avatar_url || null,
            profession: meta.profession || null,
            country: meta.country || null,
            role: meta.role || 'Basic',
            created_at: timestamp,
            updated_at: timestamp
        };

        console.log('   Inserting Payload:', payload);

        const { error: insertError } = await supabase.from('profiles').insert(payload);

        if (insertError) {
            console.error('❌ Manual Insert Failed:', insertError);
        } else {
            console.log('✅ Profile created successfully!');
        }
    }

    // 4. Force Confirm if needed? 
    // User said "me sale email no confirmado".
    if (!user.email_confirmed_at) {
        console.log('   User NOT confirmed. Attempting to manual confirm via Admin API...');
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            email_confirm: true
        });
        if (updateError) {
            console.error('   Confirmation Update Failed:', updateError);
        } else {
            console.log('   ✅ User manually confirmed.');
        }
    }
}

fixMissingProfile();
