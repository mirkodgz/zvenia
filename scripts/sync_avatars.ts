
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
    console.log("Starting Avatar Sync...");

    // 1. List all users
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) {
        console.error("Error fetching users:", error);
        return;
    }

    let updated = 0;

    for (const user of users) {
        const metaAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;

        if (metaAvatar) {
            // Check profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('avatar_url')
                .eq('id', user.id)
                .single();

            // Always sync if metadata exists (Source of Truth)
            if (profile) {
                console.log(`Syncing avatar for ${user.email}...`);

                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        avatar_url: metaAvatar,
                        full_name: user.user_metadata.full_name || user.user_metadata.name
                    })
                    .eq('id', user.id);

                if (updateError) {
                    console.error(`Failed to update ${user.email}:`, updateError);
                } else {
                    updated++;
                }
            }
        }
    }

    console.log(`Sync Complete. Updated ${updated} profiles.`);
}

sync();
