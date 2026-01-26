
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0MTc2MywiZXhwIjoyMDgyNjE3NzYzfQ.7NDs-99j4TtSDwkol4OVRTIeyFWJYd6LzzMFeHuQdK0";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
    const email = "testzvenia2@gmail.com";
    const password = "TestUserZvenia2024!";

    console.log("SCRIPT_START_BARE");

    try {
        // Try without metadata first
        console.log("CREATING_BARE_USER...");
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (error) {
            console.log("CREATE_ERROR_BARE: " + error.message);
        } else {
            console.log("SUCCESS_BARE_CREATED");
            console.log("NEW_ID: " + data.user.id);

            // Now try update with metadata?
            // console.log("UPDATING_METADATA...");
            // const { error: updErr } = await supabase.auth.admin.updateUserById(data.user.id, {
            //     user_metadata: {
            //         full_name: "Test Zvenia 2"
            //     }
            // });
            // if (updErr) console.log("METADATA_UPDATE_FAIL: " + updErr.message);
            // else console.log("METADATA_UPDATE_SUCCESS");
        }

    } catch (err: any) {
        console.log("FATAL_ERROR: " + err.message);
    }
    console.log("SCRIPT_END");
}

main();
