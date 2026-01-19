
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUsernameCollision() {
    const target = 'team';
    console.log(`Checking if username '${target}' is taken...`);

    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, username')
        .eq('username', target);

    if (error) {
        console.error('Error:', error);
    } else {
        if (data.length > 0) {
            console.log('⚠️ COLLISION DETECTED! Use(s) found with username "team":');
            console.table(data);
        } else {
            console.log('✅ Username "team" is available.');
        }
    }
}

checkUsernameCollision();
