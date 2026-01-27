
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('CRITICAL: Missing Supabase keys');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    console.log("🔍 Attempting DIRECT INSERT into 'profiles' to reveal SQL errors...");

    // Generate a random UUID for testing (simulating a new auth user id)
    const crypto = await import('crypto');
    const fakeId = crypto.randomUUID();
    const email = `direct_test_${Date.now()}@dgzconsulting.com`;

    const payload = {
        id: fakeId,
        email: email,
        full_name: "Direct Debug",
        first_name: "Direct",
        last_name: "Debug",
        username: `direct_debug_${Date.now()}`,
        role: 'Basic',
        profession: 'Miner',
        country: 'Australia'
    };

    const { data, error } = await supabase
        .from('profiles')
        .insert(payload)
        .select();

    if (error) {
        console.error('❌ DIRECT INSERT FAILED! Here is the REAL SQL error:');
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log('✅ DIRECT INSERT SUCCESS!');
        console.log('Inserted:', data);
        // Clean up
        await supabase.from('profiles').delete().eq('id', fakeId);
    }
}

main();
