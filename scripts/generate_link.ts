
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0MTc2MywiZXhwIjoyMDgyNjE3NzYzfQ.7NDs-99j4TtSDwkol4OVRTIeyFWJYd6LzzMFeHuQdK0";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
    const email = "g.zvenia@gmail.com";

    console.log(`GENERATING RESET LINK FOR: ${email}`);

    const { data, error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: email,
    });

    if (error) {
        console.log("ERROR: " + error.message);
    } else {
        console.log("SUCCESS! HERE IS YOUR MAGIC LINK:");
        console.log("---------------------------------------------------");
        console.log(data.properties.action_link);
        console.log("---------------------------------------------------");
        console.log("NOTE: This link is valid for creating a new password immediately.");
    }
}

main();
