
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Force load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0MTc2MywiZXhwIjoyMDgyNjE3NzYzfQ.7NDs-99j4TtSDwkol4OVRTIeyFWJYd6LzzMFeHuQdK0";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
    const email = "evo@zvenia.com";
    const newPassword = "1402zvenia";

    console.log(`--- RESETTING PASSWORD FOR [${email}] ---`);

    try {
        // 1. Find User
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;

        const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (!user) {
            console.error("❌ USER NOT FOUND IN AUTH DB");
            return;
        }

        console.log(`✅ User Found: ${user.id}`);

        // 2. Update Password
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            password: newPassword,
            email_confirm: true // Force verify email too
        });

        if (updateError) throw updateError;

        console.log(`✅ Password has been force-updated to: ${newPassword}`);
        console.log("   Try logging in now.");

    } catch (err: any) {
        console.error("FATAL ERROR: " + err.message);
    }
}

main();
