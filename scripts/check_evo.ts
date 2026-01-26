
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0MTc2MywiZXhwIjoyMDgyNjE3NzYzfQ.7NDs-99j4TtSDwkol4OVRTIeyFWJYd6LzzMFeHuQdK0";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
    const email = "evo@zvenia.com";

    console.log(`CHECKING USER: ${email}`);

    // Check Auth
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    const authUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (authUser) {
        console.log(`[AUTH] FOUND ✅ (ID: ${authUser.id})`);
        console.log(`       Confirmed: ${authUser.email_confirmed_at ? 'YES' : 'NO'}`);
        console.log(`       Providers: ${authUser.app_metadata.providers.join(', ')}`);

        // Check Metadata
        console.log("       Metadata:", authUser.user_metadata);
    } else {
        console.log(`[AUTH] NOT FOUND ❌ (Login will verify fail)`);
    }

    // Check Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

    if (profile) {
        console.log(`[PROFILE] FOUND ✅ (ID: ${profile.id})`);
        console.log(`          Role: ${profile.role}`);
    } else {
        console.log(`[PROFILE] NOT FOUND ❌`);
    }
}

main();
