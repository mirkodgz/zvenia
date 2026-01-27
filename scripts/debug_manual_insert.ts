
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

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
    const fakeUserId = '00000000-0000-0000-0000-000000000001'; // Fake UUID
    const email = 'team@dgzconsulting.com';
    const role = 'CountryManager';
    const fullName = 'TEST4';

    console.log(`🧪 Attempting manual INSERT into profiles...`);
    console.log(`Data: ID=${fakeUserId}, Email=${email}, Role=${role}, FullName=${fullName}`);

    // Try to cleanup first just in case
    await supabase.from('profiles').delete().eq('id', fakeUserId);

    const { data, error } = await supabase
        .from('profiles')
        .insert({
            id: fakeUserId,
            email: email,
            role: role,
            full_name: fullName
        })
        .select();

    if (error) {
        console.error('❌ INSERT FAILED!');
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        console.error('Details:', error.details);
        console.error('Hint:', error.hint);
    } else {
        console.log('✅ INSERT SUCCESS! The data is valid.');
        // Cleanup
        await supabase.from('profiles').delete().eq('id', fakeUserId);
    }
}

main();
