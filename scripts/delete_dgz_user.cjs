
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteDgzUser() {
    const email = 'team@dgzconsulting.com';
    console.log(`Deleting Auth User: ${email}...`);

    // 1. Get ID
    // We can't query auth.users easy via JS client without admin.
    // But we found the profile ID, which is the user ID.
    const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).single();

    if (!profile) {
        console.log('User profile not found. Already deleted?');
        return;
    }

    const userId = profile.id;

    // 2. Delete User
    const { data, error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
        console.error('Delete Error:', error.message);
    } else {
        console.log(`✅ User ${email} (ID: ${userId}) deleted successfully.`);
    }
}

deleteDgzUser();
