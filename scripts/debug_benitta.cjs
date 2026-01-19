
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUser(email) {
    console.log(`Checking DB for: ${email}`);

    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, avatar_url')
        .eq('email', email);

    if (error) {
        console.error(error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Record Found:');
        console.log(data[0]);
    } else {
        console.log('User not found in profiles.');
    }
}

checkUser('benittawiafe@gmail.com');
