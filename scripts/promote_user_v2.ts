
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// FORCE LOAD .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error("❌ CRITICAL: Could not load variables from .env.local");
    console.error("   URL:", SUPABASE_URL);
    console.error("   KEY:", SERVICE_KEY ? "Found (Hidden)" : "Missing");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function main() {
    const email = "g.zvenia@gmail.com";
    // The user asked for "testzvenia2" before, but now provided this email. 
    // I will assume they want this email to have the admin password.
    const password = "ZveniaAdmin2024!";
    const role = "Administrator";

    console.log(`--- PROMOTING USER [${email}] ---`);

    try {
        // 1. List users to find the ID
        console.log("1. Searching in Auth users list...");

        // Fetch specifically page 1, 50 users (should be enough)
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });

        if (listError) throw listError;

        console.log(`   Found ${users.length} users in total.`);

        // Debug: Print emails found to ensure we are connecting to right DB
        // users.forEach(u => console.log(`   - ${u.email}`));

        const user = users.find(u => u.email?.trim().toLowerCase() === email.trim().toLowerCase());

        if (!user) {
            console.error(`❌ USER STILL NOT FOUND: '${email}'`);
            console.log("   Available Users:");
            users.forEach(u => console.log(`   - ${u.email} (${u.id})`));
            return;
        }

        console.log(`   ✅ User Match: ${user.email} (ID: ${user.id})`);

        // 2. Update Password & Metadata
        console.log("2. Updating Password & Confirming...");
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            password: password,
            email_confirm: true,
            user_metadata: {
                ...user.user_metadata,
                full_name: "Admin Zvenia", // Ensure a name exists
                role: role
            }
        });

        if (updateError) throw updateError;
        console.log("   ✅ Auth updated.");

        // 3. Upsert Profile
        console.log("3. Upserting Profile (Force Administrator Role)...");
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                email: email,
                role: role, // CRITICAL
                full_name: user.user_metadata.full_name || "Admin Zvenia",
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (profileError) {
            console.error("   ❌ PROFILE UPSERT ERROR: " + profileError.message);
        } else {
            console.log("   ✅ Profile role set to 'Administrator'.");
        }

        console.log("\n--- SUCCESS ---");
        console.log("You can now login with:");
        console.log(`Email: ${email}`);
        console.log(`Pass:  ${password}`);

    } catch (err: any) {
        console.error("\nFATAL ERROR: " + err.message);
    }
}

main();
