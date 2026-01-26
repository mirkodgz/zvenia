
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
    console.log(`--- COUNTING COUNTRY MANAGERS ---`);

    try {
        const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'CountryManager');

        if (error) throw error;

        console.log(`\nTOTAL 'CountryManager' USERS: ${count}`);

    } catch (err: any) {
        console.error("ERROR: " + err.message);
    }
}

main();
