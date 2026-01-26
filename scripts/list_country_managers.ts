
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
    console.log(`--- FETCHING COUNTRY MANAGER DETAILS ---`);

    // 1. Fetch Countries Map
    const { data: countries } = await supabase.from('countries').select('id, display_name');
    const countryMap = new Map();
    countries?.forEach((c: any) => countryMap.set(String(c.id), c.display_name));

    // 2. Fetch Profiles
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('email, full_name, work_country, nationality')
        .eq('role', 'CountryManager');

    if (error) {
        console.error(error);
        return;
    }

    console.log(`Found ${profiles.length} Country Managers:\n`);

    // Pivot to show country distribution
    const countryCounts: Record<string, number> = {};

    profiles.forEach(p => {
        let countryRaw = p.work_country || p.nationality;
        let countryName = 'Unknown';

        if (countryRaw) {
            // Try to look up by ID if it's a number, otherwise use as string
            if (countryMap.has(String(countryRaw))) {
                countryName = countryMap.get(String(countryRaw));
            } else if (isNaN(Number(countryRaw))) {
                countryName = countryRaw;
            } else {
                countryName = `ID:${countryRaw}`;
            }
        }

        countryCounts[countryName] = (countryCounts[countryName] || 0) + 1;
        // console.log(`- ${p.email.padEnd(35)} | Country: ${countryName.padEnd(20)}`);
    });

    console.log("\n--- SUMMARY BY COUNTRY ---");
    Object.entries(countryCounts)
        .sort(([, a], [, b]) => b - a)
        .forEach(([country, count]) => {
            console.log(`${country}: ${count}`);
        });
}

main();
