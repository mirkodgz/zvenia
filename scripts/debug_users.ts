
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0MTc2MywiZXhwIjoyMDgyNjE3NzYzfQ.7NDs-99j4TtSDwkol4OVRTIeyFWJYd6LzzMFeHuQdK0";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
    const email = "g.zvenia@gmail.com";
    const password = "ZveniaAdmin2024!";

    console.log(`CHECKING USER: ${email}`);

    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.log("ERROR LISTING USERS: " + error.message);
        return;
    }

    console.log(`TOTAL USERS FOUND: ${users.length}`);
    users.forEach(u => console.log(` - ${u.email} [${u.id}]`));

    const user = users.find(u => u.email?.toLowerCase().trim() === email.toLowerCase().trim());

    if (user) {
        console.log(`MATCH FOUND: ${user.id}`);
        // UPDATE
        await supabase.auth.admin.updateUserById(user.id, {
            password: password,
            email_confirm: true,
            user_metadata: { role: 'Administrator', full_name: 'Admin Zvenia' }
        });
        console.log("AUTH UPDATED OK");

        // PROFILE
        const { error: pErr } = await supabase.from('profiles').upsert({
            id: user.id,
            email: email,
            role: 'Administrator',
            full_name: 'Admin Zvenia'
        }, { onConflict: 'id' });

        if (pErr) console.log("PROFILE ERROR: " + pErr.message);
        else console.log("PROFILE UPDATED OK");

    } else {
        console.log("NO MATCH FOUND FOR " + email);
    }
}

main();
