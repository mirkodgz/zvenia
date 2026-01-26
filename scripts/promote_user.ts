
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0MTc2MywiZXhwIjoyMDgyNjE3NzYzfQ.7NDs-99j4TtSDwkol4OVRTIeyFWJYd6LzzMFeHuQdK0";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function main() {
    const email = "g.zvenia@gmail.com";
    const password = "ZveniaAdmin2024!";
    const role = "Administrator"; // Must match case in roles.ts

    console.log(`--- PROMOTING USER [${email}] ---`);

    try {
        // 1. Find the user in Auth
        console.log("1. Searching in Auth...");
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) throw listError;

        const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (!user) {
            console.error("❌ USER NOT FOUND in Auth (Has registered yet?)");
            return;
        }

        console.log(`   User Found (ID: ${user.id})`);

        // 2. Update Password & Confirm Email (just in case)
        console.log("2. Setting Password & Confirming...");
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            password: password,
            email_confirm: true,
            user_metadata: {
                ...user.user_metadata,
                role: role // Update metadata too for consistency
            }
        });

        if (updateError) {
            console.error("   ❌ Password Update Failed: " + updateError.message);
            throw updateError;
        }
        console.log("   ✅ Password updated.");

        // 3. Update Profile Role
        console.log("3. Updating Database Profile Role...");

        // Check if profile exists first
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

        if (profile) {
            const { error: roleError } = await supabase
                .from('profiles')
                .update({ role: role })
                .eq('id', user.id);

            if (roleError) console.error("   ❌ Role Update Failed: " + roleError.message);
            else console.log("   ✅ Profile Role updated to Administrator.");
        } else {
            // If profile is missing (rare for google logins unless trigger failed), create it
            console.log("   ⚠️ Profile missing. Creating it...");
            const { error: insertError } = await supabase.from('profiles').insert({
                id: user.id,
                email: email,
                role: role,
                full_name: user.user_metadata.full_name || "Admin User",
                updated_at: new Date().toISOString()
            });

            if (insertError) console.error("   ❌ Profile Creation Failed: " + insertError.message);
            else console.log("   ✅ Profile Created with Administrator role.");
        }

    } catch (err: any) {
        console.error("\nFATAL ERROR: " + err.message);
    }
}

main();
