
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function countProfiles() {
    // console.log('Counting...'); 
    // Minimal logging to avoid buffer issues

    // Check total profiles
    const { count: total } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    // Check with avatars
    const { count: withAvatar } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('avatar_url', 'is', null);

    console.log(`TOTAL_PROFILES: ${total}`);
    console.log(`WITH_AVATAR: ${withAvatar}`);
}

countProfiles();
