
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function inspect() {
    console.log('--- INSPECTING PODCASTS ---');
    const { data, error } = await supabase.from('podcasts').select('*').limit(1);
    if (error) {
        console.error('Error:', error.message);
    } else {
        if (data.length > 0) {
            console.log('COLUMNS:', Object.keys(data[0]).join(', '));
            console.log('SAMPLE ROW:', JSON.stringify(data[0], null, 2));
        } else {
            console.log('Table exists but is empty.');
            // Try to get definition via error or just infer it exists
        }
    }
}

inspect();
