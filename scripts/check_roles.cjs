
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRoles() {
    const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .limit(10); // just get a sample

    if (error) {
        console.error('Error:', error);
    } else {
        // Unique values
        const roles = [...new Set(data.map(r => r.role))];
        console.log('Existing Roles:', roles);
    }
}

checkRoles();
