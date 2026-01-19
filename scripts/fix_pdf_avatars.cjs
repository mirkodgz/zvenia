
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixPdfAvatars() {
    console.log('Scanning DB for PDF avatars...');

    // 1. Select users with PDF avatars
    const { data: users, error: selectError } = await supabase
        .from('profiles')
        .select('email, avatar_url')
        .ilike('avatar_url', '%.pdf');

    if (selectError) {
        console.error('Error selecting users:', selectError);
        return;
    }

    console.log(`Found ${users.length} users with PDF avatars.`);
    if (users.length === 0) return;

    // Log a few for verification
    users.slice(0, 5).forEach(u => console.log(` - ${u.email}: ${u.avatar_url}`));

    // 2. Update them to NULL
    console.log('Resetting these avatars to NULL...');

    // We can do a bulk update or loop. Service Role allows RLS bypass.
    // For 300+ users, loop might be slow but safe. 
    // Actually, we can just do one big update where filter matches.

    const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .ilike('avatar_url', '%.pdf')
        .select();

    if (updateError) {
        console.error('Error updating users:', updateError);
    } else {
        console.log('------------------------------------------------'); // Separator
        console.log(`Successfully reset ${updated.length} avatars.`);
    }
}

fixPdfAvatars().catch(console.error);
