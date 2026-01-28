
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixZachariah() {
    console.log("🚀 Starting Zachariah Avatar Fix...");

    const email = 'zachariachitanda@gmail.com';
    const newAvatarUrl = 'https://res.cloudinary.com/dun3slcfg/images/v1767637743/cloud-files/WhatsApp-Image-2025-08-06-at-9.22.36-AM/WhatsApp-Image-2025-08-06-at-9.22.36-AM.jpeg?_i=AA';

    // 1. Verify user exists
    const { data: user, error: fetchError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('email', email)
        .single();

    if (fetchError || !user) {
        console.error(`❌ User ${email} not found or error:`, fetchError);
        return;
    }

    console.log(`Found User: ${user.full_name} (ID: ${user.id})`);
    console.log(`Current Avatar: ${user.avatar_url || 'NULL'}`);

    // 2. Update Avatar
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('email', email);

    if (updateError) {
        console.error(`❌ Error updating avatar:`, updateError);
    } else {
        console.log(`✅ Avatar updated successfully to:\n${newAvatarUrl}`);
    }
}

fixZachariah();
