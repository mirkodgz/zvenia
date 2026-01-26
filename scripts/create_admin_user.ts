
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
    const email = "testzvenia2@gmail.com";
    const password = "TestUserZvenia2024!";
    const role = "Administrator";

    console.log(`START_SCRIPT`);

    try {
        let userId: string | null = null;

        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;

        const existingUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (existingUser) {
            console.log(`USER_EXISTS_FOUND_ID: ${existingUser.id}`);
            userId = existingUser.id;

            await supabase.auth.admin.updateUserById(userId, {
                password: password,
                email_confirm: true,
                user_metadata: { full_name: "Test Administrator" }
            });
        } else {
            console.log(`CREATING_NEW_AUTH_USER...`);
            const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { full_name: "Test Administrator" }
            });

            if (createError) {
                console.log("CREATE_ERROR: " + createError.message);
                // If error is unique constraint, it means we missed it in list, try finding again?
                // Actually, let's just assume we failed and print it.
                return;
            }
            userId = newUser.user.id;
            console.log(`CREATED_AUTH_ID: ${userId}`);
        }

        if (!userId) return;

        // PROFILE UPSERT
        console.log("UPSERTING_PROFILE...");

        const { error: profileError } = await supabase.from('profiles').upsert({
            id: userId,
            email: email,
            role: role,
            full_name: "Test Administrator",
            first_name: "Test",
            last_name: "Administrator",
            nationality: "United States",
            profession: "Other",
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

        if (profileError) {
            console.log("PROFILE_UPSERT_FAIL: " + profileError.message);
        } else {
            console.log("PROFILE_UPSERT_SUCCESS");
        }

    } catch (err: any) {
        console.log("FATAL: " + err.message);
    }
    console.log("DONE");
}

main();
