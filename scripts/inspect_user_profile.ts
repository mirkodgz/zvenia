
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_EMAIL = 'andresrp0795@gmail.com';

async function inspect() {
    console.log(`Inspecting user: ${TARGET_EMAIL}`);

    // 1. Get Auth User (Raw Metadata)
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        console.error("Auth Error:", authError);
        return;
    }

    const user = users.find(u => u.email === TARGET_EMAIL);

    if (!user) {
        console.error("User not found in Auth.");
        return;
    }

    console.log("--- Auth Data ---");
    console.log("ID:", user.id);
    console.dir(user.user_metadata, { depth: null });

    // 2. Get Public Profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error("Profile Error:", profileError);
    } else {
        console.log("--- Public Profile Data ---");
        console.log(profile);
    }
}

inspect();
