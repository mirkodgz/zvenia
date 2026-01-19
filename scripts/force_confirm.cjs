
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function forceConfirm() {
    const email = 'team@dgzconsulting.com';
    console.log(`Force confirming ${email}...`);

    // 1. Get User
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        console.error('❌ User not found');
        return;
    }

    console.log(`User ID: ${user.id}`);
    console.log(`Current Status: ${user.email_confirmed_at}`);

    // 2. Update
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
        email_confirm: true
    });

    if (error) {
        console.error('❌ Confirmation Failed:', error);
        console.error('Message:', error.message);
        console.error('Status:', error.status);
    } else {
        console.log('✅ Confirmation Success!');
        console.log('Confirmed:', data.user.email_confirmed_at);
    }
}

forceConfirm();
