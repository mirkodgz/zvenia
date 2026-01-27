
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
    const email = 'team@dgzconsulting.com';
    const password = 'tempPassword123!';
    const role = 'CountryManager';
    const fullName = 'TEST4';

    console.log(`🧪 Attempting REAL createUser via API...`);

    // 1. Cleanup first
    const { data: search } = await supabase.from('profiles').select('id').eq('email', email).single();
    if (search) {
        console.log("Cleaning up existing profile...");
        await supabase.from('profiles').delete().eq('id', search.id);
    }
    // Also try to find user by email to delete from auth
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        console.log("Cleaning up existing auth user...");
        await supabase.auth.admin.deleteUser(existingUser.id);
    }

    // 2. Create
    console.log("Attempting creation with EXACT SIGNUP PAYLOAD...");
    const randomEmail = `test_${Date.now()}@dgzconsulting.com`;
    // const sUsername = randomEmail.split('@')[0]; // simple username
    const sFirstName = "Debug";
    const sLastName = "User";
    const sFullName = "Debug User";

    const { data, error } = await supabase.auth.admin.createUser({
        email: randomEmail,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: sFullName,
            first_name: sFirstName,
            last_name: sLastName,
            username: `debug_${Date.now()}`,
            role: 'Basic',
            profession: 'Miner',
            country: 'Australia'
        }
    });

    if (error) {
        console.error('❌ EXACT PAYLOAD FAILED!');
        const fs = await import('fs/promises');
        await fs.writeFile('debug_error.log', JSON.stringify(error, null, 2));
    } else {
        console.log('✅ EXACT PAYLOAD SUCCESS!');
        console.log('User ID:', data.user.id);
        // await supabase.auth.admin.deleteUser(data.user.id); // Keep it to verify if needed, or delete.
        await supabase.auth.admin.deleteUser(data.user.id);
    }
}

main();
