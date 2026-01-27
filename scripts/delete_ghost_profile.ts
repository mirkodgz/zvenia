
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('CRITICAL: Missing Supabase keys in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
    const email = 'team@dgzconsulting.com';
    console.log(`🔍 Checking for ghost profile: ${email}`);

    // Check if it exists
    const { data: profile, error: findError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

    if (findError && findError.code !== 'PGRST116') {
        console.error('Error finding profile:', findError);
        return;
    }

    if (!profile) {
        console.log('✅ No ghost profile found. You are good to go!');
        return;
    }

    console.log(`👻 Found ghost profile [ID: ${profile.id}]. Deleting...`);

    const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('email', email);

    if (deleteError) {
        console.error('❌ Failed to delete:', deleteError);
    } else {
        console.log('✅ Ghost profile deleted successfully!');
    }
}

main();
