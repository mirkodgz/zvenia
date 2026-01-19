
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_EMAIL = 'andresrp0795@gmail.com';

async function run() {
    console.log(`Checking stored avatar for: ${TARGET_EMAIL}`);

    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email === TARGET_EMAIL);

    if (!user) {
        console.log("User not found.");
        return;
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url, full_name, username')
        .eq('id', user.id)
        .single();

    console.log("--- Profile Data ---");
    console.log("Full Name:", profile?.full_name);
    console.log("Avatar URL:", profile?.avatar_url);
    console.log("--- Auth Metadata ---");
    console.dir(user.user_metadata, { depth: null });
}

run();
