
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function countProfiles() {
    console.log('Counting users with avatar_url in database...');

    const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('avatar_url', 'is', null);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(`\n-----------------------------------`);
        console.log(`✅ TOTAL PROFILES WITH AVATAR: ${count}`);
        console.log(`-----------------------------------\n`);
    }
}

countProfiles();
