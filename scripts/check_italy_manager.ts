
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Force load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY is missing in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
    console.log("--- CHECKING ITALY COUNTRY MANAGER DATA ---");

    try {
        // 1. Get Country ID for IT
        const { data: country, error: countryError } = await supabase
            .from('countries')
            .select('id, display_name')
            .eq('code', 'IT')
            .single();

        if (countryError || !country) {
            console.error("❌ Italy (IT) not found in countries table.");
            if (countryError) console.error(countryError);
            return;
        }

        console.log(`✅ Country Found: ${country.display_name} (ID: ${country.id})`);

        // 2. Find Manager
        const { data: manager, error: managerError } = await supabase
            .from('profiles')
            .select('id, full_name, email, role')
            .eq('work_country', country.id)
            .eq('role', 'CountryManager')
            .single();

        if (managerError) {
            if (managerError.code === 'PGRST116') { // code for 0 rows
                console.log("⚠️ No Country Manager found for Italy.");
            } else {
                console.error("❌ Error fetching manager:", managerError);
            }
        } else if (manager) {
            console.log(`✅ Manager Found: ${manager.full_name} (${manager.email})`);
        } else {
            console.log("⚠️ No manager returned (unexpected state).");
        }

    } catch (err: any) {
        console.error("FATAL ERROR: " + err.message);
    }
}

main();
