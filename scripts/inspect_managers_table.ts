
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Force load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
    console.log(`--- INSPECTING 'country_managers' TABLE ---`);

    const { data: managers, error } = await supabase
        .from('country_managers')
        .select('*')
        .limit(5);

    if (error) {
        console.error(error);
        return;
    }

    console.log(`Found ${managers.length} rows in 'country_managers'.`);
    managers.forEach(m => console.log(m));

    console.log(`\n--- COMPARISON WITH 'profiles' (Role=CountryManager) ---`);
    const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'CountryManager');
    console.log(`Real User Profiles with role 'CountryManager': ${count}`);
}

main();
